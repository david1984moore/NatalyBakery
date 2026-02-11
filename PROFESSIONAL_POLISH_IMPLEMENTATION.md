# Professional Polish – Implementation Plan

**Reference:** PROFESSIONAL_IMAGE_ANIMATION_PROTOCOL.md, IMAGE_ANIMATION_EVALUATION_REPORT.md  
**Order:** Low-hanging fruit → foundation → refinements.

---

## 1. OptimizedImage: Render blur placeholder (P0)

**Current:** Placeholder is solid `bg-warmgray-100`; manifest `blur` is unused.

**Proposed:** When `imageData.blur` exists, render a blur layer during loading:

- Container: `relative`, same as now.
- Loading state: absolute layer with `backgroundImage: url(imageData.blur)`, `backgroundSize: 'cover'`, `backgroundPosition: 'center'`, `filter: 'blur(40px) saturate(1.2)'`, `transform: 'scale(1.1)'` (hide blur edges). No extra div for gray unless no blur.
- When no blur (e.g. fallback for non-manifest URLs): keep current neutral background.

**Rationale:** Blur-up matches final composition and feels instant; gray does not.

**Impact:** Perceived load improves; transition is blur→sharp instead of gray→image.

**Effort:** Small. **Validation:** Hero and product grid show blur then sharp image.

---

## 2. OptimizedImage: Context-aware transition timing (P1)

**Current:** Single `IMAGE_REVEAL_DURATION_MS = 480`, ease-out-quad.

**Proposed:**

- **Easing:** Use Material standard `cubic-bezier(0.4, 0, 0.2, 1)` everywhere for image reveal.
- **Duration:** Optional props `transitionDuration`, `transitionEasing`; internal defaults:
  - `priority === true` (hero / above-fold): `400ms` (hero-style).
  - Else: `200ms` (thumbnails / below-fold).

**Rationale:** Protocol: hero 400ms, small 150–200ms, natural curve.

**Impact:** Hero feels deliberate; thumbnails feel quick and imperceptible.

**Effort:** Small. **Validation:** Compare hero vs card reveal timing by eye.

---

## 3. OptimizedImage: Decode before transition (P1)

**Current:** `onLoad` → set `loaded` → opacity transition. Decode may still run on main thread at same time as first frame of transition.

**Proposed:** For `<img>` (manifest path):

- On mount, create `const img = new Image()`, set `img.decoding = 'async'`, set `img.src` to same URL we use in picture (e.g. fallback or first source).
- When `img.decode()` resolves (or onLoad if decode fails), then set `loaded` to true so opacity transition starts after decode.

**Rationale:** Avoids decode jank during the transition.

**Impact:** Smoother first frame of reveal.

**Effort:** Medium (care to not double-download; use same URL as picture). **Validation:** No frame drop when image appears on fast connection.

**Implementation note:** We can use the same `fallbackSrc` (or a single representative URL) for the decode preload; browser will reuse from cache when picture requests. Preload only when we have manifest (not for fallback next/image path).

---

## 4. Build script: Blur quality + manifest metadata (P1)

**Current:** `getPlaiceholder(buffer)` default (small size); manifest has `original`, `sizes`, `blur` only.

**Proposed:**

- `getPlaiceholder(buffer, { size: 32, saturation: 1.2 })` for better blur.
- From plaiceholder return: add `metadata` (width, height) and `color` (dominant hex) to each manifest entry, e.g. `width`, `height`, `dominantColor`.
- Write same JSON shape plus these keys.

**Rationale:** Protocol: blur matches composition; dominant color for instant placeholder; dimensions for aspect-ratio.

**Impact:** Better blur quality when we show it; enables future dominant-color and aspect-ratio in OptimizedImage.

**Effort:** Small. **Validation:** Re-run script, check manifest and blur appearance.

---

## 5. OptimizedImage: Aspect ratio from manifest (P2)

**Current:** Container has no intrinsic aspect ratio; parents set it (e.g. ProductCard 3/4).

**Proposed:** If manifest entry has `width` and `height`, set container `aspectRatio: width/height` so space is reserved even without parent. When `fill` is true, parent still controls size; aspect-ratio can still reduce CLS when container has defined size.

**Rationale:** Zero CLS where we have dimensions.

**Effort:** Small after manifest has dimensions. **Validation:** CLS in Lighthouse.

---

## 6. Global easing: Cart, fade-in, gallery dots (P2)

**Current:** Cart modal and `.animate-fade-in` use `ease-out`; gallery dots use `ease-out`.

**Proposed:**

- **Cart:** `cartModalSlideDown` / `cartModalFadeIn`: use `cubic-bezier(0.4, 0, 0.2, 1)` (e.g. in animation or transition).
- **globals.css** `.animate-fade-in`: `cubic-bezier(0.4, 0, 0.2, 1)` instead of `ease-out`.
- **ProductImageGallery** dots: `transition: ... cubic-bezier(0.4, 0, 0.2, 1)`.

**Rationale:** Protocol: natural, consistent curves.

**Impact:** Consistent, professional motion.

**Effort:** Small. **Validation:** Visual check on cart open, gallery switch, any fade-in usage.

---

## 7. Hero dominant color (P3)

**Proposed:** Once manifest has `dominantColor`, Hero can render an absolute layer with `backgroundColor: heroData.dominantColor` behind the blur layer for 0ms perceived content.

**Effort:** Small after manifest has color. **Validation:** No white/gray flash before blur.

---

## Implementation order (done in this pass)

1. Build script: add size 32, saturation, width, height, dominantColor → manifest.  
2. OptimizedImage: show blur layer when `imageData.blur` exists; keep gray fallback when no blur.  
3. OptimizedImage: transition 400ms + Material curve for priority, 200ms for non-priority; optional props.  
4. OptimizedImage: decode-before-transition for manifest images (preload same URL, then set loaded).  
5. OptimizedImage: use manifest aspect ratio when width/height present.  
6. globals + Cart + ProductImageGallery: standard easing curve.

After implementation: re-run image optimization script so manifest has new fields; then manual and Lighthouse checks.
