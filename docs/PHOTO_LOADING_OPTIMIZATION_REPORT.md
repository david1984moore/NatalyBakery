# Photo Loading Optimization — Architecture & Implementation Report

**Project:** Nataly's Home Bakery  
**Report date:** February 10, 2026  
**Scope:** All image/photo loading, optimization, blur placeholders, and related tooling in the codebase.

---

## 1. Executive Summary

The codebase uses a **multi-layer photo loading strategy**: Next.js Image Optimization (formats, sizes, quality), pre-build source image optimization, blur placeholders (generic + per-image via plaiceholder), and priority/lazy loading. The architecture is sound but has **gaps and inconsistencies** that can contribute to perceived load failures, duplicate work, and suboptimal LCP (Largest Contentful Paint). This report documents every piece involved and the known problems.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        IMAGE SOURCES                                        │
│  public/Images/*.jpeg  │  products.ts (local + Unsplash URLs)               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRE-BUILD: scripts/optimize-images.js                                      │
│  Resize to max 1920px, JPEG 82%, skip if <300KB or already small            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌──────────────────┐    ┌────────────────────────┐    ┌──────────────────────┐
│  next.config.js  │    │  image-utils.server.ts  │    │  image-utils.ts      │
│  formats, sizes, │    │  addBlurPlaceholders()  │    │  BLUR_DATA_URL       │
│  quality, cache  │    │  getBase64 + cache      │    │  getOptimizedImageUrl│
└──────────────────┘    └────────────────────────┘    └──────────────────────┘
          │                           │                           │
          ▼                           ▼                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONSUMERS                                                                   │
│  Hero.tsx │ ProductCard │ ProductImage │ ProductImageGallery │ About │ OG   │
│  FeaturedProducts │ MenuPageContent │ MobileMenu                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  next/image → /_next/image (on-demand optimization: AVIF/WebP, resize, q)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Configuration Layer

### 3.1 `next.config.js` — Image Optimization

**Location:** `next.config.js`

**Relevant block:**

```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  qualities: [50, 70, 75, 80],
  deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 180, 240, 256, 384],
  minimumCacheTTL: 31536000, // 1 year
  remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
},
```

**Behavior:**

- **Formats:** Next.js serves AVIF and WebP when the browser supports them; fallback to original (e.g. JPEG).
- **Qualities:** Only these values are allowed when using the Image component or `/_next/image?q=`. Using `quality={90}` in components may be clamped or rounded to the nearest allowed value (e.g. 80); confirm in Next.js 16 docs.
- **deviceSizes / imageSizes:** Used to generate `srcset` so the right resolution is requested for viewport/layout.
- **minimumCacheTTL:** Long cache for optimized images (1 year) — appropriate for stable portfolio assets.
- **remotePatterns:** Only `images.unsplash.com` is allowed for remote images. Any other external image URL will be rejected by the Image component / `/_next/image`.

**Impact:** All `<Image>` and programmatic `/_next/image` URLs go through this pipeline. Wrong quality or missing remote pattern can cause 400s or fallback behavior.

---

### 3.2 Pre-build: `scripts/optimize-images.js`

**Location:** `scripts/optimize-images.js`  
**Invocation:** `npm run optimize-images` (run automatically before `next build` via `"build": "prisma generate && npm run optimize-images && next build"`).

**Behavior:**

- Scans `public/Images` for `.jpeg`, `.jpg`, `.png`, `.webp`.
- Skips files &lt; 300 KB or with both dimensions ≤ 1920 px.
- Otherwise: resizes with `fit: 'inside'` to max 1920 px, re-encodes JPEG at quality 82 (mozjpeg), overwrites file in place (via temp file).

**Purpose:** Source images are often 5000+ px and 1–3 MB. Next.js on-demand optimization still reads and decodes the full file before resizing. Pre-shrinking reduces I/O and memory and speeds up first request and build-time blur generation.

**Dependency:** Requires `sharp` (in devDependencies). If `sharp` is missing, the script logs a warning and exits without changing files.

---

## 4. Blur Placeholder System

### 4.1 Client fallback: `src/lib/image-utils.ts`

**Exports:**

1. **`BLUR_DATA_URL`**  
   - Single generic base64 JPEG (~10×10 gray pixel, ~100 bytes).  
   - Used whenever a per-image blur is not provided.  
   - Same value is used across the app, so every such image shows the same gray box until load.

2. **`getOptimizedImageUrl(src, width = 1920, quality = 75)`**  
   - Builds `/_next/image?url=<src>&w=<width>&q=<quality>`.  
   - Used by **ProductImageGallery** for lightbox slides so the lightbox gets resized/WebP/AVIF instead of raw files.  
   - `quality` 75 is in `next.config.js` `qualities`.  
   - For local images `src` is e.g. `/Images/hero.jpeg`; for products it can be Unsplash URLs (must be in `remotePatterns`).

**Usage:** Any component that uses `next/image` with `placeholder="blur"` and no `blurDataURL` should pass `BLUR_DATA_URL` (or a per-image blur) to avoid React/Next warnings and to keep a consistent placeholder.

---

### 4.2 Server-side blur: `src/lib/image-utils.server.ts`

**Dependencies:** `server-only`, `next/cache` (`unstable_cache`), `plaiceholder`, Node `path`, `fs/promises`.

**Functions:**

1. **`getBase64(imageUrl: string): Promise<string | undefined>`**  
   - If `imageUrl` is `http(s)://`: fetches with `fetch()`, reads body to buffer.  
   - Otherwise: treats as path (e.g. `/Images/xxx.jpeg`), reads from `path.join(process.cwd(), 'public', imageUrl)`.  
   - Runs `getPlaiceholder(buffer)` and returns `base64`.  
   - On any error: logs and returns `undefined`.

2. **`getBase64Cached(imageUrl: string)`** (internal)  
   - Wraps `getBase64(imageUrl)` in `unstable_cache` with:
     - Key: `[BLUR_CACHE_TAG, imageUrl]`
     - `revalidate: 86400` (24h)
     - `tags: ['blur-placeholders']`
   - Reduces repeated file reads and plaiceholder work.

3. **`addBlurPlaceholders<T>(items: T[]): Promise<(T & { blurDataURL?: string })[]>`**  
   - Generic over arrays of objects that have either `image` or `imageUrl`.  
   - For each item, takes `item.image` or `item.imageUrl`, calls `getBase64Cached(img)`, and appends `blurDataURL` to the item.  
   - **Processes items sequentially** to avoid OOM on low-memory environments (e.g. 512 MB Render).  
   - Products with only `image` get one blur; products with `images[]` still get only one blur (for the single `image` field). Gallery **secondary** images never get their own blur in this pipeline.

**Used by:**

- **Menu page** (`src/app/menu/page.tsx`): `addBlurPlaceholders(products)` → `productsWithBlur` passed to `MenuPageContent`.
- **FeaturedProducts** (`src/components/FeaturedProducts.tsx`): `addBlurPlaceholders(products.slice(0, 6))` for the first six products.

**Not used by:** Hero, About page, MobileMenu, or any route that doesn’t call `addBlurPlaceholders`.

---

## 5. Component-by-Component Implementation

### 5.1 Hero — `src/components/Hero.tsx`

**Type:** Client component.  
**Images:** Two separate `<Image>` components, one for mobile, one for desktop.

| Slot    | src                    | Visibility        | priority | fetchPriority | loading | quality | sizes                          | placeholder | blurDataURL   |
|--------|------------------------|-------------------|----------|---------------|--------|--------|---------------------------------|------------|---------------|
| Mobile | `/Images/new_hero_1.jpeg` | `block md:hidden` | true     | high          | (default eager) | 70 | 100vw  | blur | **Hardcoded generic** (same as BLUR_DATA_URL) |
| Desktop| `/Images/IMG_7616.jpeg`    | `hidden md:block` | false    | low           | lazy   | 70     | (min-width: 1025px) 1440px, 100vw | blur | **Same hardcoded generic** |

**Behavior:**

- Only one hero is “priority” (mobile) to protect LCP.
- Desktop hero is lazy and low priority — correct for LCP.
- **Problem:** Both use the **same generic** blur data URL. Neither uses a per-image blur, so:
  - Placeholder is a generic gray box, not a blurred preview of the actual photo.
  - If the hero image fails to load, there is no `onError` or fallback UI (only the gray placeholder remains).

**File presence:** `public/Images/new_hero_1.jpeg` and `public/Images/IMG_7616.jpeg` exist. A file like `Images/hero_load_fail_1.jpg` in the repo suggests past hero load failures were observed (e.g. screenshot); the code does not handle load errors.

---

### 5.2 ProductCard — `src/components/ProductCard.tsx`

**Props:** `name`, `image`, `href`, `variant`, `priority`, `blurDataURL`.  
**Rendering:** Single `next/image` with `fill`, `object-cover`, aspect ratio 3/4, product name overlay.

- `priority={priority}`, `loading={priority ? 'eager' : 'lazy'}`, `fetchPriority={priority ? 'high' : undefined}`.
- `placeholder="blur"`, `blurDataURL={blurDataURL || BLUR_DATA_URL}`.
- `quality={90}` — may be clamped to 80 by Next config.
- `sizes="(max-width: 640px) 140px, (max-width: 768px) 120px, 140px"`.

**Blur source:**

- **FeaturedProducts:** passes `blurDataURL` from `addBlurPlaceholders` → per-image blur.
- **MobileMenu:** does **not** pass `blurDataURL` → always falls back to `BLUR_DATA_URL` (generic gray). MobileMenu cannot call server-only `addBlurPlaceholders` (client component, no server data for menu).

---

### 5.3 ProductImage — `src/components/ProductImage.tsx`

**Props:** `src`, `alt`, `sizes`, `className`, `priority`, `mobileHero`, `blurDataURL`.  
**Rendering:** Wrapper div (with optional aspect ratio from `onLoad`) and single `next/image` with `fill`, `object-contain` (or cover when `mobileHero`).

- `placeholder="blur"`, `blurDataURL={blurDataURLProp || BLUR_DATA_URL}`.
- `quality={90}`, `fetchPriority={priority ? 'high' : 'auto'}`.
- `onLoad` updates aspect ratio state from `naturalWidth` / `naturalHeight`.

**Used by:** Menu page detail area when the product has a single `image` (no `images[]`). Receives `blurDataURL={getBlurForProduct(featuredProduct.name)}` from `productsWithBlur`.

---

### 5.4 ProductImageGallery — `src/components/ProductImageGallery.tsx`

**Props:** `images[]`, `alt`, `sizes`, `mobileHero`, `blurDataURL` (single value for the “main” image).  
**Rendering:**

- **Mobile hero carousel:** scroll-snap horizontal list; each slide is a full-viewport `next/image` with `sizes="100vw"`, first image `priority`, rest lazy; all use the **same** `blurDataURL` prop (per-product main image blur only).
- **Desktop / non-carousel:** Single visible image at `images[index]` with prev/next buttons; same single `blurDataURL` for all indices.
- **Lightbox:** Uses `getOptimizedImageUrl(src, 1920, 75)` for each slide so the lightbox gets optimized images.

**Blur behavior:** Only one `blurDataURL` per product (the one from `addBlurPlaceholders` for `product.image`). For products with multiple gallery images (e.g. Choco-flan), the **first** image’s blur is reused for every slide. Other slides show that same blur as placeholder until their own image loads — acceptable but not ideal.

---

### 5.5 FeaturedProducts — `src/components/FeaturedProducts.tsx`

**Type:** Async server component.  
**Data:** `addBlurPlaceholders(products.slice(0, 6))` → `productsWithBlur`.  
**Rendering:** Grid of 6 `ProductCard`s with `priority={index < 4}`, `blurDataURL={product.blurDataURL}`.

So the first four cards are priority/eager, the rest lazy; all get per-image blur when server blur succeeds.

---

### 5.6 Menu page — `src/app/menu/page.tsx` + `MenuPageContent.tsx`

- **page.tsx:** Server component; calls `addBlurPlaceholders(products)` and passes `productsWithBlur` to `MenuPageContent`.
- **MenuPageContent:** Client component; defines `getBlurForProduct(name)` → `productsWithBlur.find(p => p.name === name)?.blurDataURL`. Passes this into `ProductImage` and `ProductImageGallery` for the featured product. Sizes for featured product images: `(max-width: 640px) 100vw, (max-width: 768px) 240px, 400px`.

Product list scroll uses the same product data; detail panel is the only place that uses blur there.

---

### 5.7 MobileMenu — `src/components/MobileMenu.tsx`

Renders up to 6 `ProductCard`s with `priority={index < 4}`. Does **not** pass `blurDataURL` (no server data in this client-only tree). So all menu product cards use the generic `BLUR_DATA_URL`.

---

### 5.8 About page — `src/app/about/page.tsx`

Single image: `/Images/IMG_5754.jpeg`, lazy, `quality={75}`, `sizes="(max-width: 640px) 280px, 384px"`, `placeholder="blur"`, `blurDataURL={BLUR_DATA_URL}`. No server-side blur; generic placeholder only.

---

### 5.9 Open Graph image — `src/app/opengraph-image.tsx`

Uses raw file read: `readFile(join(process.cwd(), 'public/Images/IMG_7616.jpeg'), 'base64')` and embeds as data URL in `ImageResponse`. No Next Image Optimization; not user-facing load path. If `IMG_7616.jpeg` is missing, OG generation fails at build/request time.

---

## 6. Data Sources and Remote Images

**Products** (`src/data/products.ts`): Mix of local paths (`/Images/...`) and Unsplash URLs (`https://images.unsplash.com/...`).  
**addBlurPlaceholders:** For local paths, reads from `public`; for `https://`, fetches and runs plaiceholder. Unsplash is in `remotePatterns`, so `next/image` and `/_next/image` accept those URLs.  
**Lightbox:** `getOptimizedImageUrl` is called with the same product image URLs; remote URLs must be in `remotePatterns` (they are).

---

## 7. Problems and Gaps (Summary)

| # | Problem | Where | Severity |
|---|--------|--------|----------|
| 1 | **Hero uses generic blur for both mobile and desktop** | Hero.tsx | Medium — poor perceived load, no content-aware placeholder. |
| 2 | **No error handling on hero images** | Hero.tsx | Medium — if image fails (404, CORS, network), user sees only gray box; `hero_load_fail_*` assets suggest this has happened. |
| 3 | **Hero cannot use server blur without refactor** | Hero is client component; blur is server-only | Low — would need server wrapper or pre-generated blur in repo. |
| 4 | **MobileMenu product cards never get per-image blur** | MobileMenu.tsx | Low — always generic placeholder; acceptable but inconsistent. |
| 5 | **Gallery secondary images share one blur** | addBlurPlaceholders + ProductImageGallery | Low — only first image has matching blur; others show first image’s blur. |
| 6 | **About page uses generic blur only** | about/page.tsx | Low — could add server blur for single image. |
| 7 | **quality={90} may be clamped** | ProductCard, ProductImage, ProductImageGallery | Low — next.config has max 80; confirm Next 16 behavior. |
| 8 | **Optimize-images optional** | scripts/optimize-images.js | Low — if sharp not installed, pre-optimization is skipped; build still works but first requests slower. |
| 9 | **Sequential blur processing** | image-utils.server.ts | By design — avoids OOM; menu/featured load may be slightly slower on cold cache. |

---

## 8. File Reference (All Related Code)

| File | Role |
|------|------|
| `next.config.js` | Image formats, qualities, sizes, cache TTL, remotePatterns. |
| `scripts/optimize-images.js` | Pre-build resize/compress in `public/Images`. |
| `src/lib/image-utils.ts` | BLUR_DATA_URL, getOptimizedImageUrl (client). |
| `src/lib/image-utils.server.ts` | getBase64, getBase64Cached, addBlurPlaceholders (server). |
| `src/components/Hero.tsx` | Two hero images (mobile/desktop), priority/lazy, generic blur. |
| `src/components/ProductCard.tsx` | Product grid card image; blur from prop or BLUR_DATA_URL. |
| `src/components/ProductImage.tsx` | Single product image; aspect ratio on load; blur from prop or BLUR_DATA_URL. |
| `src/components/ProductImageGallery.tsx` | Carousel + lightbox; getOptimizedImageUrl for lightbox; single blur for all slides. |
| `src/components/FeaturedProducts.tsx` | Server; addBlurPlaceholders(products.slice(0,6)); ProductCard with blur. |
| `src/components/MobileMenu.tsx` | ProductCard without blurDataURL. |
| `src/app/menu/page.tsx` | Server; addBlurPlaceholders(products); ProductWithBlur type. |
| `src/app/menu/MenuPageContent.tsx` | getBlurForProduct; ProductImage / ProductImageGallery with blur. |
| `src/app/about/page.tsx` | Single Image with BLUR_DATA_URL. |
| `src/app/opengraph-image.tsx` | Reads IMG_7616.jpeg for OG; no next/image. |
| `src/data/products.ts` | image / images URLs (local + Unsplash). |

---

## 9. Recommendations (Concise)

1. **Hero:** Add `onError` and a fallback UI (e.g. solid color or backup image) so failed loads are visible and recoverable.
2. **Hero blur:** Either generate and commit per-image blur data for mobile and desktop hero, or add a small server wrapper that pre-renders Hero with blur and passes it to the client.
3. **Quality:** Align component `quality` with `next.config.js` (e.g. use 75 or 80) or document intentional “request 90, accept clamp.”
4. **MobileMenu:** If desired, fetch or precompute blur for the first N products and pass into MobileMenu (e.g. via context or a small API) so cards match FeaturedProducts.
5. **Gallery blur:** Optionally extend `addBlurPlaceholders` (or a variant) to accept items with `images[]` and return a map or array of blur URLs so each gallery image can have its own placeholder.
6. **Monitoring:** Log or track image load errors (e.g. hero) in production to confirm whether failures are path, network, or optimization related.

This document is the single source of truth for the current photo loading optimization architecture and its issues. Update it when adding new image flows or changing blur/priority strategy.
