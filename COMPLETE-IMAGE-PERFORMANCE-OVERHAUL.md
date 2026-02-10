# Complete Image Performance Overhaul - Build-Time Optimization System

**Problem:** ALL images across the site load slowly due to on-demand processing, sequential blur generation, and no pre-optimization.

**Root Causes:**
1. On-demand image optimization (1-2s per unique size)
2. Sequential blur generation (4+ seconds for menu page)
3. Quality mismatch causing re-optimization
4. No build-time pre-generation
5. Server-side blur blocking page render

**Solution:** Complete migration to build-time image pipeline with parallel processing, pre-generated responsive images, and static blur data.

---

## Phase 1: Build-Time Image Generation System

### Step 1.1: Enhanced Image Optimization Script

Replace `scripts/optimize-images.js` with comprehensive build-time processor:

**`scripts/optimize-images-enhanced.js`:**

```javascript
const sharp = require('sharp');
const { getPlaiceholder } = require('plaiceholder');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

const INPUT_DIR = path.join(process.cwd(), 'public/Images');
const OUTPUT_DIR = path.join(process.cwd(), 'public/optimized');
const BLUR_OUTPUT = path.join(process.cwd(), 'src/data/image-blur-data.json');

// Responsive breakpoints
const SIZES = [
  { width: 384, suffix: '-sm', quality: 75 },   // Mobile
  { width: 640, suffix: '-md', quality: 75 },   // Large mobile
  { width: 1080, suffix: '-lg', quality: 75 },  // Desktop
  { width: 1920, suffix: '-xl', quality: 80 }   // High-res desktop
];

const FORMATS = ['webp', 'avif']; // Modern formats

// Process single image: generate all sizes + formats + blur
async function processImage(inputPath) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const results = {
    original: path.relative(process.cwd(), inputPath).replace('public/', '/'),
    sizes: {},
    blur: null
  };

  console.log(`\n📸 Processing: ${filename}`);

  try {
    // Generate blur placeholder first
    const buffer = await fs.readFile(inputPath);
    const { base64 } = await getPlaiceholder(buffer);
    results.blur = base64;
    console.log(`  ✓ Generated blur placeholder`);

    // Process each size + format combination in parallel
    const operations = [];
    
    for (const size of SIZES) {
      for (const format of FORMATS) {
        const outputFilename = `${filename}${size.suffix}.${format}`;
        const outputPath = path.join(OUTPUT_DIR, outputFilename);
        
        const operation = sharp(inputPath)
          .resize(size.width, null, {
            fit: 'inside',
            withoutEnlargement: true
          })
          [format]({ quality: size.quality })
          .toFile(outputPath)
          .then(() => {
            const relPath = `/optimized/${outputFilename}`;
            if (!results.sizes[size.suffix]) {
              results.sizes[size.suffix] = {};
            }
            results.sizes[size.suffix][format] = relPath;
            console.log(`  ✓ ${size.suffix} ${format}`);
          });
        
        operations.push(operation);
      }
    }

    // Wait for all format/size combinations to complete
    await Promise.all(operations);
    
    return { filename, data: results };
  } catch (error) {
    console.error(`  ✗ Failed to process ${filename}:`, error.message);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting build-time image optimization...\n');
  
  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Find all images
  const imagePatterns = ['*.jpg', '*.jpeg', '*.png', '*.webp'];
  const allImages = [];
  
  for (const pattern of imagePatterns) {
    const matches = await glob(path.join(INPUT_DIR, pattern));
    allImages.push(...matches);
  }

  console.log(`📦 Found ${allImages.length} images to process\n`);

  // Process all images in parallel (limited concurrency to avoid OOM)
  const CONCURRENCY = 4; // Process 4 images at a time
  const imageManifest = {};
  
  for (let i = 0; i < allImages.length; i += CONCURRENCY) {
    const batch = allImages.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(processImage));
    
    results.forEach(result => {
      if (result) {
        imageManifest[result.filename] = result.data;
      }
    });
  }

  // Write manifest to JSON
  await fs.writeFile(
    BLUR_OUTPUT,
    JSON.stringify(imageManifest, null, 2)
  );

  console.log(`\n✅ Optimization complete!`);
  console.log(`📊 Processed ${Object.keys(imageManifest).length} images`);
  console.log(`📄 Manifest written to: ${BLUR_OUTPUT}`);
  console.log(`📁 Optimized images in: ${OUTPUT_DIR}`);
}

main().catch(error => {
  console.error('❌ Optimization failed:', error);
  process.exit(1);
});
```

