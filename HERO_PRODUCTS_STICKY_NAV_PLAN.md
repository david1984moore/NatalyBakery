# Hero, Product Section & Sticky Nav Plan

## Overview
Restructure the homepage to: (1) separate hero and product sections with scrollability, (2) add a new featured products section below the hero with gradient white background, (3) implement scroll-triggered sticky navigation that appears when the original nav links leave the viewport.

---

## 1. Hero Section Changes

### Current State
- Hero is `h-screen` (full viewport) with background image, brand name "Caramel & Jo", product cards (6), and Menu button
- Content fills one screen; no scroll

### Target State
- Hero remains full viewport height (`h-screen`)
- **Background image unchanged**: Same fruit tart photo (`/Images/IMG_7616.jpeg`), same overlay
- **Content in hero**: Only the brand name "Caramel & Jo" (top-left area)
- **Remove from hero**: Product cards and Menu button (moved to new section)
- Bottom edge of hero = bottom edge of background photo = visual start of the new product section

### Implementation
- Edit `src/components/Hero.tsx`
  - Keep: background image, overlay, brand name
  - Remove: product grid, Menu link
  - Simplify layout: `flex flex-col justify-between` → `flex flex-col justify-start` (or similar) so brand stays at top

---

## 2. New Featured Products Section

### Design
- **Position**: Directly below hero; no gap (hero bottom = section top)
- **Background**: Gradient white with subtle faint shadows near edges
  - Base: `linear-gradient` from near-white to very light cream/white
  - Edges: `box-shadow` or `drop-shadow` for subtle depth (e.g. `0 4px 20px rgba(0,0,0,0.06)`, `inset` shadows)
- **Content**: Same 6 product cards (grid layout) + Menu button
- **Layout**: Match current product card grid (`grid-cols-2 sm:grid-cols-3 md:grid-cols-6`), max-width ~1200px, centered

### Implementation
- Create `src/components/FeaturedProducts.tsx`
  - Import `ProductCard`, `products` from data
  - Use `FEATURED_PRODUCT_COUNT = 6`
  - Section markup: gradient background, padding, product grid, Menu link
- Update `src/app/page.tsx` to render: `<Navigation />`, `<Hero />`, `<FeaturedProducts />`

### Styling Notes
- Gradient: e.g. `bg-gradient-to-b from-white via-cream-50/50 to-white` or similar
- Edge shadows: `shadow-[0_-4px_20px_rgba(0,0,0,0.04),0_4px_20px_rgba(0,0,0,0.04)]` or `box-shadow` for subtle elevation
- Product cards: dark labels (gray-900) for contrast on light background; keep existing `ProductCard` styling, may tweak border for light BG

---

## 3. Navigation & Sticky Nav Bar

### Current State
- `Navigation` is `fixed top-0 right-0` with Contact, Order links + LanguageToggle
- Links are positioned top-right; no logo in nav (logo is in Hero)

### Target State

**Default (hero visible):**
- Nav links remain in place (top-right) as today
- No sticky bar visible

**On scroll (nav links out of viewport):**
- A sticky nav bar appears
- **Position**: `sticky` or `fixed` at top, full width
- **Layout**:
  - **Left**: "Caramel & Jo" logo/home link → scrolls to top (`href="/"` or `#` with `scrollTo(0,0)`)
  - **Right**: Contact, Order, LanguageToggle (horizontal row, same order)
- **Styling**: Light background (white/cream) with subtle shadow; dark text for links
- **Transition**: Smooth show/hide when crossing viewport threshold

### Implementation

**Approach: Single `Navigation` component with two modes**
- Use `useEffect` + `IntersectionObserver` or scroll listener to detect when the hero’s nav area (or a sentinel element) leaves the viewport
- **Sentinel**: Invisible div or ref at top of hero, where nav links live
- When sentinel is not visible → show sticky bar
- When sentinel is visible → hide sticky bar, show floating links

