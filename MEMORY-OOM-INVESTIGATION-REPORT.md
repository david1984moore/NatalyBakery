# Recurring Out-of-Memory (OOM) Investigation Report  
**Service:** Caramelandjo (Render.com)  
**Error:** "Instance failed: Ran out of memory (used over 512MB) while running your code."  
**Date:** February 10, 2026

---

## 1. Executive summary

The instance is hitting Render’s **512MB RAM limit** and restarting repeatedly. The codebase and Render/Node best practices were reviewed. **Primary cause: server-side blur placeholder generation** (`addBlurPlaceholders` + `getPlaiceholder`) loading and decoding **multiple full-size images in parallel** on every request to the home and menu pages. That creates large, short-lived memory spikes that push the process over 512MB. A Prisma singleton is already in place and is not the main cause of the **recurring** OOMs.

**Recommended fixes (in order of impact):**

1. **Reduce or remove runtime blur generation** – Process images sequentially and/or cache blur results so we don’t run 6–9 full image decodes in parallel on every request.
2. **Cache blur placeholders** – Use Next.js `unstable_cache` (or build-time generation) so blur data is computed once and reused.
3. **Optional: cap Node heap** – Set `NODE_OPTIONS=--max-old-space-size=384` on Render to leave headroom for non-heap usage and reduce chance of total RSS exceeding 512MB.

---

## 2. Environment and constraints

| Item | Detail |
|------|--------|
| Platform | Render.com (Starter / 512MB RAM) |
| App | Next.js 16, Prisma, Supabase (Postgres) |
| Service name | Caramelandjo |
| Failure pattern | "Ran out of memory (used over 512MB)" → Service recovered → repeats |

Render’s 512MB is a **hard limit** for the container. When the process (RSS) goes over that, the instance is killed and restarted. There is no swap.

---

## 3. Root cause analysis

### 3.1 Already in good shape: Prisma

- **Singleton:** `src/lib/prisma.ts` correctly uses the global singleton pattern; no `new PrismaClient()` in API routes.
- **Imports:** All API routes use `import { prisma } from '@/lib/prisma'`.
- **Schema:** `directUrl` is set; connection pooling is configurable via env.

So the earlier Prisma-related fix is in place. Remaining OOMs are not primarily from connection leaks or multiple Prisma instances.

### 3.2 Primary cause: Blur placeholder generation (high impact)

**Where it runs:**

- **Menu page** (`src/app/menu/page.tsx`):  
  `addBlurPlaceholders(products)` → **all 9 products** get blur placeholders.
- **Home page** (`src/components/FeaturedProducts.tsx`):  
  `addBlurPlaceholders(products.slice(0, 6))` → **6 products**.

**How it works** (`src/lib/image-utils.server.ts`):

1. For each product image:
   - Local: `fs.readFile(filePath)` → full file into a **Buffer**.
   - Remote: `fetch(url)` → `arrayBuffer()` → `Buffer.from(arrayBuffer)`.
2. Each buffer is passed to **`getPlaiceholder(buffer)`**, which uses **Sharp** to decode the image and produce a small base64 placeholder.
3. All items are processed with **`Promise.all(...)`**, so **every image is in memory at the same time**.

**Why this blows memory on 512MB:**

- Decoding a single image (e.g. 1920×1080) can use on the order of **width × height × 4 bytes** (RGB(A)) in addition to the file buffer.
- With 9 images in parallel: **9 × (file buffer + decoded bitmap)**. Even with pre-optimized sources (e.g. ~200–500 KB each), decoded bitmaps alone can be tens of MB; total spike can reach **100–200+ MB** just for this one request.
- **No caching:** Every request to `/` or `/menu` runs this again. Bots, crawlers, and multiple users can trigger many concurrent requests → multiple parallel `addBlurPlaceholders` → combined memory far over 512MB.
- **Plaiceholder:** Project uses `plaiceholder` but not `@plaiceholder/next`. The Next.js plugin is recommended for better memory/threading behavior; without it, all work runs on the main Node process with no special memory controls.

So: **runtime blur generation with parallel, uncached processing** is the main driver of the recurring OOMs.

### 3.3 Contributing factor: On-demand image optimization

- Next.js Image Optimization API uses **Sharp** for resize/encode on first request per (url, size, quality).
- First requests for many images (e.g. hero, product cards, menu) can run several Sharp pipelines at once.
- Your `IMAGE_LOADING_INVESTIGATION.md` and `scripts/optimize-images.js` already note that large sources make this heavier; the script is run at build time, which helps but doesn’t remove the fact that **first-time** optimization still runs on the server and uses memory.
- This is a **contributing** factor: it adds to peak memory when combined with blur generation and other load.

### 3.4 Contributing factor: Open Graph image

