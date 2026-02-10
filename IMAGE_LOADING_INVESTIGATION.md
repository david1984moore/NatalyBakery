# Image Loading Investigation – NatalyBakery

## Executive summary

Photos load slowly due to a combination of: (1) **lightbox using raw image URLs** (bypassing Next.js optimization), (2) **hero loading two large, priority images** on first paint, (3) **on-demand image optimization** on a constrained server (e.g. Render 512MB), and (4) **risk of large source files** if pre-optimization is skipped or reverted. Recommended actions: serve optimized URLs in the lightbox, ensure build-time pre-optimization and possibly lower hero quality/sizes, and consider CDN or static export for images.

---

## 1. How photos are used and rendered

### 1.1 Inventory of image usage

| Location | Component | Source(s) | Next/image? | Priority / loading | Sizes / quality |
|----------|-----------|-----------|-------------|--------------------|-----------------|
| Home – hero | `Hero.tsx` | `/Images/hero_2.jpeg`, `/Images/IMG_7616.jpeg` | Yes | Both `priority` | `100vw` / `(min-width: 1025px) 1920px`, quality 70 |
| Home – product strip | `FeaturedProducts` → `ProductCard` | Product `image` (6 cards) | Yes | `loading="lazy"` | ~140px, quality 75 |
| About | `about/page.tsx` | `/Images/IMG_5754.jpeg` | Yes | `loading="lazy"` | 280px–384px, quality 75 |
| Menu – featured product | `ProductImage` or `ProductImageGallery` | Product `image` or `images[]` | Yes | First image priority/eager, rest lazy | 100vw / 240–400px, quality 70–75 |
| Menu – lightbox (fullscreen) | `ProductImageGallery` → `Lightbox` | Same paths as gallery, e.g. `/Images/flan_1.jpeg` | **No** | N/A | **Raw file** |

### 1.2 Data flow

- **Product images** come from `src/data/products.ts`: local paths like `/Images/IMG_7616.jpeg` or `/Images/flan_1.jpeg`, and remote URLs for some items (Unsplash).
- **Hero and about** use hardcoded paths under `/Images/`.
- All **Next/Image** usages go through the Next.js Image Optimization API (`/_next/image?url=...&w=...&q=...`), which serves resized, WebP/AVIF versions.
- **Lightbox** receives `slides = images.map((src) => ({ src, alt }))` and passes these **unchanged** to `yet-another-react-lightbox`. The library renders `<img src="/Images/...">` (or equivalent), so the **raw file** is requested – no resizing, no format conversion. This is the main functional cause of slow loading when opening the lightbox.

### 1.3 Next.js image config (`next.config.js`)

- `formats: ['image/avif', 'image/webp']` – modern formats; AVIF is smaller but slower to encode on first request.
- `deviceSizes`, `imageSizes` set; `remotePatterns` includes Unsplash.
- No `qualities` array; components use `quality={70}` or `quality={75}` (allowed by default).
- No `unoptimized: true`; all `<Image>` usages are optimized except where the lightbox uses raw `src`.

### 1.4 Pre-optimization script

- **Script:** `scripts/optimize-images.js` (run via `npm run optimize-images`; also run in `build`).
- **Behavior:** Resizes to max 1920px, JPEG quality 82, skips files &lt; 300KB or already within 1920px. Writes back into `public/Images`.
- **Purpose:** Shrinks source files so that **on-demand** Next.js optimization (read → decode → resize → encode) is faster and less memory-heavy. Comment in script: *"Source images are 5000+ px and 1-3 MB each - Next.js has to read/decode the full file before resizing."*
- **Risk:** If the script is not run (e.g. new images added, or files reverted), sources in `public/Images` can remain multi‑MB, making first-time optimization slow and heavy on a small instance.

---

## 2. Root causes of slow loading

### 2.1 Lightbox uses raw image URLs (high impact)

- **What happens:** User opens lightbox → library requests `/Images/flan_1.jpeg` (etc.) directly. Server serves the **full file** from `public/Images` with no resize or format conversion.
- **Why it’s slow:** Full-resolution, often multi‑hundred‑KB or MB files download on mobile/slow networks; no WebP/AVIF, no width/quality tuning.
- **Evidence:** `ProductImageGallery.tsx` builds `slides = images.map((src) => ({ src, alt }))` and passes to `<Lightbox slides={slides} />`; no use of `/_next/image` or similar.

### 2.2 Hero loads two large, priority images (high impact on LCP)

- **What happens:** On first load, both hero images (mobile + desktop) are requested with `priority` and large `sizes` (100vw, up to 1920px). Both go through the Image Optimization API.
- **Why it’s slow:** Two “first request” optimizations (decode → resize → AVIF/WebP) compete for CPU/memory; on a 512MB Render instance this can be slow and increase LCP.

### 2.3 On-demand optimization on a constrained server (medium impact)

- **What happens:** First request for each distinct image URL/size/quality triggers server-side work: read file, decode, resize, encode to AVIF/WebP. Cached after that.
- **Why it’s slow:** Render Starter (512MB) has limited CPU and RAM; Sharp processing large JPEGs is memory- and CPU-intensive. AVIF encoding is slower than WebP; with `formats: ['image/avif', 'image/webp']`, first-time AVIF generation adds latency.

### 2.4 Large source files (medium impact if present)

- **What happens:** If `optimize-images` hasn’t been run (or images were reverted), `public/Images` may still contain 5000+ px, 1–3 MB files.
- **Why it’s slow:** Next.js (and the script) must read and decode the full file before resizing; I/O and decode time scale with file size and dimensions.

### 2.5 Multiple priority images and quality

