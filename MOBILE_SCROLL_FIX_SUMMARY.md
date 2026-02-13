# Mobile Scroll & Navigation Fix – Summary

**Date:** February 2026  
**Reference:** `cursor-mobile-scroll-diagnostic-prompt-v2.md`  
**Update (Feb 12):** Strong down scroll / overscroll fix.

## Summary

Root causes were: (1) document height/background not covering overscroll (white gap), (2) global smooth scroll on mobile conflicting with native momentum (bounce jank), (3) main only using 100vh so the body gradient showed as a brown band on short pages, and (4) reliance on `position: sticky` for the nav on iOS where it is unreliable. Fixes are in `src/app/globals.css`, `src/app/contact/page.tsx`, and `src/app/menu/MenuPageContent.tsx`. Build passes; validate on real iOS before and after deployment.

---

## Root Causes Addressed

| Issue | Root cause | Fix |
|-------|------------|-----|
| **White space above header** | Document (html/body) height/background didn’t cover overscroll on iOS | Full-height chain + same cream/brown background on html/body for mobile |
| **Glitchy scroll bounce** | `scroll-behavior: smooth` on document fought native momentum | `scroll-behavior: auto` on `html` for mobile only |
| **Contact brown area at bottom** | `main` only had `min-h-screen` (100vh), shorter than visible area on mobile | `min-h-[100dvh]` (with `min-h-screen` fallback) on contact and menu |
| **Nav not sticky on mobile** | `position: sticky` unreliable in this layout on iOS | `position: fixed` for header on mobile + spacer; keep `sticky` on desktop |
| **Strong down scroll / overscroll** (Feb 12) | `overscroll-behavior-y: contain` allowed rubber band; `html height: 100%` constrained root | `overscroll-behavior-y: none`; `min-height` on html; theme-color meta; cart overlay `touch-action: none` |

---

## Files Modified

1. **`src/app/globals.css`** – Mobile-only rules: html/body height chain, scroll-behavior, touch scrolling, gradient coverage.
2. **`src/app/contact/page.tsx`** – Main min-height (100dvh), header fixed on mobile + spacer, content padding.
3. **`src/app/menu/MenuPageContent.tsx`** – Wrapper min-height (100dvh), header fixed on mobile + spacer.

No new files or dependencies.

---

## What Not to Change

To avoid bringing back the issues:

- **Do not remove** mobile `scroll-behavior: auto` on `html` (glitchy bounce returns).
- **Do not remove** the mobile html/body min-height chain (white gap can return).
- **Do not change** `overscroll-behavior-y: none` back to `contain` (rubber band returns).
- **Do not use** `height: 100%` on html for mobile (use `min-height`).
- **Do not revert** menu/contact headers to sticky-only on mobile (nav won’t stay visible on iOS).
- **Do not remove** `min-h-[100dvh]` from contact/menu (brown band can return on short content).

---

## Safe to Change

- Desktop-only styles (`md:`, `lg:`, etc.).
- Spacer height (e.g. 52px) if the header height changes.
- Gradient colors or sizes in globals.css, as long as mobile html/body still have a full-height background.

---

## Validation

- **Build:** `npm run build` completes successfully.
- **Test:** Run on real iOS (Safari) at 390–428px width; check scroll, overscroll, menu, and contact pages before and after deployment.