**Structure:**
```
<>
  {/* Floating nav - only when hero nav is visible */}
  <nav className="fixed top-0 right-0 ..." data-floating-nav>
    Contact | Order | LanguageToggle
  </nav>

  {/* Sticky bar - only when scrolled past hero */}
  <nav className="fixed top-0 left-0 right-0 ... hidden/scrolled ..." data-sticky-nav>
    <Link href="/">Caramel & Jo</Link>
    <div>Contact | Order | LanguageToggle</div>
  </nav>
</>
```

**Scroll detection:**
- Place a sentinel element (e.g. `#nav-sentinel`) in the hero at the top-right area where nav links “live”
- Use `IntersectionObserver` with `root: null`, `threshold: 0` to detect when it exits viewport
- `isStickyVisible = !isSentinelVisible`

**Mobile:**
- Keep existing mobile menu behavior (hamburger) for both floating and sticky states
- Sticky bar on mobile: logo left, hamburger right

### Files to Modify
- `src/components/Navigation.tsx`
  - Add scroll/sentinel logic
  - Add sticky bar markup
  - Add logo link for sticky bar
- `src/components/Hero.tsx`
  - Add sentinel element (or pass ref to Navigation for placement)
- Alternative: Sentinel can live in `page.tsx` between Hero and FeaturedProducts, or as first child of main

---

## 4. Page Structure (Final)

```
<main>
  <Navigation />  {/* Handles both floating + sticky */}
  <Hero />        {/* Background photo + brand name only; contains nav sentinel */}
  <FeaturedProducts />  {/* Gradient white section with 6 cards + Menu */}
</main>
```

---

## 5. Cleanup (Pre-Implementation)

Completed before implementing the above:

1. **Remove unused files**
   - `src/app/test-button/page.tsx` (development/test page)

2. **Remove unused components**
   - `src/components/ProductGrid.tsx` (not imported anywhere)

3. **Trim layout fonts**
   - `layout.tsx`: Keep only Inter, Roboto, Playfair_Display (remove ~32 unused Google fonts)

4. **Trim globals.css**
   - Remove unused `.font-brand-*` classes (keep `font-brand-playfair`)
   - Remove unused `.font-nav-*` classes (keep `font-nav-playfair`)

5. **Optional**
   - `src/lib/errors.ts`: Not imported; consider keeping for future API use or removing if confirmed unused

---

## 6. Implementation Order

1. Cleanup (test-button, ProductGrid, fonts, globals.css)
2. Create `FeaturedProducts.tsx`
3. Update `Hero.tsx` (remove products, add sentinel if needed)
4. Update `page.tsx` (add FeaturedProducts)
5. Update `Navigation.tsx` (sticky bar + scroll detection)
6. Test scroll behavior, sticky visibility, mobile menu
7. Fine-tune gradients and shadows for FeaturedProducts

---

## 7. Acceptance Criteria

- [x] Hero shows only background photo + "Caramel & Jo"; full viewport height
- [x] New product section has gradient white background with subtle edge shadows
- [x] Product cards and Menu button appear in new section, not on hero
- [x] Site is scrollable
- [x] Nav links remain top-right when hero is in view (HeroNav inside Hero)
- [x] When user scrolls past hero, sticky nav appears with logo (left) and links (right)
- [x] Logo links to top of page
- [x] Mobile: hamburger works for both states; sticky bar shows logo + hamburger

## 8. Implementation Summary (Completed)

- **Hero**: Now contains only background image, brand name, and HeroNav (Contact, Order, LanguageToggle). Products removed. Sentinel div added for scroll detection.
- **HeroNav**: New component—nav links positioned in hero top-right, scroll with hero. Desktop: vertical links + LanguageToggle. Mobile: hamburger + dropdown.
- **FeaturedProducts**: New section below hero with gradient white background, subtle edge shadows, 6 product cards, Menu button. ProductCard uses `variant="light"` for subtle borders on light background.
- **StickyNav**: Appears when nav-sentinel scrolls out of view. Logo (Caramel & Jo) on left, links + LanguageToggle on right. Logo scrolls to top when on home. Mobile: logo + hamburger.
- **page.tsx**: Renders Hero, FeaturedProducts, StickyNav (Navigation removed from home).
