# Caramel & Jo — Mobile Overscroll Diagnostic
## Cursor Data Collection Prompt | For Claude Diagnosis
**caramelandjo.com · Next.js + Tailwind CSS · Mobile Safari Primary Target**

---

## Purpose

Paste each section of this document as prompts to Cursor. Respond to each section by outputting the requested code, configuration, and observations **verbatim**. Do not summarize or paraphrase — provide raw file contents so Claude can perform root-cause diagnosis of the mobile Safari overscroll / rubber-band artifact.

**The bug:** On mobile Safari (iOS), performing a hard upward fling scroll followed by a downward scroll causes the area above the fixed header to render in white (or the system background color) rather than the header's fill color. The rubber-band bounce is occurring during this transition, briefly exposing the scroll container's overscroll background. This persists after multiple attempted fixes and is considered a critical UX regression.

---

## Section 1 — Project Structure Snapshot

Provide the complete output of the following shell command, run from the project root:

```bash
find . -type f \(
  -name '*.tsx' -o -name '*.ts' -o -name '*.css' -o -name '*.js' -o -name '*.mjs'
) \
  ! -path './node_modules/*' \
  ! -path './.next/*' \
  ! -path './.git/*' \
  | sort
```

Then provide the full contents of `package.json` and `tailwind.config.ts` (or `.js`).

---

## Section 2 — Global CSS and Scroll Foundation

### 2a. globals.css / global stylesheet

Provide the **COMPLETE** contents of `app/globals.css` or equivalent. Do not truncate. Include every rule, custom property, and media query exactly as written.

### 2b. HTML and Body rules

Search the entire codebase for any rule touching `html`, `body`, or `:root` related to scroll behavior, overflow, height, position, or background. Output each match with its file path and surrounding context (±10 lines).

Specifically search for these properties and report every match:

- `overflow`
- `overflow-x / overflow-y`
- `overscroll-behavior`
- `overscroll-behavior-y`
- `-webkit-overflow-scrolling`
- `position: fixed / sticky`
- `height: 100vh / 100dvh / 100%`
- `min-height`
- `scroll-behavior`
- `touch-action`
- `background-color`

### 2c. Tailwind base layer overrides

Output any `@layer base` blocks in CSS files and any `corePlugins` or `theme.extend` entries in the Tailwind config that affect scroll, overflow, height, or background.

---

## Section 3 — Root Layout File

Provide the **COMPLETE** contents of `app/layout.tsx` (or `pages/_app.tsx` if using pages router). Include:

- All `className` strings on `html` and `body` elements
- All metadata including viewport configuration
- All Providers, wrappers, and context components rendered at root level
- Any inline styles on `html` or `body`

If there is a `viewport` export or `generateViewport` function, show it in full.

---

## Section 4 — Header Component — Full Source

Provide the **COMPLETE** source of the header/navbar component used site-wide. This is likely one of: `components/Header.tsx`, `components/Navbar.tsx`, `components/Navigation.tsx`, or similar.

For the header, document every CSS class or style applied to:

- The outermost wrapper element
- Any inner containers
- Logo/brand element
- Nav links and interactive elements

Specifically identify and highlight:

- **Position strategy:** fixed, sticky, relative, absolute?
- **z-index value**
- **Background color / backdrop classes**
- **Height and padding values**
- **Any conditional classes based on scroll position, scroll direction, or route**
- **Any `useEffect`, `useState`, or `useRef` hooks related to scroll**
- **Any `IntersectionObserver` or scroll event listeners**

---

## Section 5 — All Scroll-Aware JavaScript Logic

### 5a. Custom hooks

Search for and provide **COMPLETE** contents of any custom hooks related to scroll. Common names include:

- `useScrollPosition`
- `useScrollDirection`
- `useScrolled`
- `useHeaderVisibility`
- `useNavbar`
- `useScroll`
- Any other hook with 'scroll' in the name

### 5b. Inline scroll listeners

Search the entire codebase for these patterns and output every match with file path and surrounding context (±20 lines):

- `window.addEventListener('scroll'`
- `document.addEventListener('scroll'`
- `onScroll`
- `scrollY`
- `scrollTop`
- `pageYOffset`
- `getBoundingClientRect`
- `IntersectionObserver`
- `useScrollPosition`