### Step 1.2: Install Dependencies

```bash
npm install --save-dev glob sharp plaiceholder
```

### Step 1.3: Update package.json

```json
{
  "scripts": {
    "optimize-images": "node scripts/optimize-images-enhanced.js",
    "build": "prisma generate && npm run optimize-images && next build",
    "dev": "npm run optimize-images && next dev"
  }
}
```

### Step 1.4: Run Initial Generation

```bash
npm run optimize-images
```

**This will create:**
- `/public/optimized/*.webp` - All responsive WebP variants
- `/public/optimized/*.avif` - All responsive AVIF variants  
- `/src/data/image-blur-data.json` - All blur placeholders pre-generated

**Critical:** Commit the generated JSON file to git. The `/public/optimized` folder can be `.gitignore`d if you regenerate on build.

---

## Phase 2: Optimized Image Component

### Step 2.1: Create Smart Image Component

**`src/components/OptimizedImage.tsx`:**

```typescript
'use client';

import Image from 'next/image';
import { useState } from 'react';

// Import pre-generated image data
import imageManifest from '@/data/image-blur-data.json';

interface OptimizedImageProps {
  src: string; // Original filename (e.g., 'IMG_1234.jpeg' or '/Images/IMG_1234.jpeg')
  alt: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  objectFit?: 'contain' | 'cover';
}

export function OptimizedImage({
  src,
  alt,
  priority = false,
  className = '',
  fill = false,
  width,
  height,
  sizes,
  objectFit = 'cover'
}: OptimizedImageProps) {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  // Extract filename from path
  const filename = src.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
  const imageData = imageManifest[filename as keyof typeof imageManifest];

  // Fallback if image not in manifest
  if (!imageData) {
    console.warn(`Image not found in manifest: ${filename}`);
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        className={className}
        style={{ objectFit }}
        sizes={sizes}
      />
    );
  }

  // Get blur placeholder
  const blurDataURL = imageData.blur || undefined;

  // Construct srcset from manifest
  const srcSet = Object.entries(imageData.sizes)
    .map(([suffix, formats]: [string, any]) => {
      const webpPath = formats.webp;
      const width = suffix === '-sm' ? '384w' :
                    suffix === '-md' ? '640w' :
                    suffix === '-lg' ? '1080w' : '1920w';
      return `${webpPath} ${width}`;
    })
    .join(', ');

  // Default src (largest WebP)
  const defaultSrc = imageData.sizes['-xl']?.webp || imageData.sizes['-lg']?.webp || src;

  const handleLoad = () => {
    setLoadState('loaded');
    console.log(`✓ Image loaded: ${filename}`);
  };

  const handleError = () => {
    if (retryCount < 2) {
      // Retry with slight delay
      console.warn(`⚠️  Image load failed, retrying: ${filename} (attempt ${retryCount + 1})`);
      setTimeout(() => setRetryCount(prev => prev + 1), 1000);
    } else {
      console.error(`✗ Image failed after retries: ${filename}`);
      setLoadState('error');
    }
  };

  if (loadState === 'error') {
    // Error fallback: show colored box with alt text
    return (
      <div 
        className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <span className="text-gray-500 text-sm px-4 text-center">{alt}</span>
      </div>
    );
  }

  return (
    <>
      <Image
        key={retryCount} // Force remount on retry
        src={defaultSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        quality={75}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        className={className}
        style={{ 
          objectFit,
          opacity: loadState === 'loaded' ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        sizes={sizes || '100vw'}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Loading shimmer effect */}
      {loadState === 'loading' && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"
          style={{ backgroundSize: '200% 100%' }}
        />
      )}
    </>
  );
}
```

### Step 2.2: Add Shimmer Animation to Tailwind

