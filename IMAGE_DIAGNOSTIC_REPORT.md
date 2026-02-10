# Image Loading Diagnostic Report

**Generated:** February 10, 2025  
**Project:** NatalyBakery (Next.js 16)  
**Objective:** Identify why images load slowly despite optimization attempts

---

## 1. File System Status

### 1.1 Optimized Images Directory

| Item | Status |
|------|--------|
| `/public/optimized/` exists | ✓ Yes |
| WebP files | 52 |
| AVIF files | 52 |
| **Total files** | **104** |

**First 10 files with sizes (bytes):**

| File | Size |
|------|------|
| choco_5-lg.avif | 230,580 |
| choco_5-lg.webp | 178,214 |
| choco_5-md.avif | 119,188 |
| choco_5-md.webp | 79,926 |
| choco_5-sm.avif | 55,497 |
| choco_5-sm.webp | 36,136 |
| choco_5-xl.avif | 252,543 |
| choco_5-xl.webp | 216,934 |
| conchas_1-lg.avif | 133,853 |
| conchas_1-lg.webp | 101,064 |

### 1.2 Image Manifest

| Item | Status |
|------|--------|
| Manifest path | `src/data/image-blur-data.json` |
| Exists | ✓ Yes |
| Images in manifest | 13 |

**Manifest structure (sample):**
```json
{
  "new_hero_1": {
    "original": "/Images/new_hero_1.jpeg",
    "sizes": {
      "-sm": { "webp": "/optimized/new_hero_1-sm.webp", "avif": "/optimized/new_hero_1-sm.avif" },
      "-md": { "webp": "/optimized/new_hero_1-md.webp", "avif": "/optimized/new_hero_1-md.avif" },
      "-lg": { "webp": "/optimized/new_hero_1-lg.webp", "avif": "/optimized/new_hero_1-lg.avif" },
      "-xl": { "webp": "/optimized/new_hero_1-xl.webp", "avif": "/optimized/new_hero_1-xl.avif" }
    },
    "blur": "data:image/png;base64,..."
  }
}
```

### 1.3 Source Images (`public/Images/`)

| File | Size (bytes) | Size (KB) |
|------|--------------|-----------|
| choco_5.jpeg | 273,905 | 268 KB |
| conchas_1.jpeg | 178,033 | 174 KB |
| conchas_2.jpeg | 106,674 | 104 KB |
| conchas_3.jpeg | 132,765 | 130 KB |
| conchas_4.jpeg | 124,585 | 122 KB |
| flan_1.jpeg | 146,837 | 143 KB |
| flan_2.jpeg | 156,078 | 152 KB |
| hero_2.jpeg | 293,914 | 287 KB |
| IMG_5754.jpeg | 190,774 | 186 KB |
| IMG_7616.jpeg | 306,172 | 299 KB |
| IMG_7624.jpeg | 238,661 | 233 KB |
| IMG_7626.jpeg | 269,229 | 263 KB |
| **new_hero_1.jpeg** | **2,651,620** | **2.59 MB** |

⚠️ **CRITICAL:** `new_hero_1.jpeg` is **2.65 MB** — the mobile hero (LCP) image. This is the primary suspect for slow loading.

---

## 2. Build Process Status

### 2.1 Optimize Script

| Item | Status |
|------|--------|
| Script path | `scripts/optimize-images-enhanced.js` |
| Exists | ✓ Yes |
| Run command | `npm run optimize-images` |
| In build chain | ✓ Yes (`build` and `dev` both run it) |

**Build script chain (`package.json`):**
```json
"dev": "npm run optimize-images && next dev",
"build": "prisma generate && npm run optimize-images && next build",
"optimize-images": "node scripts/optimize-images-enhanced.js"
```

### 2.2 Optimize Script Output (Last Run)

```
🚀 Starting build-time image optimization...
📦 Found 13 images to process
📸 Processing: choco_5, conchas_1, ... new_hero_1
✅ Optimization complete!
📊 Processed 13 images
📄 Manifest written to: src/data/image-blur-data.json
📁 Optimized images in: public/optimized
```

