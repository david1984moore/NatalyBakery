# Photo Performance Crisis - Systematic Diagnostic & Resolution Protocol

## Mission Statement

Your wife's portfolio site is suffering from catastrophic image loading failures. Photos take 5+ seconds to load, some never load on mobile browsers, tapping images crashes the site. This is unacceptable for a professional portfolio. Your goal: near-instant photo loading across all devices and browsers.

## Root Cause Hypothesis

Based on symptoms (long load times, mobile failures, tap crashes), likely causes:
1. **Unoptimized source images** - Original high-res files served directly
2. **Missing responsive image strategy** - Same 5MB file served to mobile and desktop
3. **No lazy loading or progressive loading** - All images requested simultaneously
4. **Client-side processing bottleneck** - Browser doing resize/compression work
5. **Memory pressure on mobile** - Large images causing crashes when opened

## Phase 1: Diagnostic Audit

### Step 1.1: Image Source Analysis
```bash
# Run in project root
find . -name "*.jpg" -o -name "*.png" -o -name "*.webp" | while read file; do
  size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
  echo "$file: $(echo "scale=2; $size/1024/1024" | bc)MB"
done | sort -t: -k2 -rn | head -20
```

**Document findings:**
- List top 20 largest images with file paths
- Note total size of all images in `/public` or assets folder
- Identify any images over 500KB (red flag)
- Check if WebP format is being used

### Step 1.2: Network Analysis
Open Chrome DevTools → Network tab → Filter by Img

**Test sequence:**
1. Hard refresh home page (Cmd+Shift+R)
2. Record waterfall diagram screenshot
3. Note for each image:
   - File size transferred
   - Time to first byte (TTFB)
   - Total load time
   - Whether it's blocking rendering

**Document findings:**
- Total bytes transferred for images
- Longest pole image (which takes longest)
- Are images loading in parallel or series?
- Any 404s or failed requests?

### Step 1.3: Component Code Review
Locate all image rendering components. For each, check:

**Current implementation audit:**
```typescript
// Find patterns like this (WRONG):
<img src="/photos/image.jpg" />

// Or this (INCOMPLETE):
<Image src="/photos/image.jpg" width={800} height={600} />

// We need patterns like this (CORRECT):
<Image 
  src="/photos/image.jpg"
  width={800} 
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={85}
  placeholder="blur"
  blurDataURL={blurData}
  priority={isAboveFold}
/>
```

**Document findings for each image component:**
- Is it using Next.js `<Image>` component or raw `<img>`?
- Does it specify width/height (prevents layout shift)?
- Does it use `sizes` attribute (responsive serving)?
- Does it use `priority` for above-fold images?
- Does it implement blur placeholder?
- Does it specify `quality` setting?

### Step 1.4: Mobile-Specific Testing
Test on actual mobile device (not just Chrome responsive mode):

**iOS Safari:**
- Load home page, record load time
- Tap to open image modal/lightbox
- Does it crash? Record error if visible

**Android Chrome:**
- Same test sequence
- Check browser console for errors

**Document findings:**
- Which browser/device combinations fail?
- Exact error messages from console
- Does it work on WiFi but fail on cellular?

## Phase 2: Source Image Optimization

### Step 2.1: Bulk Image Processing
Install Sharp for server-side optimization:

```bash
npm install sharp
```

Create optimization script `/scripts/optimize-images.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = './public/photos/originals'; // Your source images
const OUTPUT_DIR = './public/photos/optimized';

const SIZES = [
  { width: 400, suffix: '-sm' },   // Mobile
  { width: 800, suffix: '-md' },   // Tablet
  { width: 1200, suffix: '-lg' },  // Desktop
  { width: 2400, suffix: '-xl' }   // Retina desktop
];

async function optimizeImage(inputPath, filename) {
  const name = path.parse(filename).name;
  const ext = path.parse(filename).ext;

  for (const size of SIZES) {
    const outputPath = path.join(
      OUTPUT_DIR, 
      `${name}${size.suffix}.webp`
    );

    await sharp(inputPath)
      .resize(size.width, null, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log(`Created: ${outputPath}`);
  }

  // Also create blur placeholder
  const blurPath = path.join(OUTPUT_DIR, `${name}-blur.webp`);
  await sharp(inputPath)
    .resize(20, null, { fit: 'inside' })
    .webp({ quality: 20 })
    .toFile(blurPath);
}

async function processAll() {
  const files = fs.readdirSync(INPUT_DIR);
  
  for (const file of files) {
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;
    
    const inputPath = path.join(INPUT_DIR, file);
    await optimizeImage(inputPath, file);
  }
}

processAll().catch(console.error);
```

**Run optimization:**
```bash
node scripts/optimize-images.js
```

**Validation:**
- Compare original vs optimized file sizes
- Visually inspect optimized images for quality
- Target: 80-90% size reduction without visible quality loss

## Phase 3: Component Implementation

### Step 3.1: Responsive Image Component
Create `/components/OptimizedImage.tsx`:

```typescript
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string; // Base path without size suffix or extension
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Generate srcset for responsive images
  const srcSet = `
    ${src}-sm.webp 400w,
    ${src}-md.webp 800w,
    ${src}-lg.webp 1200w,
    ${src}-xl.webp 2400w
  `;

  return (
    <div className={`relative ${className}`}>
      <Image
        src={`${src}-lg.webp`} // Default size
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 640px) 400px, 
               (max-width: 1024px) 800px,
               (max-width: 1920px) 1200px,
               2400px"
        quality={85}
        priority={priority}
        placeholder="blur"
        blurDataURL={`${src}-blur.webp`}
        onLoadingComplete={() => setIsLoading(false)}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}
```