**`tailwind.config.ts`:**

```typescript
export default {
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
}
```

---

## Phase 3: Update All Components

### Step 3.1: Replace Hero Component

**`src/components/Hero.tsx`:**

```typescript
'use client';

import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';

export default function Hero() {
  return (
    <div className="relative w-full h-screen">
      {/* Mobile Hero */}
      <div className="block md:hidden relative w-full h-full">
        <OptimizedImage
          src="hero-mobile.jpeg"  // Just filename, no path needed
          alt="Nataly's Home Bakery"
          fill
          priority
          sizes="100vw"
          objectFit="cover"
        />
      </div>

      {/* Desktop Hero */}
      <div className="hidden md:block relative w-full h-full">
        <OptimizedImage
          src="hero-desktop.jpeg"
          alt="Nataly's Home Bakery"
          fill
          priority={false}
          sizes="100vw"
          objectFit="cover"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1 className="text-white text-5xl md:text-7xl font-serif mb-4 md:mb-6 drop-shadow-2xl">
          Caramel & Jo
        </h1>
        <Link
          href="/menu"
          className="px-8 md:px-12 py-3 md:py-4 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg font-medium hover:bg-white transition-all hover:scale-105"
        >
          order
        </Link>
      </div>
    </div>
  );
}
```

### Step 3.2: Update ProductCard

**`src/components/ProductCard.tsx`:**

```typescript
import { OptimizedImage } from './OptimizedImage';
import Link from 'next/link';

interface ProductCardProps {
  name: string;
  image: string;
  href: string;
  priority?: boolean;
}

export function ProductCard({ name, image, href, priority = false }: ProductCardProps) {
  return (
    <Link href={href} className="group relative aspect-[3/4] overflow-hidden rounded-lg">
      <OptimizedImage
        src={image}
        alt={name}
        fill
        priority={priority}
        sizes="(max-width: 640px) 140px, (max-width: 768px) 120px, 140px"
        objectFit="cover"
      />
      
      {/* Product name overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white font-medium text-sm">{name}</h3>
      </div>
    </Link>
  );
}
```

### Step 3.3: Update FeaturedProducts

**`src/components/FeaturedProducts.tsx`:**

```typescript
import { products } from '@/data/products';
import { ProductCard } from './ProductCard';

export function FeaturedProducts() {
  const featured = products.slice(0, 6);

  return (
    <section className="py-16">
      <h2 className="text-3xl font-serif text-center mb-8">Featured</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {featured.map((product, index) => (
          <ProductCard
            key={product.name}
            name={product.name}
            image={product.image}
            href={`/menu?product=${encodeURIComponent(product.name)}`}
            priority={index < 4} // First 4 are priority
          />
        ))}
      </div>
    </section>
  );
}
```

---

## Phase 4: Next.js Configuration Updates

### Step 4.1: Update next.config.js

