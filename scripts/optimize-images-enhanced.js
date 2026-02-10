/**
 * Build-time image optimization: responsive WebP/AVIF + blur placeholders.
 * Run: npm run optimize-images
 * Output: public/optimized/*.{webp,avif}, src/data/image-blur-data.json
 */

const sharp = require('sharp');
const { getPlaiceholder } = require('plaiceholder');
const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = path.join(process.cwd(), 'public/Images');
const OUTPUT_DIR = path.join(process.cwd(), 'public/optimized');
const BLUR_OUTPUT = path.join(process.cwd(), 'src/data/image-blur-data.json');

const SIZES = [
  { width: 384, suffix: '-sm', quality: 75 },
  { width: 640, suffix: '-md', quality: 75 },
  { width: 1080, suffix: '-lg', quality: 75 },
  { width: 1920, suffix: '-xl', quality: 80 },
];

const FORMATS = ['webp', 'avif'];

async function processImage(inputPath) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const results = {
    original: path.relative(process.cwd(), inputPath).replace(/\\/g, '/').replace('public/', '/'),
    sizes: {},
    blur: null,
  };

  console.log(`\n📸 Processing: ${filename}`);

  try {
    const buffer = await fs.readFile(inputPath);
    const { base64 } = await getPlaiceholder(buffer);
    results.blur = base64;
    console.log(`  ✓ Generated blur placeholder`);

    const operations = [];
    for (const size of SIZES) {
      for (const format of FORMATS) {
        const outputFilename = `${filename}${size.suffix}.${format}`;
        const outputPath = path.join(OUTPUT_DIR, outputFilename);
        const formatOptions = format === 'webp' ? { quality: size.quality } : { quality: size.quality };
        const op = sharp(inputPath)
          .resize(size.width, null, { fit: 'inside', withoutEnlargement: true })
          [format](formatOptions)
          .toFile(outputPath)
          .then(() => {
            const relPath = `/optimized/${outputFilename}`;
            if (!results.sizes[size.suffix]) results.sizes[size.suffix] = {};
            results.sizes[size.suffix][format] = relPath;
            console.log(`  ✓ ${size.suffix} ${format}`);
          });
        operations.push(op);
      }
    }
    await Promise.all(operations);
    return { filename, data: results };
  } catch (error) {
    console.error(`  ✗ Failed to process ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting build-time image optimization...\n');
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const exts = ['.jpg', '.jpeg', '.png', '.webp'];
  const entries = await fs.readdir(INPUT_DIR, { withFileTypes: true });
  const allImages = entries
    .filter((e) => e.isFile() && exts.includes(path.extname(e.name).toLowerCase()))
    .map((e) => path.join(INPUT_DIR, e.name));

  console.log(`📦 Found ${allImages.length} images to process\n`);

  const CONCURRENCY = 4;
  const imageManifest = {};
  for (let i = 0; i < allImages.length; i += CONCURRENCY) {
    const batch = allImages.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(processImage));
    results.forEach((result) => {
      if (result) imageManifest[result.filename] = result.data;
    });
  }

  await fs.writeFile(BLUR_OUTPUT, JSON.stringify(imageManifest, null, 2));

  console.log(`\n✅ Optimization complete!`);
  console.log(`📊 Processed ${Object.keys(imageManifest).length} images`);
  console.log(`📄 Manifest written to: ${BLUR_OUTPUT}`);
  console.log(`📁 Optimized images in: ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error('❌ Optimization failed:', error);
  process.exit(1);
});
