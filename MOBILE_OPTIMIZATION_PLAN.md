# Mobile Optimization Plan
## Caramel & Jo (Nataly's Bakery) Website

**Date:** February 2, 2026  
**Status:** Plan Ready for Implementation  
**Scope:** Mobile-only optimization — desktop layout preserved as-is  
**Stack:** Next.js 16, React 18, Tailwind CSS 3.4, TypeScript

---

## Executive Summary

This plan provides a comprehensive, mobile-first optimization strategy for the Caramel & Jo bakery website. The desktop and laptop experience will remain unchanged. The goal is to deliver a fully optimized mobile experience that matches the quality and aesthetic of the desktop site while addressing mobile-specific UX, performance, and accessibility requirements.

**Key Objectives:**
- Preserve desktop layout and formatting exactly as-is
- Create a fully optimized mobile experience across all pages
- Use best-in-class tools compatible with the current stack
- Ensure WCAG 2.1 AA compliance on mobile
- Optimize for Core Web Vitals on mobile networks

---

## Table of Contents

1. [Current Desktop Layout Analysis](#1-current-desktop-layout-analysis)
2. [Mobile Gap Analysis](#2-mobile-gap-analysis)
3. [Recommended Tools & Stack Integration](#3-recommended-tools--stack-integration)
4. [Component-by-Component Mobile Specification](#4-component-by-component-mobile-specification)
5. [Implementation Phases](#5-implementation-phases)
6. [Testing & Validation Strategy](#6-testing--validation-strategy)
7. [Appendix: Breakpoint Reference](#appendix-breakpoint-reference)

---

## 1. Current Desktop Layout Analysis

### 1.1 Tech Stack Summary

| Technology | Version | Mobile Relevance |
|------------|---------|------------------|
| Next.js | 16.x | App Router, Image Optimization, Font Optimization |
| React | 18.x | Concurrent features, Suspense |
| Tailwind CSS | 3.4.x | Responsive utilities, custom breakpoints |
| Stripe | 17.x | Mobile payment UI |
| Prisma | 5.x | Backend (no mobile impact) |

### 1.2 Page Structure (Desktop)

| Page | Layout | Key Elements |
|------|--------|--------------|
| **Home** | Hero (full viewport) + Featured Products (6-card grid) + Sticky Nav | HeroNav (vertical right), brand name (left-shifted), product grid 6 cols |
| **Menu** | Fixed nav bar + product category strip + 2-col product detail | Horizontal product pills, image + details side-by-side |
| **About** | Fixed nav + 2-col (image | story) | Navigation top-right, content centered |
| **Contact** | Fixed header + centered form card | Brand left, nav right, form centered |
| **Checkout** | Fixed nav + 2-col (form | order summary) | Side-by-side layout |
| **Success** | Fixed nav + centered card | Confirmation card centered |

### 1.3 Design System (Desktop)

- **Colors:** Warm neutrals (beige, cream, warmgray), terracotta, sage, warmbrown
- **Typography:** Playfair Display (brand), Roboto (UI)
- **Spacing:** Tailwind scale (4, 6, 8, 12, 16, 20, 24...)
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

---

## 2. Mobile Gap Analysis

### 2.1 Current Mobile State

| Component | Current Mobile Behavior | Gap / Issue |
|-----------|-------------------------|-------------|
| **Hero** | Brand `pl-[5.5rem]` shifts right; HeroNav hamburger; `h-screen` | Brand may feel cramped; nav dropdown works |
| **FeaturedProducts** | 2 cols on mobile, 3 on sm, 6 on md | Product cards small; text `text-xs sm:text-sm md:text-[10px]` — md smaller than sm (bug) |
| **StickyNav** | Hamburger, dropdown; `h-14 md:h-16` | Works; logo may truncate on very narrow |
| **HeroNav** | Hamburger, dropdown | Works |
| **Navigation** | Hamburger, dropdown | Used on About only |
| **Cart** | `w-[calc(100vw-1rem)]` on menu/contact/checkout; floating FAB elsewhere | Good width; modal top offset may need safe-area |
| **Menu Page** | 2-row header (brand+buttons, category strip); single-col product | `pt-[112px]` for content; category strip scrolls |
| **Checkout** | Single col on mobile; form + summary stacked | Good; Stripe PaymentElement needs mobile check |
| **Contact** | Centered form; header fixed | Form card padding may be tight |
| **Success** | Centered card; stacked buttons | `flex-col sm:flex-row` for buttons |

### 2.2 Critical Mobile Issues

1. **Hero brand positioning:** `pl-[5.5rem]` on mobile may push "Caramel & Jo" too far right or cause overflow on <360px.
2. **ProductCard text:** `md:text-[10px]` is smaller than `sm:text-sm` — likely unintentional; mobile needs readable minimum.
3. **Hero viewport:** `h-screen` is intentional for desktop; on mobile, consider `min-h-screen` if content ever exceeds viewport.
4. **Cart modal (menu/contact/checkout):** `top: 64px` fixed — may overlap with notched devices; safe-area already in globals.css but not applied to cart.
5. **Checkout form:** Stripe PaymentElement `layout: 'tabs'` — verify mobile UX; consider `layout: 'accordion'` for narrow screens.
6. **Touch targets:** Most buttons use `min-w-[44px] min-h-[44px]` — verify all interactive elements.
7. **Contact header:** Fixed elements with `top: 50%; transform: translateY(-50%)` — ensure no overlap on small screens.

### 2.3 Mobile Breakpoint Strategy

**Primary mobile range:** 320px – 767px (base + `sm:`)

| Device Class | Width | Tailwind | Notes |
|--------------|-------|----------|-------|
| Small phone | 320–374px | base | iPhone SE, older Android |
| Standard phone | 375–413px | base, sm | iPhone 12/13/14 |
| Large phone | 414–767px | sm | iPhone Pro Max, Android |
| Tablet | 768px+ | md+ | Desktop layout preserved |

---

## 3. Recommended Tools & Stack Integration

### 3.1 Built-in / Already Available

| Tool | Purpose | Status |
|------|---------|--------|
| **Tailwind CSS** | Responsive utilities, breakpoints | ✅ In use |
| **Next.js Image** | Responsive images, WebP/AVIF | ✅ Configured |
| **next/font** | Font optimization, `display: swap` | ✅ In use |
| **Viewport meta** | `width=device-width`, `initialScale=1` | ✅ In layout.tsx |
| **Safe area CSS** | `env(safe-area-inset-*)` | ✅ In globals.css |
| **Touch scroll** | `-webkit-overflow-scrolling: touch` | ✅ In globals.css |

### 3.2 Recommended Additions (Zero/Low Friction)

| Tool | Purpose | Integration |
|------|---------|-------------|
| **Tailwind `screens` override** | Add `xs: 375px` if needed for fine control | `tailwind.config.ts` |
| **CSS `clamp()`** | Fluid typography for hero brand | Inline or utility |
| **`useMediaQuery` hook** | Conditional rendering (e.g., Stripe layout) | Custom or `react-responsive` |
| **Lighthouse CI** | Mobile performance/accessibility audits | CI or manual |

### 3.3 Optional / Future

| Tool | Purpose | When to Consider |
|------|---------|------------------|
| **Container Queries** | Component-level responsive behavior | Tailwind 3.2+ supports `@container` |
| **`react-responsive`** | `useMediaQuery` without custom hook | If many conditional layouts |
| **Playwright** | E2E testing at mobile viewports | When adding automated tests |

### 3.4 Tools to Avoid (Stack Mismatch)

- **Bootstrap / Material UI:** Would conflict with Tailwind
- **Separate mobile framework:** Unnecessary; Tailwind + responsive design sufficient
- **PWA/Service Worker:** Out of scope for this plan; consider later for offline

### 3.5 Stripe Mobile Considerations

- **PaymentElement:** Use `layout: 'tabs'` (current) or `'accordion'` — test both on real devices.
- **Appearance:** `spacingUnit`, `borderRadius` already set; ensure touch targets within Stripe iframe meet 44px.
- **Stripe.js:** Loads async; ensure no layout shift; consider `loading="lazy"` equivalent for payment step.

---

## 4. Component-by-Component Mobile Specification

### 4.1 Hero (`src/components/Hero.tsx`)

**Desktop (preserved):** Full viewport, brand left-shifted, HeroNav vertical right.

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Section height | `h-screen` | Keep `h-screen`; ensure no overflow |
| Brand wrapper padding | `pl-[5.5rem] sm:pl-[6.5rem] md:pl-[8.5rem]...` | Reduce mobile: `pl-12 sm:pl-[5.5rem]` (48px on base) |
| Brand text size | `text-4xl sm:text-5xl md:text-6xl...` | Add `text-3xl` for 320px: `text-3xl xs:text-4xl sm:text-5xl...` (requires `xs` breakpoint or use `min()` ) |
| HeroNav position | `right-4 md:right-6` | `right-3 sm:right-4` for tighter fit |
| Text shadow | `text-hero-brand` | May need lighter shadow on mobile for performance; test |

**Fluid typography (alternative):**

```css
/* In globals.css or component */
.hero-brand-mobile {
  font-size: clamp(1.75rem, 8vw, 2.5rem); /* mobile range */
}
```

### 4.2 FeaturedProducts (`src/components/FeaturedProducts.tsx`)

**Desktop (preserved):** 6-column grid, generous spacing.

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Grid | `grid-cols-2 sm:grid-cols-3 md:grid-cols-6` | Keep; consider `gap-3 sm:gap-2 md:gap-3` for more breathing room on mobile |
| Section padding | `py-12 md:py-16 lg:py-20` | `py-8 sm:py-12 md:py-16` |
| Container padding | `px-4 sm:px-6 lg:px-8` | Keep |
| Menu button | `px-6 py-3 text-sm` | `min-h-[44px] px-6 py-3` (ensure touch target) |

### 4.3 ProductCard (`src/components/ProductCard.tsx`)

**Desktop (preserved):** 3:4 aspect ratio, dark label bar.

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Label text | `text-xs sm:text-sm md:text-[10px]` | **Fix:** `text-xs sm:text-sm` (remove md smaller) — minimum 12px on mobile |
| Label height | `h-[2.5rem]` | `min-h-[2.5rem]` to allow 2-line wrap |
| Image sizes | `(max-width: 640px) 100px...` | Increase: `(max-width: 640px) 140px` for sharper mobile display |
| Touch target | Card is link | Ensure full card is tappable; `min-h-[44px]` for label area |

### 4.4 StickyNav (`src/components/StickyNav.tsx`)

**Desktop (preserved):** Horizontal links, logo left.

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Bar height | `h-14 md:h-16` | Keep |
| Logo | `text-lg sm:text-xl md:text-2xl` | `text-base sm:text-lg` if truncation on 320px |
| Hamburger | `min-w-[44px] min-h-[44px]` | ✅ Already compliant |
| Dropdown | `py-4 px-4` | Add `safe-x safe-bottom` for notched devices |
| Links | `py-2` | `min-h-[44px] py-3` for touch |

### 4.5 HeroNav (`src/components/HeroNav.tsx`)

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Hamburger | `min-w-[44px] min-h-[44px]` | ✅ Compliant |
| Dropdown | `min-w-[200px]` | `min-w-[min(200px,calc(100vw-2rem))]` for edge cases |
| Links | `px-6 py-2` | `min-h-[44px] px-6 py-3` |

### 4.6 Cart (`src/components/Cart.tsx`)

**Desktop (preserved):** Modal/dropdown from top-right or FAB.

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Modal (menu/contact/checkout) | `top-20 sm:top-24` | `top-[calc(64px+env(safe-area-inset-top))]` or use `safe-top` on parent |
| Modal width | `w-[calc(100vw-1rem)] max-w-sm` | Keep; add `safe-x` for notched devices |
| Backdrop | `top: 64px` | Match header height; consider `env(safe-area-inset-top)` |
| Floating FAB | `bottom-4 right-4` | Add `safe-bottom safe-right` |
| Quantity buttons | `min-w-[44px] min-h-[44px]` | ✅ Compliant |
| Checkout button | Inline styles | Ensure `min-height: 44px`; already set |

### 4.7 Menu Page (`src/app/menu/page.tsx`)

**Desktop (preserved):** Single nav bar, horizontal product strip, 2-col product detail.

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Header height | `minHeight: 64px` | Keep; ensure safe-area |
| Content padding-top | `pt-[112px]` | Verify: 64px (brand row) + ~48px (category) = 112px; adjust if category row height varies |
| Category strip | `py-2`, `min-h-[36px]` | Consider `min-h-[44px]` for touch |
| Product image | `max-w-xs sm:max-w-sm` | `max-w-[280px] sm:max-w-sm` for consistency |
| Variant labels | `min-h-[44px] p-3 sm:p-2` | Keep `min-h-[44px]`; `p-3` on mobile is good |
| Add to cart button | `min-h-[44px] py-3 sm:py-2` | ✅ Compliant |

### 4.8 Checkout Page (`src/app/checkout/page.tsx`)

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Form inputs | `px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm` | ✅ Good mobile sizing |
| Grid | `grid-cols-1 md:grid-cols-2` | Keep; order summary below form on mobile |
| Continue button | Inline styles, `minHeight: 44px` | ✅ Compliant |
| Loading overlay | Centered | Ensure it doesn’t overflow on small screens |

### 4.9 CheckoutForm / Stripe (`src/components/CheckoutForm.tsx`)

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| PaymentElement | `layout: 'tabs'` | Test `'accordion'` on mobile; tabs may be small |
| Container padding | `p-6` | `p-4 sm:p-6` for mobile |
| Submit button | `minHeight: 56px` | ✅ Good |
| Stripe appearance | `spacingUnit: '4px'` | Consider `6px` on mobile for larger touch targets (requires dynamic config) |

### 4.10 Contact Page (`src/app/contact/page.tsx`)

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Header | Fixed, `minHeight: 64px` | Add `safe-top` |
| Form card | `p-4 sm:p-6 md:p-8 lg:p-10` | `p-4` on mobile is good |
| Content padding | `py-16 sm:py-20 md:py-24` | `py-20 sm:py-24` — reduce top padding so form is visible sooner |
| Title | `text-4xl md:text-5xl lg:text-6xl` | `text-3xl sm:text-4xl md:text-5xl` |

### 4.11 ContactForm (`src/components/ContactForm.tsx`)

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Inputs | `px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm` | ✅ Good; `py-3` on mobile for touch |
| Textarea | `rows={6}` | Consider `rows={5}` on mobile to reduce scroll |
| Submit | `min-h-[44px] py-3 sm:py-2` | ✅ Compliant |

### 4.12 About Page (`src/app/about/page.tsx`)

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Grid | `grid-cols-1 md:grid-cols-2` | Keep; image below text on mobile |
| Image | `max-w-sm` | `max-w-[280px] sm:max-w-sm` |
| Title | `text-3xl md:text-4xl lg:text-5xl` | `text-2xl sm:text-3xl md:text-4xl` |
| Bio text | `text-base md:text-lg lg:text-xl` | Keep |

### 4.13 Success Page (`src/app/checkout/success/page.tsx`)

**Mobile specification:**

| Element | Current | Mobile Target |
|---------|---------|---------------|
| Content padding | `pt-16 sm:pt-20 py-8 sm:py-12` | Add `safe-top` to account for nav |
| Card padding | `p-8` | `p-6 sm:p-8` |
| Buttons | `flex-col sm:flex-row gap-4` | `flex-col gap-3 sm:flex-row sm:gap-4`; ensure `min-h-[44px]` |

---

## 5. Implementation Phases

### Phase 1: Critical Fixes (1–2 days)

| # | Task | File(s) | Effort |
|---|------|---------|--------|
| 1 | Fix ProductCard text: remove `md:text-[10px]`, use `text-xs sm:text-sm` | ProductCard.tsx | 5 min |
| 2 | Hero brand: reduce mobile padding `pl-12 sm:pl-[5.5rem]` | Hero.tsx | 5 min |
| 3 | Hero brand: add smaller base size `text-3xl sm:text-4xl` for 320px | Hero.tsx | 5 min |
| 4 | Cart modal: apply safe-area to top offset | Cart.tsx | 15 min |
| 5 | Cart floating FAB: add `safe-bottom safe-right` | Cart.tsx | 5 min |
| 6 | StickyNav dropdown: add safe-area classes | StickyNav.tsx | 5 min |

### Phase 2: Touch & Layout Polish (1 day)

| # | Task | File(s) | Effort |
|---|------|---------|--------|
| 7 | StickyNav dropdown links: `min-h-[44px] py-3` | StickyNav.tsx | 5 min |
| 8 | HeroNav dropdown links: `min-h-[44px] py-3` | HeroNav.tsx | 5 min |
| 9 | Menu category buttons: `min-h-[44px]` | menu/page.tsx | 5 min |
| 10 | ProductCard: increase mobile image size in `sizes` | ProductCard.tsx | 5 min |
| 11 | Contact page: reduce top padding on mobile | contact/page.tsx | 5 min |
| 12 | Contact page header: add safe-area | contact/page.tsx | 5 min |

### Phase 3: Stripe & Forms (0.5 day)

| # | Task | File(s) | Effort |
|---|------|---------|--------|
| 13 | CheckoutForm: `p-4 sm:p-6` for container | CheckoutForm.tsx | 5 min |
| 14 | Test Stripe PaymentElement on real devices; consider `accordion` layout | CheckoutForm.tsx | 30 min |
| 15 | Checkout page: ensure loading overlay fits mobile | checkout/page.tsx | 10 min |

### Phase 4: Typography & Spacing (0.5 day)

| # | Task | File(s) | Effort |
|---|------|---------|--------|
| 16 | About: `text-2xl sm:text-3xl` for title | about/page.tsx | 5 min |
| 17 | Contact: `text-3xl sm:text-4xl` for title | contact/page.tsx | 5 min |
| 18 | Success: `p-6 sm:p-8` for card | success/page.tsx | 5 min |
| 19 | FeaturedProducts: `py-8 sm:py-12` on mobile | FeaturedProducts.tsx | 5 min |

### Phase 5: Testing & Validation (1 day)

| # | Task | Effort |
|---|------|--------|
| 20 | Device testing (see Section 6) | 2–3 hours |
| 21 | Lighthouse mobile audit | 30 min |
| 22 | Fix any issues found | Variable |

---

## 6. Testing & Validation Strategy

### 6.1 Device Matrix

| Device | Width | Height | Priority |
|--------|-------|--------|----------|
| iPhone SE (2nd/3rd) | 375px | 667px | High |
| iPhone 12/13/14 | 390px | 844px | High |
| iPhone 14 Pro Max | 430px | 932px | Medium |
| Samsung Galaxy S21 | 360px | 800px | High |
| Pixel 5 | 393px | 851px | Medium |
| iPad Mini | 768px | 1024px | Medium (desktop layout) |

### 6.2 Browser Testing

- Safari iOS (primary)
- Chrome Android
- Chrome DevTools device emulation (quick checks)

### 6.3 Functional Checklist

- [ ] Hero: brand visible, no overflow, nav opens
- [ ] Featured products: 2 columns, readable labels, Menu button tappable
- [ ] Sticky nav: appears on scroll, hamburger opens, links work
- [ ] Menu: category strip scrolls, product detail readable, add to cart works
- [ ] Cart: opens, items visible, quantity controls work, checkout button works
- [ ] Checkout: form usable, Stripe loads, payment completes
- [ ] Contact: form usable, submit works
- [ ] About: content readable, image loads
- [ ] Success: order number visible, buttons work
- [ ] No horizontal scroll on any page
- [ ] Safe areas respected on notched devices

### 6.4 Performance Targets (Mobile)

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Lighthouse Performance | ≥ 90 |

### 6.5 Accessibility Checklist

- [ ] All touch targets ≥ 44×44px
- [ ] Text ≥ 12px (0.75rem) on mobile
- [ ] Color contrast ≥ 4.5:1
- [ ] Focus visible on interactive elements
- [ ] Form labels associated with inputs

---

## Appendix: Breakpoint Reference

### Tailwind Defaults

| Breakpoint | Min Width | Typical Use |
|------------|-----------|-------------|
| (none) | 0px | Mobile-first base |
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets, desktop layout start |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Optional Custom Breakpoint

For finer control at 375px (common mobile width):

```ts
// tailwind.config.ts
theme: {
  extend: {
    screens: {
      xs: '375px',
    },
  },
}
```

Use sparingly; base + `sm` usually sufficient.

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-02 | Initial mobile optimization plan |

---

*This plan is strictly for mobile optimization. Desktop and laptop layouts remain unchanged.*
