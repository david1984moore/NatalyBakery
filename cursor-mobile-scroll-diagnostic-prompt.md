# Mobile Scroll & Navigation Issues - Professional Production Standards

## Quality Standard

This is a production bakery e-commerce site where mobile experience directly impacts revenue. The behavior must be **flawless, seamless, and indistinguishable from a professionally-developed native application**. 

These issues have persisted through multiple fix attempts, indicating architectural root causes rather than surface-level CSS problems. Previous attempts failed because they addressed symptoms without understanding the causal chain.

**Success Standard:** Professional iOS app scroll behavior—no visual artifacts, no janky animations, no white space leakage, no glitches under any scroll velocity or direction. Zero tolerance for "good enough" solutions.

## Overview
The caramelandjo.com website has several critical mobile-specific issues that require systematic investigation, root cause analysis, and production-grade resolution.

## Critical Issues to Resolve

### 1. White Space Above Header During Scroll
**Problem:** White space appears above the header when scrolling down on mobile devices, creating a visual gap that breaks the design integrity.

**Observed Behavior:**
- White space appears during scroll-down motion
- Issue is specific to mobile viewport
- Likely related to iOS bounce/overscroll behavior
- May be connected to fixed/sticky positioning edge cases

**Root Cause Investigation Needed:**
- Check for `overflow` properties on `<html>` and `<body>` tags
- Investigate viewport height calculations (100vh vs 100dvh vs 100svh)
- Examine header positioning (fixed, sticky, absolute)
- Review any scroll-prevention or scroll-lock JavaScript
- Check for React/Next.js layout wrapper components affecting scroll container
- Investigate CSS transforms or translations on scroll that might expose background

### 2. Bouncy/Glitchy Scroll Animation on Hard Scroll Up
**Problem:** When performing a hard/fast scroll up gesture on mobile, the page exhibits clunky, glitchy bounce behavior instead of smooth deceleration.

**Observed Behavior:**
- Normal scroll down works acceptably
- Hard/fast upward scroll triggers janky animation
- Bounce effect feels uncontrolled and unprofessional
- May be related to momentum scrolling conflicts

**Root Cause Investigation Needed:**
- Check for conflicting `-webkit-overflow-scrolling` properties
- Investigate scroll event listeners that might interfere with native momentum
- Review any JavaScript scroll animations or smooth-scroll libraries
- Check for CSS `scroll-behavior: smooth` conflicts with native iOS scrolling
- Examine Framer Motion or other animation libraries affecting scroll
- Look for `touch-action` or `overscroll-behavior` CSS properties

### 3. Brown Area at Bottom of Contact Page
**Problem:** The contact page displays a brown area at the bottom instead of maintaining consistent background throughout.

**Root Cause Investigation Needed:**
- Check contact page component for min-height settings
- Investigate parent container background colors vs page backgrounds
- Review footer component positioning and height calculations
- Check for viewport height issues on contact page specifically
- Examine CSS inheritance from layout components
- Verify contact form container is stretching to full available height

### 4. Navigation Bar Not Sticky on Mobile (Except Hero Page)
**Problem:** The navigation bar with brand name, menu buttons, and nav links is not sticky on mobile, except on the hero/home page.

**Desired Behavior:**
- Nav should be sticky on mobile for ALL pages except the hero/home page
- Currently it appears the opposite may be occurring or behavior is inconsistent

**Root Cause Investigation Needed:**
- Identify layout component structure (RootLayout vs Header component vs custom nav)
- Check for page-specific CSS overrides affecting nav positioning
- Investigate z-index stacking contexts preventing sticky behavior
- Review conditional rendering logic for navigation component
- Check for different header variants between pages
- Examine scroll containers that might prevent sticky positioning (sticky only works within its scroll container)
- Verify mobile breakpoint media queries for nav positioning

## Investigation Methodology

### Step 1: Architectural Discovery
Please analyze and document:

```
1. Layout Structure:
   - Path to main layout component (app/layout.tsx or pages/_app.tsx)
   - Path to navigation/header component
   - How navigation is rendered (per-page vs global layout)
   
2. CSS Architecture:
   - Global CSS location (app/globals.css or styles/globals.css)
   - Tailwind config if applicable
   - Any CSS modules or styled-components in use
   
3. Scroll-Related Code:
   - Search for: "scroll", "overflow", "sticky", "fixed", "position"
   - Identify any scroll event listeners
   - Find animation libraries (Framer Motion, GSAP, etc.)
   - Locate any smooth-scroll or scroll-lock utilities

4. Mobile-Specific Code:
   - Search for: "mobile", "useMediaQuery", "window.innerWidth", breakpoint logic
   - Identify mobile-specific CSS classes or components
```