- `src/app/opengraph-image.tsx` uses `readFile(..., 'base64')` for `IMG_7616.jpeg` and then `ImageResponse` to generate a 1200×1200 PNG.
- When links are shared (Twitter, Slack, etc.), this runs. It adds one more large buffer (full file + decoded image + output PNG) to the same 512MB process.
- If it runs at the same time as blur generation or image optimization, it increases the chance of OOM.

### 3.5 No caching of blur data

- There is no `unstable_cache` (or similar) around `addBlurPlaceholders` or `getBase64`.
- So every hit to `/` and `/menu` recomputes all blur placeholders, multiplying the impact of the parallel processing above.

### 3.6 Other checks (no major issues found)

- **Timers:** Only normal UI timers (`setTimeout`) in client components; no long-lived server intervals or event emitters that would leak.
- **Buffers:** `Buffer.from` in admin-auth (timing-safe compare) is small; `readFile` in OG image is the only other notable server-side read and is already called out above.

---

## 4. Internet / documentation findings

- **Render 512MB:** Well documented; limit is per container; no way to exceed it on the same plan.
- **Node `--max-old-space-size`:** Does not increase total RAM; it only limits the **heap**. Setting it below 512 (e.g. 384) can help by leaving room for non-heap memory (RSS = heap + native + buffers, etc.) so total RSS is less likely to cross 512MB.
- **Plaiceholder + Next.js:** Official docs recommend **@plaiceholder/next** and `withPlaiceholder` for Next.js to avoid memory/threading issues when processing multiple images.
- **Multiple images:** Using `Promise.all` with `getPlaiceholder` for many images is a known pattern; doing it at **request time** without caching or concurrency limits is risky on low-memory environments.

---

## 5. Findings summary table

| Suspect | Status | Impact | Notes |
|--------|--------|--------|--------|
| Prisma multiple instances | ✅ Fixed | Low | Singleton used everywhere |
| addBlurPlaceholders (parallel, uncached) | ❌ Problem | **High** | 6–9 images in parallel per request; no cache |
| Next.js on-demand image optimization | ⚠️ Contributing | Medium | First request per image/size uses Sharp |
| OG image (readFile + ImageResponse) | ⚠️ Contributing | Medium | Extra peak when link shared |
| No blur caching | ❌ Problem | High | Every / and /menu recomputes |
| Node heap vs RSS | ⚠️ Tuning | Low | NODE_OPTIONS can reserve headroom |

---

## 6. Recommended actions (guided by this report)

### 6.1 High impact: Blur placeholders

1. **Process images sequentially** in `addBlurPlaceholders` (e.g. `for...of` with `await getBase64(...)`) instead of `Promise.all`, to cap peak memory per request.
2. **Cache blur results** with `unstable_cache` keyed by image path/URL so each image’s blur is computed once and reused (e.g. revalidate daily or at build).
3. **Fallback:** If you don’t need per-image blur, use the existing static `BLUR_DATA_URL` for all product images to remove server-side blur generation entirely.

### 6.2 Medium impact: Render / Node

4. **Environment variable on Render:**  
   `NODE_OPTIONS=--max-old-space-size=384`  
   So Node limits heap and leaves ~128MB for non-heap usage within the 512MB cap.
5. **Optional:** Pin Node version (e.g. in `package.json` `engines` or `.nvmrc`) to avoid surprises from Render’s default Node upgrades.

### 6.3 Optional / follow-up

6. **@plaiceholder/next:** If you keep plaiceholder, add the Next.js plugin and wrap config as per docs.
7. **OG image:** Consider a smaller source image or pre-generated OG image to reduce peak memory when the route runs.
8. **Upgrade plan:** If OOMs persist after the above, the next step is to move to a plan with more RAM (e.g. 2GB) for production reliability.

---

## 7. Implementation plan (from this report)

1. **Implement** sequential processing + `unstable_cache` in `addBlurPlaceholders` / `getBase64` (see code changes below).
2. **Document** `NODE_OPTIONS` and optional Node version in `RENDER_MEMORY_FIX_GUIDE.md` or a small “Render env” section in README.
3. **Deploy** and monitor Render metrics and logs; confirm “Instance failed” events stop or greatly reduce.
4. **If needed:** Switch to static `BLUR_DATA_URL` for products and/or add `@plaiceholder/next` and OG image optimization.

---

## 8. References

- Render: [Server unhealthy Ran out of memory (used over 512MB)](https://community.render.com/t/server-unhealthy-ran-out-of-memory-used-over-512mb-while-running-your-code/14648)
- Render: [Node heap out of memory](https://community.render.com/t/node-heap-out-of-memory/1637)
- Plaiceholder: [Next.js plugin](https://plaiceholder.co/docs/plugins/next)
- Project: `RENDER_MEMORY_FIX_GUIDE.md`, `IMAGE_LOADING_INVESTIGATION.md`, `PHOTO-PERFORMANCE-CRISIS-PROTOCOL.md`

---

**Report version:** 1.0  
**Last updated:** February 10, 2026