### Step 3.2: Gallery Component with Lazy Loading
Create `/components/PhotoGallery.tsx`:

```typescript
import { OptimizedImage } from './OptimizedImage';
import { useEffect, useRef, useState } from 'react';

interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Load first 6 images immediately (above fold)
    setVisiblePhotos(new Set(photos.slice(0, 6).map(p => p.id)));

    // Lazy load rest with Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-photo-id');
            if (id) {
              setVisiblePhotos(prev => new Set([...prev, id]));
            }
          }
        });
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    return () => observerRef.current?.disconnect();
  }, [photos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo, index) => (
        <div 
          key={photo.id}
          data-photo-id={photo.id}
          ref={(el) => {
            if (el && index >= 6) observerRef.current?.observe(el);
          }}
        >
          {visiblePhotos.has(photo.id) ? (
            <OptimizedImage
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority={index < 6} // First 6 are priority
            />
          ) : (
            <div 
              className="bg-gray-100 animate-pulse"
              style={{ 
                aspectRatio: `${photo.width}/${photo.height}` 
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

### Step 3.3: Lightbox Modal (Crash Prevention)
Create `/components/PhotoModal.tsx`:

```typescript
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface PhotoModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function PhotoModal({ src, alt, onClose }: PhotoModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl"
        aria-label="Close"
      >
        ×
      </button>

      <div className="relative max-w-[90vw] max-h-[90vh]">
        {!isLoaded && (
          <div className="w-[90vw] h-[90vh] bg-gray-800 animate-pulse" />
        )}
        
        <Image
          src={`${src}-xl.webp`} // High-res for modal
          alt={alt}
          width={2400}
          height={1600}
          quality={90}
          onLoadingComplete={() => setIsLoaded(true)}
          style={{
            objectFit: 'contain',
            maxWidth: '90vw',
            maxHeight: '90vh',
            opacity: isLoaded ? 1 : 0
          }}
          priority // Always priority in modal
        />
      </div>
    </div>
  );
}
```

## Phase 4: Next.js Configuration

### Step 4.1: Update `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [400, 800, 1200, 2400],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
  },
};

module.exports = nextConfig;
```

## Phase 5: Performance Validation

### Step 5.1: Lighthouse Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://yourwifessite.com --output=html --output-path=./lighthouse-report.html
```

**Target metrics:**
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

### Step 5.2: Real Device Testing
Test on multiple devices:
- iPhone (Safari)
- Android phone (Chrome)
- Tablet
- Desktop (Chrome, Safari, Firefox)

**Validation checklist for each:**
- [ ] All images load within 2 seconds
- [ ] No layout shift during load
- [ ] Tap to open modal works smoothly
- [ ] Modal closes without crash
- [ ] Smooth scrolling through gallery

## Phase 6: Emergency Fallback (If All Else Fails)

If optimization still isn't working, implement CDN solution:

```bash
# Use Cloudinary or similar
npm install cloudinary
```

```typescript
// Replace image URLs with CDN transformation
const getOptimizedUrl = (src: string, width: number) => {
  return `https://res.cloudinary.com/your-cloud/image/upload/w_${width},q_auto,f_auto/${src}`;
};
```

## Expected Outcomes

After full implementation:
- **Load time:** < 1 second for first image, < 2 seconds for full gallery
- **Mobile performance:** No crashes, smooth interactions
- **File sizes:** 80-90% reduction vs originals
- **User experience:** Instant perceived load with blur placeholders

## Critical Success Factors

1. **Don't skip source optimization** - No amount of code fixes unoptimized 5MB images
2. **Use Next.js Image component** - It handles responsive srcsets automatically
3. **Implement lazy loading** - Don't load 50 images simultaneously
4. **Test on real mobile devices** - Chrome DevTools mobile mode isn't sufficient
5. **Monitor with Lighthouse** - Quantify improvements objectively

## Implementation Sequence

**CRITICAL: Follow phases in order. Do not skip diagnostic phase.**

1. **Phase 1: Diagnostic** (1 hour)
   - Run all audits
   - Document every finding
   - Identify worst offenders

2. **Phase 2: Optimization** (2 hours)
   - Install Sharp
   - Run optimization script
   - Verify output quality

3. **Phase 3: Components** (3 hours)
   - Implement OptimizedImage component
   - Implement PhotoGallery with lazy loading
   - Implement PhotoModal with crash prevention

4. **Phase 4: Configuration** (30 minutes)
   - Update next.config.js
   - Test image serving

5. **Phase 5: Validation** (2 hours)
   - Run Lighthouse audits
   - Test on real devices
   - Document improvements

**Total effort:** ~8-9 hours for comprehensive resolution

---

## Troubleshooting Guide

### If images still load slowly after optimization:
1. Check network tab - are optimized versions actually being served?
2. Verify Next.js Image component is being used (not raw `<img>`)
3. Check if `sizes` attribute matches your layout breakpoints
4. Confirm WebP format is being served (not falling back to original)

### If mobile crashes persist:
1. Check browser console for memory errors
2. Verify modal is using appropriate image size (not -xl on mobile)
3. Test with Image component `unoptimized={false}` to rule out optimization issues
4. Consider implementing virtual scrolling for very long galleries

### If blur placeholders don't show:
1. Confirm blur images were generated in optimization script
2. Check `blurDataURL` path matches actual file location
3. Verify `placeholder="blur"` is set on Image component
4. Check that blur images are accessible (not blocked by gitignore)

---

**This is not a "try this one thing" fix. This is a systematic overhaul of image delivery strategy. Follow every step sequentially. Document findings at each phase. The diagnostic phase will reveal which downstream fixes are most critical.**