✓ Script runs successfully. No errors.

### 2.3 Optimized Output for Hero Images

| Image | SM | MD | LG | XL (WebP) |
|-------|-----|-----|-----|-----------|
| new_hero_1 | 38 KB | 93 KB | 216 KB | **573 KB** |
| IMG_7616 | 16 KB | 35 KB | 77 KB | 202 KB |

### 2.4 TypeScript Configuration

| Item | Status |
|------|--------|
| `resolveJsonModule` | ✓ `true` (in tsconfig.json) |
| JSON imports work | ✓ Yes |

---

## 3. Code Implementation Status

### 3.1 OptimizedImage Component

**File:** `src/components/OptimizedImage.tsx`

**Imports manifest:** ✓ `import imageManifest from '@/data/image-blur-data.json'`

**Critical bug — always uses XL size:**

```tsx
// Line 65-67
const defaultSrc =
  imageData.sizes['-xl']?.webp ?? imageData.sizes['-lg']?.webp ?? src
```

✗ **ROOT CAUSE:** The component **always** serves the `-xl` WebP (largest) regardless of viewport or `sizes` prop. On mobile, the hero loads **573 KB** (new_hero_1-xl.webp) instead of **38 KB** (new_hero_1-sm.webp) or **93 KB** (new_hero_1-md.webp).

**Missing:** Responsive `srcset` or `<picture>` with multiple sources. The pre-generated sm/md/lg variants exist but are never used.

### 3.2 Hero Component

**File:** `src/components/Hero.tsx`

- ✓ Uses `OptimizedImage` (not raw `next/image`)
- Mobile: `src="/Images/new_hero_1.jpeg"`, `sizes="100vw"`, `priority`
- Desktop: `src="/Images/IMG_7616.jpeg"`, `sizes="(min-width: 1025px) 1440px, 100vw"`, `priority={false}`

Both hero images are in the manifest. Because OptimizedImage always picks `-xl`, mobile users load 573 KB for a full-width hero.

### 3.3 Next.js Image Config

**File:** `next.config.js`

```js
images: {
  formats: ['image/avif', 'image/webp'],
  qualities: [50, 70, 75, 80],
  deviceSizes: [384, 640, 1080, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256],
  minimumCacheTTL: 31536000,
  unoptimized: false,
}
```

✓ Config is reasonable. However, OptimizedImage passes **direct `/optimized/*.webp` paths** to `next/image`, bypassing Next.js optimization. The Image component serves the static file as-is; it does not generate a responsive srcset from our manifest.

### 3.4 Component Usage Summary

| Component | Uses | Image Source |
|-----------|------|--------------|
| Hero | OptimizedImage | new_hero_1, IMG_7616 |
| ProductCard | OptimizedImage | products[].image |
| ProductImage | OptimizedImage | product images |
| ProductImageGallery | OptimizedImage | product gallery images |
| About page | OptimizedImage | IMG_5754 |

All image components use OptimizedImage. No direct `next/image` usage for app images. Products include both local (`/Images/*.jpeg`) and remote (Unsplash) URLs — remote URLs fall back to next/image with `getOptimizedImageUrl` for lightbox.

---

## 4. Runtime Errors (Manual Steps Required)

**Step 4.1–4.3 require manual browser testing.** Instructions from the diagnostic doc:

1. **Console:** Open DevTools → Console, hard refresh (Ctrl+Shift+R), capture all errors/warnings.
2. **Network:** Filter by Img, sort by Time, note which images load, their URLs, sizes, and load times.
3. **Headers:** Click hero image request, capture Request URL, Response status, Content-Type, Cache-Control.

Please run these and add findings here if issues persist after fixes.

---

## 5. Performance Metrics (Manual Steps Required)

Lighthouse and LCP measurements require the deployed or local URL. Run:

```bash
lighthouse http://localhost:3000 --output=json --output-path=./lighthouse.json --only-categories=performance
```

