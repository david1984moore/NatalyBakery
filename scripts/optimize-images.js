/**
 * Pre-optimize images in public/Images for faster loading.
 * Source images are 5000+ px and 1-3 MB each - Next.js has to read/decode
 * the full file before resizing. This script reduces source size so
 * on-demand optimization is much faster.
 *
 * Run: npm run optimize-images
 * (Run once, or when you add new images)
 */

const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'Images')
const MAX_WIDTH = 1920
const JPEG_QUALITY = 82
const MIN_FILE_KB = 300 // Skip images already under 300KB

async function optimizeImages() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.warn('Skipping image optimization: sharp not installed. Run "npm install" to enable.')
    return
  }

  const files = fs.readdirSync(IMAGES_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

  if (files.length === 0) {
    console.log('No images found in public/Images')
    return
  }

  console.log(`Optimizing ${files.length} images (max width: ${MAX_WIDTH}px, JPEG quality: ${JPEG_QUALITY})...\n`)

  for (const file of files) {
    const inputPath = path.join(IMAGES_DIR, file)
    const ext = path.extname(file).toLowerCase()
    const isJpeg = /\.jpe?g$/i.test(ext)

    try {
      const stats = fs.statSync(inputPath)
      if (stats.size < MIN_FILE_KB * 1024) {
        console.log(`  Skip ${file} (already small: ${(stats.size / 1024).toFixed(1)} KB)`)
        continue
      }

      const pipeline = sharp(inputPath)
      const meta = await pipeline.metadata()
      const { width, height } = meta

      if (width <= MAX_WIDTH && height <= MAX_WIDTH) {
        console.log(`  Skip ${file} (dimensions already within ${MAX_WIDTH}px)`)
        continue
      }

      const needsResize = width > MAX_WIDTH || height > MAX_WIDTH
      const resizeOptions = needsResize ? { width: MAX_WIDTH, height: MAX_WIDTH, fit: 'inside' } : {}

      let outputPipeline = sharp(inputPath)
      if (needsResize) {
        outputPipeline = outputPipeline.resize(resizeOptions)
      }

      if (isJpeg) {
        outputPipeline = outputPipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      } else if (ext === '.png') {
        outputPipeline = outputPipeline.png({ compressionLevel: 9 })
      }

      const tempPath = inputPath + '.tmp'
      await outputPipeline.toFile(tempPath)

      const newStats = fs.statSync(tempPath)
      fs.renameSync(tempPath, inputPath)

      const saved = ((stats.size - newStats.size) / 1024).toFixed(1)
      const pct = (((stats.size - newStats.size) / stats.size) * 100).toFixed(0)
      console.log(`  ✓ ${file}: ${(stats.size / 1024).toFixed(1)} KB → ${(newStats.size / 1024).toFixed(1)} KB (saved ${saved} KB, -${pct}%)`)
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`)
    }
  }

  console.log('\nDone. Images are now optimized for faster loading.')
}

optimizeImages().catch((err) => {
  console.error(err)
  process.exit(1)
})