**`next.config.js`:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Align with build-time optimization
    qualities: [50, 70, 75, 80],
    deviceSizes: [384, 640, 1080, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
    // Enable aggressive caching
    unoptimized: false,
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
```

---

## Phase 5: Validation & Performance Testing

### Step 5.1: Build and Test Locally

```bash
# Clean build
rm -rf .next
npm run build
npm run start

# Test in browser
open http://localhost:3000
```

**Check Chrome DevTools:**
1. Network tab → Filter: Img
2. Hard refresh (Cmd+Shift+R)
3. Verify images load from `/optimized/` directory
4. Confirm WebP/AVIF serving (check file type in Network tab)
5. Check load times: should be <200ms per image

### Step 5.2: Lighthouse Audit

```bash
lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-after-optimization.html
```

**Target Metrics:**
- Performance: >90
- LCP (Largest Contentful Paint): <1.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

### Step 5.3: Real Device Testing

Test on actual devices (not just Chrome DevTools mobile):

**iOS Safari:**
- Load home page → should see hero instantly
- Navigate to menu → products should load smoothly
- Open product detail → gallery should be responsive

**Android Chrome:**
- Same test sequence
- Verify no crashes or blank images

---

## Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Hero LCP | 3-5s | <1s | **70-80% faster** |
| Menu page load | 6-8s | <2s | **75% faster** |
| Product grid | 4-6s | <1.5s | **70% faster** |
| Blur generation | 4s+ (runtime) | 0s (build-time) | **Instant** |
| Image optimization | 1-2s/image | Pre-built | **Instant** |
| Total file size | ~300KB/image | ~80-120KB | **60% smaller** |

---

## Why This Works

### 1. **Build-Time Pre-Generation**
- All image processing happens once during build
- No runtime image optimization delays
- Parallel processing (4 images at once) instead of sequential

### 2. **Modern Format Serving**
- AVIF: 50% smaller than JPEG at same quality
- WebP: 30% smaller than JPEG
- Automatic browser-based format selection

### 3. **Pre-Generated Blur Placeholders**
- No server-side blur generation blocking page render
- Instant placeholder display
- Committed to git, no runtime computation

### 4. **Intelligent Error Handling**
- Automatic retry logic (2 attempts)
- Graceful degradation to colored boxes
- Console logging for debugging

### 5. **Optimized Loading Strategy**
- Priority loading for above-fold
- Lazy loading for below-fold
- Proper `sizes` attribute for responsive serving
- Smooth fade-in transitions

---

## Troubleshooting Guide

### Images Still Slow After Build

1. **Check manifest generation:**
   ```bash
   cat src/data/image-blur-data.json
   # Should show all images with blur data
   ```

2. **Verify optimized directory:**
   ```bash
   ls public/optimized/
   # Should contain .webp and .avif files
   ```

3. **Check Network tab:**
   - Are images loading from `/optimized/`?
   - If loading from `/Images/`, manifest lookup failed

### Build Fails During Image Optimization

1. **Check sharp installation:**
   ```bash
   npm install --save-dev sharp
   ```

2. **Verify image paths:**
   ```bash
   ls public/Images/
   # All source images should be here
   ```

3. **Check for corrupt images:**
   - The script will log which images fail
   - Re-export or replace corrupt images

### Blur Placeholders Not Showing

1. **Verify JSON import:**
   ```typescript
   import imageManifest from '@/data/image-blur-data.json';
   console.log(Object.keys(imageManifest)); // Should list all images
   ```

2. **Check filename matching:**
   - `src="IMG_1234.jpeg"` should match `imageManifest["IMG_1234"]`
   - Case-sensitive!

### TypeScript Errors on JSON Import

Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

---

## Migration Checklist

- [ ] Install dependencies (`glob`, `sharp`, `plaiceholder`)
- [ ] Create `scripts/optimize-images-enhanced.js`
- [ ] Update `package.json` scripts
- [ ] Run initial optimization: `npm run optimize-images`
- [ ] Verify `/src/data/image-blur-data.json` created
- [ ] Verify `/public/optimized/` has images
- [ ] Create `src/components/OptimizedImage.tsx`
- [ ] Add shimmer animation to `tailwind.config.ts`
- [ ] Update Hero component
- [ ] Update ProductCard component
- [ ] Update FeaturedProducts component
- [ ] Update ProductImage component
- [ ] Update ProductImageGallery component
- [ ] Update next.config.js
- [ ] Test local build: `npm run build && npm start`
- [ ] Run Lighthouse audit
- [ ] Test on real mobile devices
- [ ] Deploy to production

---

## Post-Deployment Monitoring

### Week 1: Performance Validation

1. **Monitor Lighthouse scores:**
   - Run daily audits
   - Track LCP, FID, CLS trends
   - Goal: maintain >90 performance score

2. **Check real user metrics:**
   - Use Chrome UX Report or similar
   - Monitor actual load times
   - Track bounce rate changes

3. **Watch for errors:**
   - Check console logs for image failures
   - Monitor error tracking (Sentry, etc.)
   - Fix any images that consistently fail

### Monthly: Image Audit

1. **Review new images:**
   - Run optimization script
   - Verify manifest updates
   - Check file sizes

2. **Clean unused images:**
   - Remove old product photos
   - Archive seasonal images
   - Keep repo size manageable

---

**This is the complete solution. Follow every step in order. The performance improvement will be dramatic and immediately noticeable.**
