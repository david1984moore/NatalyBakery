# Photo Performance – Investigation Report & Remediation Strategy

**Date:** February 10, 2026  
**Guide:** PHOTO-PERFORMANCE-CRISIS-PROTOCOL.md  
**Scope:** Phase 1 Diagnostic Audit + Root Cause Analysis + Remediation Plan

---

## 1. Phase 1 Diagnostic Audit – Findings

### 1.1 Image Source Analysis

**Top 20 largest images (project-wide):**

| File | Size | Location | Served? |
|------|------|----------|---------|
| no-fade.PNG | 5.14 MB | `Images/` (root) | No |
| text_preview_3.PNG | 3.38 MB | `Images/` (root) | No |
| IMG_7624.jpeg | 2.80 MB | `Images/` (root) | No |
| choco_5.jpeg | 2.67 MB | `Images/` (root) | No |
| hero_2.jpeg | 2.36 MB | `Images/` (root) | No |
| IMG_7675.jpeg | 2.25 MB | `Images/` (root) | No |
| flan_1.jpeg | 2.10 MB | `Images/` (root) | No |
| IMG_7616.jpeg | 2.04 MB | `Images/` (root) | No |
| IMG_7673.jpeg | 1.85 MB | `Images/` (root) | No |
| text_preview_8.jpg | 1.82 MB | `Images/` (root) | No |
| conchas_1.jpeg | 1.61 MB | `Images/` (root) | No |
| IMG_7626.jpeg | 1.56 MB | `Images/` (root) | No |
| conchas_4.jpeg | 1.45 MB | `Images/` (root) | No |
| conchas_3.jpeg | 1.34 MB | `Images/` (root) | No |
| conchas_2.jpeg | 1.19 MB | `Images/` (root) | No |
| mobile_menu.jpg | 0.85 MB | `Images/` (root) | No |
| flan_2.jpeg | 0.48 MB | `Images/` (root) | No |
| **public/Images/** | **0.10–0.29 MB** | `public/Images/` | **Yes** |

**Summary:**

- **Served images** come from `public/Images/` only. Those files are already optimized (0.1–0.29 MB each) by `scripts/optimize-images.js`.
- **Root `Images/`** holds originals (1–5+ MB). They are **not** in `public/`, so they are not served. Risk: if someone copies from `Images/` to `public/Images/` without running the optimizer, the site would serve multi‑MB files.
- **WebP:** Not used as source files; Next.js serves WebP/AVIF via the Image Optimization API (`/_next/image`).
- **Red flags:** Any image in `public/Images/` over ~500 KB would be a red flag; current `public/Images/` files are all under 300 KB.

### 1.2 Network Analysis (To Be Done by You)

Per protocol, in Chrome DevTools → Network → Img:

1. Hard refresh home page (Ctrl+Shift+R).
2. Record:
   - Total bytes transferred for images.
   - Longest-pole image (longest load time).
   - Whether images load in parallel or series.
   - Any 404s or failed requests.
3. Repeat for menu page and for opening the lightbox.

**Suspected without testing:** Hero may show two large (or two first-time optimized) requests competing; lightbox should already request `/_next/image?...` (see 1.3).

### 1.3 Component Code Review

| Location | Component | Next/Image? | width/height | sizes | priority | placeholder/blur | quality | Notes |
|----------|------------|-------------|--------------|-------|----------|------------------|--------|--------|
| Home hero | `Hero.tsx` | Yes | fill | 100vw / 1440px | **Both priority** | blur + inline blurDataURL | 70 | **Issue:** Two priority images (mobile + desktop) load at once. |
| Home strip | `FeaturedProducts` → `ProductCard` | Yes | fill | ~140px | First 4 priority | blur, server blurDataURL | 90 | OK. |
| About | `about/page.tsx` | Yes | fill | 280–384px | lazy | blur, BLUR_DATA_URL | 75 | OK. |
| Menu product | `ProductImage` / `ProductImageGallery` | Yes | fill | 100vw / 240–400px | First image | blur, server blurDataURL | 90 | OK. |
| **Lightbox** | `ProductImageGallery` → `Lightbox` | **No** (library `<img>`) | N/A | N/A | N/A | N/A | N/A | **Fixed:** `slides` use `getOptimizedImageUrl(src, 1920, 75)` → `/_next/image?url=...&w=1920&q=75`. Lightbox receives optimized URLs, not raw files. |

**Conclusion:**  
- All visible images use Next.js `<Image>` with `sizes`, `quality`, and `placeholder="blur"` where appropriate.  
- **Only structural issue:** Hero loads **two** priority images (mobile + desktop) on first paint; protocol recommends one priority hero or make the second lazy.

### 1.4 Next.js Image Config

**Current `next.config.js`:**

- `formats: ['image/avif', 'image/webp']`
- `qualities: [50, 70, 75, 80]` (matches components)
- `deviceSizes` / `imageSizes` present
- **`minimumCacheTTL: 60`** (60 seconds) – protocol suggests long cache (e.g. 1 year) for stable images to reduce re-optimization and improve repeat visits.

### 1.5 Server / Memory Context (From Existing Docs)

- **OOM:** MEMORY-OOM-INVESTIGATION-REPORT.md and RENDER_MEMORY_FIX_GUIDE.md identify server-side blur generation as a cause. **Current code:** `addBlurPlaceholders` uses **sequential** processing and **`unstable_cache`** (`getBase64Cached`), so that fix is in place.
- **On-demand optimization:** First request per (url, size, quality) still runs Sharp on the server (e.g. Render 512MB). Pre-optimized sources in `public/Images/` keep this manageable but don’t remove first-hit latency.

### 1.6 Mobile-Specific Testing (To Be Done by You)

Per protocol, on real devices (iOS Safari, Android Chrome):

- Load home and menu; note load times and any images that never load.
- Tap to open lightbox; confirm no crash and smooth close.
- Check console for errors; test on cellular if possible.

---

## 2. Root Cause Summary

| Hypothesis (Protocol) | Status | Notes |
|-----------------------|--------|--------|
| Unoptimized source images | **Mitigated** | `public/Images/` is optimized; root `Images/` not served. |
| Missing responsive strategy | **OK** | Next/Image + `sizes` used everywhere. |
| No lazy loading | **OK** | Lazy loading and priority used; gallery uses optimized lightbox URLs. |
| Client-side processing bottleneck | **N/A** | Server-side optimization only. |
| Memory pressure on mobile (large images in lightbox) | **Mitigated** | Lightbox uses `getOptimizedImageUrl` (1920px, q75), not raw files. |

**Remaining issues that can still cause slow or heavy loading:**

1. **Hero: two priority images** – Both mobile and desktop hero images load with `priority`/`fetchPriority="high"`, competing for bandwidth and LCP. Protocol: use one priority hero or make the non-visible one lazy.
2. **Cache TTL short** – `minimumCacheTTL: 60` means optimized images can be re-generated often; increasing to 1 year (or similar) for stable assets reduces server work and improves repeat visits.
3. **No pre-generated responsive variants** – Relying 100% on on-demand `/_next/image` means first request per size/quality pays full cost on the server; optional improvement is build-time responsive WebP variants (protocol Phase 2) if you want to move work off the live server.
4. **Risk of reintroducing big files** – If new images are added to `public/Images/` without running `optimize-images`, the site could again serve multi‑MB files. Keeping the script in the build and documenting it reduces this risk.

---

## 3. Remediation Strategy

### 3.1 High Impact, Low Effort (Do First)

1. **Single-priority hero**
   - **Change:** In `Hero.tsx`, keep one image as `priority` (e.g. mobile `hero_2`). For the desktop-only image (`IMG_7616`), set `priority={false}`, `loading="lazy"`, and `fetchPriority="low"` (or omit `fetchPriority`) so it doesn’t compete with LCP.
   - **Result:** Faster LCP, less simultaneous first-time optimization.

2. **Longer cache for optimized images**
   - **Change:** In `next.config.js`, set `minimumCacheTTL: 31536000` (1 year) for the `images` config (or another large value if you change images often).
   - **Result:** Fewer re-optimizations, better repeat-visit performance.

### 3.2 Already Done / Verified

3. **Lightbox optimized URLs** – `ProductImageGallery` already passes `getOptimizedImageUrl(src, 1920, 75)` to the lightbox; no change needed.
4. **Blur placeholders** – Server blur is sequential and cached; no change needed for performance/OOM.
5. **Pre-optimization script** – `scripts/optimize-images.js` runs (e.g. in build); `public/Images/` is in good shape. Ensure it always runs when new images are added.

### 3.3 Optional (Protocol Phase 2–3 Style)

6. **Build-time responsive WebP variants**  
   - Add a script (e.g. Sharp) to generate multiple widths (e.g. 400, 800, 1200, 2400) and blur placeholders under something like `public/photos/optimized/`, and a component that uses `srcSet`/`sizes` with those files. This moves work off the live server and can reduce first-request latency. Only do this if you still need better performance after 3.1.

7. **Lighthouse + real device validation**  
   - After 3.1: run Lighthouse (LCP &lt; 2.5s, CLS &lt; 0.1), and run 1.6 mobile tests to confirm no crashes and fast load.

---

## 4. Implementation Plan (Concrete Steps)

**Phase A – Immediate (this report)**

1. **Hero.tsx**
   - Leave mobile hero image as-is (`priority`, `fetchPriority="high"`).
   - For the desktop-only image: set `priority={false}`, `loading="lazy"`, and `fetchPriority="low"` so only one hero image is priority.

2. **next.config.js**
   - Set `images.minimumCacheTTL: 31536000` (or 86400 if you prefer 24h first).

3. **Documentation**
   - In README or SETUP: “When adding new images to `public/Images/`, run `npm run optimize-images` (and ensure it’s part of build) so sources stay under ~300 KB.”

**Phase B – You (validation)**

4. **Network audit** – Run 1.2 in browser; confirm hero shows one dominant LCP image and lightbox requests hit `/_next/image`.
5. **Mobile testing** – Run 1.6 on real devices; confirm no crashes and acceptable load times.
6. **Lighthouse** – Target LCP &lt; 2.5s, CLS &lt; 0.1 after Phase A.

**Phase C – Optional (if still not satisfied)**

7. Implement protocol Phase 2 (bulk responsive WebP + blur) and Phase 3 (OptimizedImage/PhotoGallery) only if needed; current setup plus Phase A may be sufficient.

---

## 5. File Reference

| Purpose | File |
|---------|------|
| Hero (two priority images) | `src/components/Hero.tsx` |
| Image config (cache TTL) | `next.config.js` |
| Lightbox (already optimized) | `src/components/ProductImageGallery.tsx` |
| Optimized URL helper | `src/lib/image-utils.ts` |
| Pre-optimization | `scripts/optimize-images.js` |
| Products (image paths) | `src/data/products.ts` |
| Blur (server, cached) | `src/lib/image-utils.server.ts` |

---

**Conclusion:** The main remaining fix is **one-priority hero + longer image cache TTL**. Lightbox and blur are already in good shape. After these two changes, run the network and mobile checks and Lighthouse; only then consider the full protocol Phase 2–3 (responsive WebP pipeline) if goals are still not met.