### 5c. Scroll restoration config

Provide the contents of `next.config.js` or `next.config.mjs` in full. Then search for and report any use of:

- `scrollRestoration`
- `experimental: { scrollRestoration`
- `router.beforePopState`
- `window.history.scrollRestoration`

---

## Section 6 — Animation and Motion Configuration

### 6a. Framer Motion usage

Search for all uses of Framer Motion in the project and provide complete component code for each file that uses it. Pay particular attention to:

- `AnimatePresence`
- `motion.div` and other motion elements wrapping page-level or layout-level containers
- `useMotionValue`, `useTransform`, `useScroll` from framer-motion
- Any `layoutId` usage
- Any `exit` animations on layout components

### 6b. CSS transitions and animations

Search for and report every CSS class or inline style containing:

- `transition`
- `animation`
- `transform`
- `will-change`
- `backface-visibility`
- `-webkit-transform`

> **Note:** `will-change: transform` and `transform: translateZ(0)` create new stacking contexts that can interfere with fixed positioning in Safari. **Flag every instance.**

### 6c. Page transition wrapper

If there is any component wrapping pages for transition purposes (often in `app/layout.tsx` or a `PageWrapper` component), provide its full source. This is a common root cause of overscroll background exposure.

---

## Section 7 — Layout Containers and Page Wrappers

Provide the **COMPLETE** source of every layout-level wrapper component. These are components that wrap page content and typically appear in `app/layout.tsx` or are used across most pages. Common names:

- `components/Layout.tsx`
- `components/PageWrapper.tsx`
- `components/Container.tsx`
- `components/Main.tsx`

For each, identify and annotate:

- All overflow-related classes or styles
- All height/min-height values
- All position values
- Any background color applied
- Whether it renders a `<main>` or `<div>` as root

---

## Section 8 — Shopping Cart and Modal Overlays

If the site has a slide-over cart, modal, or drawer overlay, provide the **COMPLETE** source. Overlays that use body scroll locking are a frequent contributor to overscroll artifacts after close. Include:

- Full component source of the cart/drawer/modal
- Any body scroll lock library usage (`body-scroll-lock`, `scroll-lock`, etc.)
- Manual body overflow manipulation (`document.body.style.overflow`)
- Any cleanup logic when the overlay closes

---

## Section 9 — Existing Safari / iOS-Specific Code

Search the entire codebase for any code that is Safari or iOS-specific and provide every match:

- `-webkit-` prefixed CSS properties
- `safari` in class names or comments
- `iOS` or `ios` in comments or variable names
- `navigator.userAgent` or `navigator.platform` usage
- `/iPad|iPhone|iPod/` or similar UA sniffing
- `env(safe-area-inset` usage
- `100dvh` usage
- Any conditional logic keyed on device type or browser

---

## Section 10 — Viewport, Meta Tags, and PWA Config

Provide:

- The exact viewport meta tag as rendered (check `app/layout.tsx`, `next.config`, or `generateViewport`)
- Any `theme-color` meta tags
- Any PWA manifest (`manifest.json` or `manifest.webmanifest`)
- The contents of `public/manifest.json` if it exists

> **Note:** `interactive-widget=resizes-content` in the viewport meta affects how Safari handles the keyboard and safe areas. Report the exact string.

---

## Section 11 — Bug Reproduction and Visual Description

In this section, do **NOT** provide code. Answer the following questions about observed behavior as precisely as possible:

1. **Trigger sequence:** Describe the exact scroll gesture that reliably triggers the bug (e.g., fast fling up to top of page, then drag down).
2. **Visual artifact:** What color appears in the overscroll region above the header? White? The page body background? A different color?
3. **Header behavior:** Does the header disappear, become transparent, shift position, or remain fixed during the artifact?
4. **Affected pages:** Does this happen on all pages, only the homepage, only pages with specific components (cart, modals)?
5. **Devices tested:** Which iOS devices and Safari versions exhibit this? Does it occur in Safari only or also Chrome on iOS?
6. **Prior fix attempts:** List every approach that has been tried, even if unsuccessful. Include specific CSS properties, JS approaches, and library-based solutions.
7. **Partial fixes:** Did any attempt reduce the frequency or severity of the bug without fully resolving it?