- **What happens:** Hero correctly uses `priority` for LCP. Menu featured product uses `priority={true}` by default for `ProductImage` and first slide in `ProductImageGallery` – acceptable for above-the-fold content.
- **Minor:** No `qualities` in `next.config.js`; if Next 16 enforces an allowlist in your setup, add e.g. `qualities: [50, 70, 75, 80]` to match component usage.

---

## 3. Strategy (by tech stack)

**Tech stack:** Next.js 16, `next/image`, Sharp (dev/build), Render (512MB), static product data and local files in `public/Images`.

### 3.1 Lightbox: use optimized image URLs (must-do)

- **Goal:** Lightbox should request resized, WebP/AVIF images, not raw files.
- **Options:**
  - **A. Build optimized URLs for lightbox**  
    For each `src` in `slides`, compute the same URL that `next/image` would use for a large display size (e.g. 1200 or 1920), and pass that to the lightbox. You can use a small helper that mirrors the default Next.js loader (e.g. `/_next/image?url=<encodeURIComponent(src)>&w=1920&q=75`). Use one or two fixed sizes (e.g. 1200 for “good enough” fullscreen, 1920 for high-DPI) to avoid an explosion of URLs.
  - **B. Use Next Image inside lightbox**  
    If the lightbox supports custom slide content, render `<Image src={...} width={1920} height={1080} />` (or fill) so the lightbox displays the optimized image. Depends on yet-another-react-lightbox API.
- **Recommendation:** Prefer A: keep lightbox API, swap `slides[].src` to optimized URLs (same origin). Reduces payload and improves perceived speed when opening the lightbox.

### 3.2 Pre-optimization and source size (must-do)

- **Ensure** `npm run optimize-images` runs on every build (already in `build` script) and that **all** images in `public/Images` are processed (e.g. no skipping by path; only by size/dimension as today).
- **Optional:** Lower `MAX_WIDTH` (e.g. 1600) or JPEG quality in the script to further reduce source size and memory during on-demand optimization. Balance with visual quality.
- **Check:** After deploy, confirm file sizes in `public/Images` (e.g. list dir with sizes in CI or locally). If any file is &gt; ~500KB, investigate and re-run or tighten the script.

### 3.3 Hero and LCP (should-do)

- **Keep** a single hero image as the main LCP; avoid loading two full-size images when only one is visible (mobile **or** desktop).
- **Options:**
  - **Preferred:** Use one hero image and control cropping/layout with CSS (e.g. `object-position`) for mobile vs desktop, so only one asset is requested with `priority`. If you must keep two assets, make the non-visible one lazy or load it after the visible one (e.g. second image with `loading="lazy"` and `fetchPriority="low"` or no priority).
  - **Alternative:** Slightly lower hero `quality` (e.g. 65) or cap `sizes` (e.g. max 1440px) to reduce decode/encode and transfer.
- **Recommendation:** One priority hero image; second image lazy/low priority if two different crops are required.

### 3.4 Next.js image config (should-do)

- **Add** `qualities: [50, 70, 75, 80]` (or match whatever you use in components) so Next 16 allowlist is satisfied if required.
- **Optional:** Put `image/webp` first in `formats` to favor faster WebP on first request and use AVIF only where you want smaller size and accept slower first encode: e.g. `formats: ['image/webp', 'image/avif']`. Test LCP and server load.

### 3.5 Server and caching (nice-to-have)

- **Caching:** Ensure your hosting sets long-lived cache headers on `/_next/image` responses (and on static `public/` if you ever serve raw files from there). Next.js `minimumCacheTTL` (default 4h) affects optimized images; increase if you rarely change images.
- **CDN:** Put Render behind a CDN and cache `/_next/image` (and static assets). First request may still hit the origin, but repeat visits and geographic distribution improve.
- **Static export:** If the site is mostly static, consider exporting static HTML and pre-generating optimized images at build time (e.g. `next export` + build-time image pipeline) so the live server doesn’t do on-demand optimization. Depends on your use of server routes and dynamic data.

### 3.6 Monitoring

- **LCP:** Measure LCP on home and menu (hero and featured product image). Track before/after changes.
- **Lighthouse / PageSpeed:** Check “Properly size images” and “Serve images in modern formats”; fix any reported URLs (e.g. lightbox URLs if still raw).
- **Server:** If you see high memory or CPU during image requests, consider lowering concurrency or moving image optimization to a dedicated service/CDN.

---

## 4. Implementation priority

1. **Lightbox:** Switch lightbox `slides` to use optimized URLs (helper + replace `src` before passing to Lightbox). High impact, contained change.
2. **Hero:** Reduce to one priority hero image or make the second image lazy/low priority; optionally lower quality or cap sizes. High impact on LCP.
3. **Pre-optimization:** Verify script runs for all images and confirm `public/Images` file sizes after build; tighten script if needed.
4. **Config:** Add `qualities`; optionally reorder `formats` to prefer WebP for first request.
5. **Caching/CDN:** Configure cache headers and CDN for `/_next/image` and static assets.
6. **Optional:** Static export or external image service if you need to push performance further without scaling the Render instance.

---

## 5. File reference

- Hero: `src/components/Hero.tsx`
- ProductCard: `src/components/ProductCard.tsx`
- ProductImage: `src/components/ProductImage.tsx`
- ProductImageGallery (lightbox): `src/components/ProductImageGallery.tsx`
- About image: `src/app/about/page.tsx`
- Products data: `src/data/products.ts`
- Image config: `next.config.js`
- Pre-optimization: `scripts/optimize-images.js`
- Blur placeholder: `src/lib/image-utils.ts` (BLUR_DATA_URL)
