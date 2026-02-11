# Image & Animation Evaluation Report

**Project:** Nataly's Home Bakery  
**Standard:** Production-grade, imperceptible transitions (per PROFESSIONAL_IMAGE_ANIMATION_PROTOCOL.md)  
**Date:** Evaluation and implementation cycle

---

## Section 1: Current State

### 1.1 Performance & Loading Pipeline

**Documented sequence:**

```
User navigates to page
  ↓
[T+0ms] Page HTML arrives
  ↓
[T+?ms] OptimizedImage component mounts (React hydration)
  ↓
[T+?ms] Placeholder renders — currently neutral bg (bg-warmgray-100); blur data exists in manifest but is NOT rendered
  ↓
[T+?ms] Browser begins image request (picture/srcset)
  ↓
[T+?ms] First byte → full download → decode
  ↓
[T+?ms] onLoad fires (fires after decode in modern browsers for img)
  ↓
[T+?ms] Opacity transition 0 → 1 (480ms, ease-out-quad)
  ↓
[T+480ms] Image fully visible
```

**Measurements / findings:**

| Stage | Status | Notes |
|-------|--------|--------|
| Blur placeholder render | **Problematic** | Manifest contains blur base64 per image; component does not use it. Only a solid warm gray is shown. |
| Request timing | **Acceptable** | priority → eager/fetchPriority high; lazy for below-fold. Responsive srcset (sm/md/lg/xl) in use. |
| Decode timing | **Problematic** | No explicit preload/decode before transition. Transition starts on onLoad; decode can cause a brief stall before paint. |
| Transition timing | **Acceptable** | 480ms with custom easing (ease-out-quad). Protocol recommends 400ms hero / 150–200ms thumbnails with Material curve. |
| Layout stability | **Acceptable** | ProductCard uses aspect-ratio 3/4; About uses aspect-[3/4]. Hero is fill; no intrinsic ratio in manifest. |

**Critical answers:**

- **Blur placeholder synchronous with mount?** No—and currently no blur is shown; neutral gray only.
- **Request start** — Immediate after mount; priority images get eager load.
- **Decode before transition?** No. onLoad fires when decode is done, but we do not explicitly preload and await decode before starting opacity transition; implementation is single-step (onLoad → set loaded → transition). Risk of decode jank is low but non-zero.
- **Layout shift** — Contained where aspect-ratio is set by parent; manifest has no width/height for generic aspect-ratio reservation.

---

### 1.2 Animation Inventory & Quality

| Element | Transition Type | Duration | Easing | Trigger | Quality |
|---------|-----------------|----------|--------|---------|---------|
| Image opacity (OptimizedImage) | fade-in | 480ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) | onLoad | Good; protocol prefers 400ms hero, 150–200ms small, Material curve |
| ProductCard container | scale + shadow + border | 400ms | cubic-bezier(0.34, 1.56, 0.64, 1) | hover (md+) | Good (expressive) |
| Cart modal enter | slide + fade | 300ms | ease-out | open | Acceptable; protocol: standard curve |
| Cart modal centered | fade | 300ms | ease-out | open | Same |
| Gallery dots | size/opacity | 300ms | ease-out | click | Acceptable; standard curve preferred |
| Gallery image change | fade-in | 0.3s | ease-out (animate-fade-in) | index change | Acceptable |
| Lightbox | zoom/fade/swipe | 300ms | (library) | open/navigate | OK |
| Nav/buttons | color/background | 200ms | (default) | hover | OK |
| FeaturedProducts link | background | 300ms | (default) | hover | OK |

**Gaps:**

- **Image load:** Blur not shown; transition duration/easing not differentiated by hero vs thumbnail.
- **Cart modal:** Generic ease-out instead of cubic-bezier(0.4, 0, 0.2, 1).
- **Global fade-in:** ease-out; should use standard Material curve for consistency.
- **Gallery dots:** ease-out → standard curve.

---

### 1.3 Identified Problems (with severity)

| # | Problem | Severity | Impact |
|---|---------|----------|--------|
| 1 | Blur placeholder in manifest not rendered; user sees flat gray | **High** | Worse perceived load; no blur-up, no color continuity. |
| 2 | No decode-before-transition; possible decode jank | **Medium** | Rare but possible hitch when image becomes visible. |
| 3 | Single transition timing for all images (480ms) | **Medium** | Hero could feel slightly slow; thumbnails could feel slightly slow. |
| 4 | No aspect ratio / dimensions in manifest | **Low** | Cannot reserve space by default in OptimizedImage; relies on parents. |
| 5 | Blur generated at default size (small); no color tuning | **Medium** | When blur is used, quality/color match could be better. |
| 6 | Generic ease-out on cart and global fade-in | **Low** | Slight inconsistency vs protocol’s “natural” curves. |

---

## Section 2: Gap Analysis

### What’s missing vs professional standard

- **Blur-up:** Blur data exists but is not displayed; no dominant color fallback.
- **Decode strategy:** No explicit preload + decode before starting opacity transition.
- **Context-aware timing:** Same 480ms for hero and thumbnails; no hero (400ms) vs small (150–200ms) vs Material curve.
- **Manifest:** No width/height or dominant color; blur generated at default size.
- **Unified easing:** Not all transitions use the protocol’s standard/expressive curves.

### What exists but needs refinement

- **OptimizedImage:** Responsive picture/srcset and opacity reveal are good; add blur layer, optional decode wait, and configurable duration/easing.
- **ProductCard:** Hover animation is already expressive; keep.
- **Cart modal / fade-in / dots:** Small tweak to easing (and duration where needed).

### What’s well-implemented (keep)

- Responsive image pipeline (sm/md/lg/xl, AVIF/WebP).
- ProductCard hover (scale + shadow + border) and GPU-friendly usage.
- Reduced-motion preference respected.
- Touch/hover separation (md+ for hover).
- Priority/lazy and sizes attributes.

---

## Section 3: Prioritized Recommendations

### P0 (Critical)

1. **Render blur placeholder from manifest** when `imageData.blur` exists. Use as background with cover + scale(1.1) + blur filter so transition is blur → sharp, not gray → image.

### P1 (High)

2. **Differentiate transition timing:** Hero/large 400ms, small/priority 200ms, Material curve cubic-bezier(0.4, 0, 0.2, 1).  
3. **Decode before transition:** For priority images (or all), preload with `new Image()`, set src, await `img.decode()`, then set loaded so opacity transition starts after decode.  
4. **Build script:** Generate blur with `size: 32`; add `width`, `height`, and dominant `color` (hex) to manifest for future use (e.g. instant background, aspect-ratio).

### P2 (Medium)

5. **Use aspect ratio from manifest** in OptimizedImage when available to reserve space and minimize CLS.  
6. **Unify easing:** Cart modal, globals `.animate-fade-in`, gallery dots → cubic-bezier(0.4, 0, 0.2, 1).  
7. **Optional:** Hero dominant-color layer (instant background) once manifest has `color`.

### P3 (Low)

8. Progressive JPEG for hero images (build pipeline change).  
9. Stagger for grid reveals (e.g. FeaturedProducts) if we add entrance animations.  
10. Lightbox animation tuning (library-driven; lower priority).

---

**Next:** Implement in order P0 → P1 → P2; validate subjectively (“no noticeable loading”) and with Lighthouse (LCP, CLS).