---

## Section 12 — Runtime and Compiled Output

### 12a. Rendered HTML structure

Using browser DevTools on the live site (mobile Safari or desktop Safari), copy the outermost rendered HTML of the page from the Elements/Inspector panel, from `<html>` through the closing tag of the header. Paste it verbatim.

### 12b. Computed styles on key elements

In DevTools, select each of the following elements and copy its computed styles for the properties listed. Paste verbatim:

- `html` element: `overflow`, `overscroll-behavior`, `background`, `height`, `position`
- `body` element: `overflow`, `overscroll-behavior`, `background`, `height`, `position`
- Main page wrapper/container: `overflow`, `height`, `position`, `background`
- Header/navbar element: `position`, `top`, `z-index`, `background`, `height`

### 12c. .next build output check (optional)

If accessible, provide the output of:

```bash
grep -r 'overscroll\|overflow\|position.*fixed\|will-change' .next/static/css/ | head -60
```

---

## Section 13 — Relevant Dependency Versions

From `package.json` or `package-lock.json`, provide the installed versions of:

- `next`
- `react`
- `framer-motion` (if installed)
- `tailwindcss`
- `@tailwindcss/forms` or other Tailwind plugins
- Any scroll locking library (`body-scroll-lock`, `react-remove-scroll`, etc.)
- Any animation library (GSAP, Lottie, etc.)

---

## Section 14 — Diagnostic Targets for Claude

Once all sections above are collected, Claude will evaluate the following hypotheses in order of likelihood. **Do not attempt to fix anything in Cursor before Claude reviews the complete output.**

---

### Hypothesis A — Overscroll background exposed by rubber-band

The scroll container (`html` or `body`) has a white or mismatched background, and the rubber-band overscroll region inherits that color instead of the header's fill color.

*Fix direction:* Match background colors of `html`, `body`, and header; or use a pseudo-element / fixed background layer behind the header.

---

### Hypothesis B — Fixed header losing paint priority during composite

A `will-change: transform` or `transform: translateZ(0)` somewhere in the scroll stack creates a new compositing layer, and during the rubber-band animation Safari re-composites in a way that pushes the header below the overscroll layer.

*Fix direction:* Audit and remove unnecessary compositing hints.

---

### Hypothesis C — Scroll listener updating header state during bounce

A scroll direction or scroll position hook reads `window.scrollY` during the rubber-band bounce (which can return negative or erratic values on iOS). This incorrectly hides or repositions the header.

*Fix direction:* Clamp `scrollY` to `0`, debounce, or use a passive observer pattern immune to bounce values.

---

### Hypothesis D — Framer Motion AnimatePresence creating stacking context gap

Page transition animations via Framer Motion briefly unmount or reposition the layout container, creating a frame where the fixed header is not rendered above the overscroll region.

*Fix direction:* Move header outside `AnimatePresence` scope in the layout tree.

---

### Hypothesis E — Body scroll lock leaving overflow hidden on body

A cart or modal overlay locks body scroll (`overflow: hidden`) and the cleanup function fails or races, leaving body in a locked state that conflicts with Safari's native rubber-band system.

*Fix direction:* Audit lock/unlock pairs; use `react-remove-scroll` instead of manual `document.body.style.overflow` manipulation.

---

### Hypothesis F — Viewport height units causing layout shift

Use of `100vh` instead of `100dvh` causes the page layout to mismatch the actual visible viewport in Safari, and during the bounce the layout snaps in a way that exposes background.

*Fix direction:* Use `100dvh` or the CSS `env()` approach throughout.

---

### Hypothesis G — Header background not covering safe area inset

On notched or Dynamic Island devices, the header background does not extend into the `safe-area-inset-top` region. During overscroll, this inset area shows through.

*Fix direction:* Add `padding-top: env(safe-area-inset-top)` to the header and ensure background extends behind the status bar.

---

*End of Cursor Data Collection Prompt — paste complete output to Claude with this document for root-cause diagnosis.*