### Step 2: Root Cause Analysis
For each issue, provide:

1. **Specific File & Line Numbers** where the problem originates
2. **Why** the current implementation causes the observed behavior
3. **Related Code** that interacts with the problem area
4. **Mobile vs Desktop** differences in behavior and their causes

### Step 3: Comprehensive Solution

Provide complete, production-ready fixes including:

1. **All affected files** with full updated code (not fragments)
2. **Import statements** and file paths
3. **Inline comments** explaining what changed and why
4. **Edge case handling** for:
   - iOS Safari specifically (primary testing environment)
   - Different viewport sizes (iPhone SE to iPhone Pro Max)
   - Portrait vs landscape orientation
   - Home page vs other pages (for nav sticky behavior)
5. **Testing checklist** for validation

## Technical Context

**Stack:**
- Next.js (specify version from package.json)
- Tailwind CSS (likely)
- React
- Deployed on Render

**Primary Testing Environment:**
- iOS Safari (mobile)
- Viewport: 390-428px width (modern iPhones)

**Design Principles:**
- Clean, minimal aesthetic (brown/tan color scheme)
- Smooth, professional interactions
- Mobile-first experience
- No janky animations or visual artifacts

## Constraints & Priorities

**Must Not Break:**
- Existing desktop experience
- Other page functionality
- Current color scheme and visual design
- Database connections or API routes

**Priority Order:**
1. White space above header (highest visibility impact)
2. Sticky nav on mobile (UX functionality)
3. Glitchy scroll behavior (professional polish)
4. Contact page brown area (visual consistency)

## Deliverable Format

Please provide your response in this structure:

```markdown
## INVESTIGATION FINDINGS

### Architectural Overview
[Discovered layout structure, CSS approach, libraries in use]

### Issue #1: White Space Above Header
**Root Cause:** [Specific file:line, explanation]
**Related Code:** [Other components/styles involved]
**Why This Happens:** [Technical explanation]

[Repeat for each issue]

---

## COMPREHENSIVE SOLUTIONS

### Fix #1: [Issue Name]

#### Files to Modify:
1. `path/to/file.tsx` - [What changes and why]
2. `path/to/styles.css` - [What changes and why]

#### Complete Updated Code:

**File: `path/to/file.tsx`**
```typescript
[FULL FILE CONTENTS WITH INLINE COMMENTS]
```

**File: `path/to/styles.css`**
```css
[FULL FILE CONTENTS WITH INLINE COMMENTS]
```

[Repeat for each fix]

---

## TESTING CHECKLIST

- [ ] Test on iOS Safari (primary)
- [ ] Test scroll up/down behavior
- [ ] Test on home page specifically
- [ ] Test on non-home pages
- [ ] Verify no white space appears above header
- [ ] Verify nav sticky behavior correct per page
- [ ] Verify contact page extends full height
- [ ] Test landscape orientation
- [ ] Test on smallest mobile viewport (320px)
- [ ] Verify desktop experience unchanged
```

## Additional Context

This codebase uses systematic problem-solving approaches. Previous attempts to fix these issues have failed because they treated symptoms rather than root causes. I need you to:

1. **Investigate thoroughly** before proposing solutions
2. **Trace the causal chain** from symptoms to root architectural decisions
3. **Provide complete files** rather than code fragments
4. **Consider iOS Safari quirks** explicitly (this is the primary mobile browser)
5. **Test your understanding** by explaining why previous surface-level CSS changes would fail

The goal is a **single, comprehensive fix** that addresses the underlying architectural issues causing these symptoms, not another round of trial-and-error CSS adjustments.

---

## Success Criteria

Solutions are successful when:

✅ No white space appears above header during any scroll motion on mobile
✅ Scroll behavior feels smooth and native on iOS
✅ Nav bar is sticky on mobile for all pages except hero/home
✅ Contact page maintains consistent background with no brown area at bottom
✅ Desktop experience remains unchanged
✅ No new visual artifacts or glitches introduced
✅ Code is maintainable and follows Next.js best practices