Document: Performance score, LCP, FCP, Speed Index, and any image-related recommendations.

---

## 6. Deployment & Hosting

| Item | Status |
|------|--------|
| .next/cache/images/ | ✗ Does not exist (Next.js 16 may use different cache layout) |
| fetch-cache | ✓ Present in .next/cache/ |

Hosting platform and deployment URL were not detected from the repo. Add if known.

---

## 7. Root Cause Hypothesis

### Primary: OptimizedImage Always Serves XL

**Evidence:** `OptimizedImage` uses `defaultSrc = imageData.sizes['-xl']?.webp ?? ...` and passes it as a single `src` to `next/image`. The `sizes` attribute is set but there is no `srcset` — the browser always receives one URL (the largest variant).

**Impact:**
- Mobile hero: 573 KB (new_hero_1-xl.webp) instead of ~38–93 KB (sm/md)
- Other above-the-fold images also oversized for small viewports

### Secondary: Oversized Source Image

`new_hero_1.jpeg` is 2.65 MB. The optimizer correctly produces smaller outputs, but the component does not use the smaller variants. Reducing the source resolution (e.g., max 1920px) would further improve optimization results.

### Tertiary: No Responsive srcset

Pre-generated sm/md/lg/xl WebP and AVIF files exist and are listed in the manifest but are never used. A `<picture>` element with appropriate `srcset` or a custom component that selects src by viewport would fix this.

---

## 8. Recommended Fixes

### Fix 1 (High): Make OptimizedImage Use Responsive Images

**Option A — Picture + srcset (recommended):**

Render a `<picture>` element with `srcset` for each format:

```tsx
<picture>
  <source
    type="image/avif"
    srcSet={[
      `${imageData.sizes['-sm']?.avif} 384w`,
      `${imageData.sizes['-md']?.avif} 640w`,
      `${imageData.sizes['-lg']?.avif} 1080w`,
      `${imageData.sizes['-xl']?.avif} 1920w`,
    ].filter(Boolean).join(', ')}
    sizes={sizes ?? '100vw'}
  />
  <source
    type="image/webp"
    srcSet={[
      `${imageData.sizes['-sm']?.webp} 384w`,
      `${imageData.sizes['-md']?.webp} 640w`,
      `${imageData.sizes['-lg']?.webp} 1080w`,
      `${imageData.sizes['-xl']?.webp} 1920w`,
    ].filter(Boolean).join(', ')}
    sizes={sizes ?? '100vw'}
  />
  <img src={imageData.sizes['-md']?.webp} alt={alt} ... />
</picture>
```

**Option B — Use original path + Next.js Image:**

Pass the original path (e.g. `/Images/new_hero_1.jpeg`) to `next/image` and let Next.js generate responsive images. This uses the Image Optimization API and may add first-request latency, but ensures proper srcset without custom logic.

### Fix 2 (Medium): Shrink new_hero_1 Source

Resize `public/Images/new_hero_1.jpeg` to a maximum of 1920px on the long edge and re-save as JPEG before optimization. This will reduce the XL output size and improve optimization quality.

### Fix 3 (Low): Verify Hero priority

Mobile hero already has `priority`. Ensure desktop hero stays `priority={false}` so only one LCP candidate is prioritized.

---

## 9. Summary Table

| Check | Result |
|-------|--------|
| /public/optimized/ exists | ✓ |
| Manifest exists, 13 images | ✓ |
| Build runs optimize-images | ✓ |
| Optimize script succeeds | ✓ |
| OptimizedImage imports manifest | ✓ |
| Hero uses OptimizedImage | ✓ |
| Responsive srcset used | ✗ **Always serves XL** |
| new_hero_1 source size | ⚠️ 2.65 MB |
| resolveJsonModule | ✓ |

---

**Next step:** Implement Fix 1 in `OptimizedImage.tsx` so sm/md/lg/xl variants are used responsively. This should significantly reduce LCP and perceived load time, especially on mobile.
