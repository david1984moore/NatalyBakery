# Desktop / Mobile Partition Guide

This project uses a **single codebase** with responsive Tailwind classes. You can work on the **desktop version without changing the mobile version** by following a clear breakpoint convention.

**Shortcut:** Start any prompt with **"desk"** or **"Desk"** to mean “desktop version” — e.g. *"desk, make the hero title larger"* or *"Desk: add more spacing to the nav"*. The AI will then only change `md:` / `lg:` / `xl:` / `2xl:` / `desktop:` classes and leave mobile untouched.

---

## 1. How the partition works

| Viewport | Tailwind breakpoints | Meaning |
|----------|----------------------|--------|
| **Mobile** | Base (no prefix) + `sm:` (640px+) | 0–767px = mobile experience |
| **Desktop** | `md:` (768px+) and up: `lg:`, `xl:`, `2xl:` | 768px+ = desktop experience |

**Convention:**

- **Mobile-only styles** = unprefixed classes and `sm:` only.  
  When you **do not** touch these, mobile stays unchanged.
- **Desktop-only styles** = use only `md:`, `lg:`, `xl:`, or `2xl:` (or the custom `desktop:` breakpoint).  
  When you **only** add or edit these, desktop changes cannot affect layout or styling below 768px.

So: **yes, you can work on desktop without changing mobile**, as long as you only add or modify **desktop breakpoint** classes.

---

## 2. Optional: `desktop:` breakpoint

A custom breakpoint `desktop: 768px` is defined in `tailwind.config.ts` (same as `md`). Use it when you want to make it obvious that a class is **desktop-only**:

```tsx
// Desktop-only: this does nothing below 768px
<div className="hidden desktop:block">...</div>
<div className="desktop:grid-cols-3 desktop:gap-8">...</div>
```

- Prefer **`desktop:`** when the intent is “this is only for desktop.”
- Use **`md:` / `lg:` / `xl:` / `2xl:`** when you need different behavior at specific widths (e.g. 1024px vs 1280px).

---

## 3. Rules for “desktop-only” work (mobile untouched)

When the goal is **desktop changes only**:

1. **Only add or change** classes that use:
   - `md:`, `lg:`, `xl:`, or `2xl:`, or  
   - `desktop:`
2. **Do not add or change**:
   - Unprefixed (base) classes
   - `sm:` classes  

   unless you explicitly intend to change mobile.

If you follow this, edits to desktop and larger-screen versions will not affect the mobile version.

---

## 4. When both mobile and desktop are in the same component

Many components use both base/`sm:` (mobile) and `md:`+ (desktop) in the same `className`. Example:

```tsx
className="grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
//         ^ mobile    ^ still mobile  ^ desktop
```

- To change **only desktop**: change only the `md:...` (or `lg:` / `xl:` / `desktop:`) part.
- To change **only mobile**: change only the base and/or `sm:` parts.

So the “partition” is by **which breakpoint prefix you edit**, not by separate files.

---

## 5. Completely different markup for mobile vs desktop

For elements that are totally different (e.g. different hero images), the codebase uses visibility toggles:

```tsx
<div className="block md:hidden">   {/* Mobile only */}
<div className="hidden md:block">   {/* Desktop only */}
```

When doing **desktop-only** work:

- Edit only the **desktop** block (the one with `hidden md:block`).
- Do not change the **mobile** block (the one with `block md:hidden`).

That keeps the mobile version unchanged.

---

## 6. Summary

| Goal | What to do |
|------|------------|
| Change **desktop** only | Only add/edit `md:`, `lg:`, `xl:`, `2xl:`, or `desktop:` classes. |
| Change **mobile** only | Only add/edit base (no prefix) or `sm:` classes. |
| Partition so desktop edits don’t affect mobile | Follow the “desktop-only” rules above and optionally use `desktop:` for clarity. |

There is no need for separate mobile/desktop codebases or branches for this; the partition is enforced by **which breakpoint prefixes you touch** in the same files.
