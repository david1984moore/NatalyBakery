# Page Transitions & Loading States - Apple-Level Professional Standards

## Quality Standard

This is a production bakery e-commerce site where every interaction shapes brand perception. The transition and loading experience must be **seamless, graceful, and Apple-quality** with thoughtfully choreographed animations that feel premium and intentional.

Users should never see jarring content flashes, instant appearances, or abrupt changes. Every state transition—page navigation, content loading, component mounting—should feel fluid, purposeful, and perfectly timed. The experience should communicate craft, attention to detail, and premium quality.

**Success Standard:** Apple-level polish—smooth page transitions with carefully orchestrated timing, elegant loading states that maintain context, graceful content reveals that respect visual hierarchy, zero layout shift or flash-of-content, and perfectly calibrated animation durations that feel fast but never rushed. Professional, considered, premium.

## Critical Issues to Resolve

### 1. Jarring Page Transitions

**Problem:** Navigation between pages feels instant and abrupt rather than smooth and graceful. Content appears suddenly without transition, creating a jarring experience that breaks the premium feel.

**Observed Behavior:**
- Instant page replacement with no transition
- Previous page disappears abruptly
- New page appears instantly
- No visual continuity between states
- Feels cheap and unpolished
- Lacks the smooth, connected feeling of premium apps

**Desired Apple-Standard Behavior:**
- Smooth cross-fade between pages (200-300ms)
- Outgoing content gracefully exits
- Incoming content gracefully enters
- Brief overlap creates visual continuity
- Shared elements maintain position (if applicable)
- Feels fluid and intentional

**Root Cause Investigation Needed:**
- Check for Next.js page transition implementation
- Verify if using app router or pages router
- Look for transition libraries (Framer Motion, etc.)
- Investigate layout component structure
- Check for existing animation configurations
- Identify what prevents smooth transitions currently

### 2. Flash of Unstyled/Unloaded Content (FOUC/FOLC)

**Problem:** Content flashes onto screen instantly in raw, unstyled, or partially-loaded states before settling into final appearance. This creates unprofessional, janky perception.

**Observed Behavior:**
- Images pop in suddenly
- Text appears before styling applies
- Layout shifts as content loads
- Components render in stages (flash of partial state)
- No loading states or skeletons
- Content "jumps" into place

**Desired Apple-Standard Behavior:**
- Skeleton screens or subtle loading states
- Content fades in when ready (opacity 0 → 1)
- No layout shift (space reserved)
- Images load behind the scenes, appear smoothly
- Progressive reveal respects visual hierarchy
- "Instant" feel without jarring appearance

**Root Cause Investigation Needed:**
- Check image loading strategy
- Verify Next.js Image placeholder usage
- Look for loading state implementations
- Investigate CSS that might hide content until ready
- Check for layout shift sources
- Identify components rendering before data ready

### 3. Inconsistent Animation Timing and Easing

**Problem:** Different elements use different animation speeds, easing curves, and timing, creating a chaotic, uncoordinated experience rather than choreographed harmony.

**Observed Behavior:**
- Some transitions fast, others slow
- No consistent easing curve
- Animations feel arbitrary
- No relationship between element animations
- Lacks professional coordination
- Feels amateurish and random

**Desired Apple-Standard Behavior:**
- Consistent timing scale (150ms, 200ms, 300ms, 500ms)
- Apple's preferred easing: cubic-bezier(0.4, 0.0, 0.2, 1) or similar
- Coordinated choreography (staggered reveals)
- Faster for micro-interactions, slower for major transitions
- Everything feels part of unified design system
- Professional, intentional timing

**Root Cause Investigation Needed:**
- Audit all transition/animation CSS
- Check for inline styles with random durations
- Look for multiple conflicting easing curves
- Identify if design system defines timing
- Verify Tailwind animation configuration
- Document current timing inconsistencies

### 4. Missing Loading States for Async Operations

**Problem:** Async operations (data fetching, form submissions, cart updates) provide no visual feedback, leaving users uncertain if action was registered.

**Observed Behavior:**
- Click "Add to Cart" → nothing happens visually
- Page navigation → instant switch or blank screen
- Form submission → unclear if processing
- No spinners, progress indicators, or feedback
- Users may click multiple times
- Feels unresponsive and broken

**Desired Apple-Standard Behavior:**
- Immediate visual acknowledgment of action
- Subtle loading indicators (spinner, skeleton, progress)
- Optimistic UI updates where appropriate
- Clear completion feedback
- Disabled states during processing
- User always knows what's happening

**Root Cause Investigation Needed:**
- Identify all async operations (navigation, API calls, mutations)
- Check for loading state management
- Look for feedback mechanisms
- Verify button disabled states during processing
- Investigate optimistic UI patterns
- Check cart update visual feedback

### 5. Lack of Micro-interactions and Polish

**Problem:** Interface lacks the thoughtful micro-interactions that make premium experiences feel alive and responsive—button hover states, touch feedback, subtle scale changes, etc.

**Observed Behavior:**
- Buttons don't respond to hover/touch
- No visual feedback on interaction
- Static, lifeless interface
- Missing the "juice" that makes UI feel good
- Doesn't reward user interaction
- Feels cheap compared to Apple standards

**Desired Apple-Standard Behavior:**
- Button hover: subtle scale (1.02) or brightness change
- Touch: active state with slight scale down (0.98)
- Focus: clear, beautiful focus rings
- Success states: subtle check animation or color pulse
- All interactions acknowledged visually
- Interface feels responsive and alive

**Root Cause Investigation Needed:**
- Audit interactive element states (hover, active, focus)
- Check for transition properties on buttons/links
- Look for existing micro-interaction implementations
- Verify touch feedback on mobile
- Identify opportunities for polish
- Check accessibility of interactive states

### 6. Poor Handling of Orientation Changes and Viewport Transitions

**Problem:** Rotating device or resizing viewport causes jarring layout shifts, content repositioning, or animation glitches instead of smooth adaptation.

**Observed Behavior:**
- Orientation change causes flash/jump
- Layout instantly switches rather than smoothly adapting
- Animations break or restart during resize
- Content repositions abruptly
- No transition between layout states
- Feels broken and unpolished

**Desired Apple-Standard Behavior:**
- Smooth transition during orientation change
- Content reflows gracefully
- No flash or jarring repositioning
- Animations pause and resume intelligently
- Maintains context during transition
- Feels intentional and controlled

**Root Cause Investigation Needed:**
- Check for resize/orientation event handlers
- Look for viewport change CSS transitions
- Verify media query transition strategies
- Investigate layout shift sources
- Check animation pause/resume logic
- Identify responsive breakpoint handling

## Investigation Methodology

### Step 1: Comprehensive Transition Audit

Please analyze and document:

```
1. Current Transition Implementation:
   - Next.js router: App router or Pages router?
   - Any transition libraries: Framer Motion, React Transition Group, etc.?
   - Layout component structure for page transitions
   - Current animation/transition CSS across codebase
   
2. Loading State Inventory:
   - Image loading strategy (Next.js Image, placeholders)
   - Skeleton screen implementations (or lack thereof)
   - Loading spinners or indicators
   - Suspense boundaries if using React 18+
   
3. Animation Timing Audit:
   - Search for: "transition", "animation", "duration", "ease"
   - Document all durations and easing curves found
   - Identify inconsistencies and conflicts
   - Check Tailwind config for animation settings
   
4. Interactive Element States:
   - Audit buttons, links, form inputs for hover/active/focus
   - Check for transition properties on interactive elements
   - Look for micro-interaction implementations
   - Verify mobile touch feedback
   
5. Async Operation Handling:
   - Identify all data fetching points
   - Check for loading state management
   - Look for optimistic UI patterns
   - Verify form submission feedback
```

### Step 2: Root Cause Analysis

For each issue, provide:

1. **Specific File & Line Numbers** where transitions should be but aren't
2. **Missing Implementations** (what's absent that should exist)
3. **Conflicting Animations** (styles that fight each other)
4. **Why** current approach feels jarring
5. **Apple Product Analysis** (how similar transitions work in iOS/macOS)
6. **Performance Implications** of proposed solutions

### Step 3: Apple-Quality Transition System Implementation

Provide complete, production-ready solution including:

1. **Unified Design System** for animations and transitions
2. **Page transition framework** with route change animations
3. **Loading state patterns** (skeletons, spinners, progressive reveal)
4. **Micro-interaction library** for common interactive elements
5. **Timing and easing standards** matching Apple's design language
6. **Performance optimization** (GPU acceleration, will-change)
7. **Accessibility considerations** (prefers-reduced-motion)

## Technical Context

**Stack:**
- Next.js (specify version and router type)
- React
- Tailwind CSS (likely)
- Framer Motion (if used, specify version)

**Primary Testing Environment:**
- iOS Safari (mobile) - CRITICAL
- Chrome for iOS (mobile)
- Desktop Safari (for comparison to macOS standards)
- Various iPhone models

**Apple Design Language Reference Points:**
- iOS app transitions (smooth cross-fades, coordinated motion)
- Safari page loads (progressive reveal)
- Apple website animations (subtle, purposeful, premium)
- macOS window animations (smooth, never jarring)

**Animation Timing Standards (Apple-Inspired):**
- **Micro-interactions:** 150ms (button hover, small changes)
- **Component transitions:** 200-250ms (cards, modals appearing)
- **Page transitions:** 300ms (route changes, major view changes)
- **Longer animations:** 400-500ms (complex orchestrations)

**Easing Curves (Apple-Standard):**
- **Standard ease:** `cubic-bezier(0.4, 0.0, 0.2, 1)` - Most transitions
- **Ease out:** `cubic-bezier(0.0, 0.0, 0.2, 1)` - Enter animations
- **Ease in:** `cubic-bezier(0.4, 0.0, 1, 1)` - Exit animations
- **Ease in-out:** `cubic-bezier(0.4, 0.0, 0.6, 1)` - Symmetric transitions

## Constraints & Priorities

**Must Not Break:**
- Core functionality (navigation, cart, forms)
- SEO (ensure proper SSR/SSG)
- Performance (animations must be 60fps)
- Accessibility (respect prefers-reduced-motion)
- Existing content and data

**Priority Order:**
1. Page transitions (highest impact on perceived quality)
2. Loading states and FOUC elimination (professional polish)
3. Consistent timing and easing (unified design system)
4. Async operation feedback (user confidence)
5. Micro-interactions (premium feel)
6. Orientation/viewport transitions (edge case polish)

## Mandatory Deliverable Format

Your response must follow this exact structure. Do not skip sections.

---

## PART 1: INVESTIGATION FINDINGS

### Current State Analysis

**Next.js Configuration:**
- Router type: [App Router or Pages Router]
- Next.js version: [version from package.json]
- Routing strategy: [SSG, SSR, ISR, mixed]

**Animation/Transition Libraries:**
- Currently installed: [list libraries and versions]
- Currently used: [what's actually implemented]
- Configuration files: [locations]

**Key Files Inventory:**
```
app/layout.tsx or pages/_app.tsx     - [Root layout, transition opportunity]
app/template.tsx (if exists)         - [Per-route wrapper, transition point]
components/PageTransition.tsx        - [If exists, current implementation]
app/globals.css                      - [Global animation/transition styles]
tailwind.config.js                   - [Animation configuration]
[Any animation/transition files]     - [Current implementations]
```

**Transition Audit Results:**

| Element/Context | Current State | Issues Identified |
|----------------|---------------|-------------------|
| Page navigation | [Instant/Abrupt/Transition?] | [Specific problems] |
| Image loading | [Pop-in/Smooth/Skeleton?] | [Specific problems] |
| Component mounting | [Instant/Fade?] | [Specific problems] |
| Button interactions | [Static/Responsive?] | [Specific problems] |
| Form submissions | [No feedback/Loading?] | [Specific problems] |
| Cart updates | [Instant/Smooth?] | [Specific problems] |

**Animation Timing Inconsistencies Found:**
```css
/* Document all different durations/easings found */
.component-a { transition: 100ms ease; }
.component-b { transition: 0.5s linear; }
.component-c { animation: 200ms ease-in-out; }
/* Etc. - show the chaos */
```

---

### Issue #1: Jarring Page Transitions

**Root Cause:** [Specific explanation - likely: no transition implementation between routes]

**Current Implementation:**
```typescript
// Show current routing approach
// Likely: default Next.js with no transitions
```

**Technical Explanation:**
[Why Next.js doesn't provide route transitions by default. How this creates instant page replacement. What's needed to achieve smooth transitions.]

**Apple Product Analysis:**
[How iOS handles navigation transitions - slide animations, cross-fades, shared element transitions. How Apple.com transitions between pages.]

**Causal Chain:**
1. [Next.js default behavior: instant page replacement]
2. [Why this feels jarring: no visual continuity]
3. [What professional sites do differently]

**What Professional Implementation Requires:**
- Route change detection (useRouter, usePathname)
- Exit animation for outgoing page
- Enter animation for incoming page
- Proper timing coordination
- Loading state during transition

**Related Code Dependencies:**
[Layout components, router usage, page components]

---

### Issue #2: Flash of Unstyled Content (FOUC/FOLC)

**Root Cause:** [Specific file:line showing content rendering before ready]

**Current Implementation:**
```typescript
// Show how images/content currently render
<Image src={url} alt={alt} /> // No placeholder, instant pop-in
```

**Technical Explanation:**
[Why content flashes in: synchronous rendering without loading states, missing Next.js Image placeholders, no skeleton screens, layout shift as images load]

**Causal Chain:**
1. [How content currently renders]
2. [Why this creates visual flash]
3. [What causes layout shift]

**Apple Product Analysis:**
[How iOS apps show skeleton screens during load. How Apple.com progressively reveals content. Safari's smooth page load experience.]

**Missing Implementations:**
- Next.js Image blur placeholders
- Skeleton loading states
- Progressive content reveal
- Space reservation to prevent shift

**Related Code Dependencies:**
[Image components, data fetching, component mounting]

---

### Issue #3: Inconsistent Animation Timing

**Root Cause:** [No design system for animations, ad-hoc timing choices]

**Animation Chaos Documentation:**
```
Found 15 different transition durations:
- 100ms: [3 occurrences]
- 150ms: [5 occurrences]  
- 200ms: [2 occurrences]
- 0.3s: [4 occurrences]
- 500ms: [1 occurrence]

Found 8 different easing curves:
- ease: [7 occurrences]
- linear: [3 occurrences]
- ease-in-out: [2 occurrences]
- custom cubic-bezier: [1 occurrence]
```

**Technical Explanation:**
[Why consistency matters: visual harmony, predictability, professional polish. How inconsistency creates chaos. Why Apple uses limited, well-defined timing scales.]

**Apple Product Analysis:**
[How Apple's design system defines specific timing values. How iOS uses consistent easing curves. Why this creates unified feel.]

**What Professional Implementation Requires:**
- Design system with defined timing scale
- Standardized easing curves
- Tailwind config with custom animations
- Component library using system values

**Related Code Dependencies:**
[All components with transitions, Tailwind config, CSS files]

---

### Issue #4: Missing Async Operation Feedback

**Root Cause:** [Specific file:line showing async operation without loading state]

**Current Implementation:**
```typescript
// Show example of async operation without feedback
async function addToCart() {
  await addItem(product)
  // No loading state, no visual feedback
}
```

**Technical Explanation:**
[Why users need feedback: action acknowledgment, processing indication, completion confirmation. How absence creates uncertainty and multiple clicks.]

**Missing Implementations:**
- Loading states on buttons during async
- Optimistic UI updates
- Success/error feedback
- Disabled states during processing

**Apple Product Analysis:**
[How iOS shows spinners during loading. How App Store handles downloads. How Safari indicates page loading.]

**Related Code Dependencies:**
[Cart functionality, form submissions, data mutations, button components]

---

### Issue #5: Missing Micro-interactions

**Root Cause:** [Interactive elements lack hover/active/focus states and transitions]

**Current Implementation:**
```css
/* Show current button styles */
.button {
  /* Missing: transition properties */
  /* Missing: hover state changes */
  /* Missing: active state feedback */
}
```

**Technical Explanation:**
[Why micro-interactions matter: feedback, engagement, premium feel. How absence makes interface feel cheap. Why Apple obsesses over these details.]

**Apple Product Analysis:**
[How iOS buttons provide instant touch feedback. How macOS buttons respond to hover. How Apple's websites reward interaction.]

**What Professional Implementation Requires:**
- Hover states (subtle scale or brightness)
- Active/pressed states (scale down)
- Focus states (clear, accessible rings)
- Transition properties for smooth changes
- Touch feedback on mobile

**Related Code Dependencies:**
[Button components, link components, form inputs, interactive elements]

---

### Issue #6: Poor Viewport Transition Handling

**Root Cause:** [Orientation/resize causes abrupt layout changes]

**Current Implementation:**
[Document how layout changes on viewport resize]

**Technical Explanation:**
[Why orientation changes feel jarring: instant media query switches, no transition between states, animations break during resize]

**What Professional Implementation Requires:**
- Smooth transitions on viewport changes
- Paused animations during orientation change
- Graceful layout reflow
- No flash or jump

**Related Code Dependencies:**
[Layout components, responsive CSS, media queries]

---

### Why Common Fixes Fail

**Issue #1 (Page Transitions):**
- ❌ Why adding basic fade alone fails: [Needs exit + enter coordination, loading states]
- ❌ Why heavy libraries fail: [Performance overhead, complexity, non-native feel]
- ✅ What actually works: [Lightweight custom solution with proper timing]

**Issue #2 (FOUC):**
- ❌ Why hiding content until loaded fails: [Poor UX, feels slow, no feedback]
- ✅ What actually works: [Skeleton screens, blur placeholders, progressive reveal]

**Issue #3 (Timing Consistency):**
- ❌ Why standardizing to one duration fails: [Different contexts need different timing]
- ✅ What actually works: [Defined scale with intentional choices]

**Issue #4 (Async Feedback):**
- ❌ Why generic spinners fail: [Overused, slows perceived performance]
- ✅ What actually works: [Optimistic UI + subtle indicators]

**Issue #5 (Micro-interactions):**
- ❌ Why heavy animations fail: [Distracting, feels gimmicky]
- ✅ What actually works: [Subtle, purposeful, Apple-quality restraint]

---

## PART 2: COMPREHENSIVE SOLUTION

### Solution Architecture Overview

**Approach:**
[Implement unified transition system with: (1) custom page transition wrapper, (2) design system for timing/easing, (3) loading state patterns, (4) micro-interaction library, (5) async feedback mechanisms, all optimized for 60fps performance and Apple-quality feel]

**Design System - Animation Timing Scale:**
```javascript
// Tailwind config additions
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        'micro': '150ms',     // Button hover, small changes
        'standard': '250ms',   // Component transitions, modals
        'page': '300ms',       // Page transitions
        'complex': '500ms',    // Complex orchestrations
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'apple-in': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'apple-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      },
    },
  },
}
```

**Files Modified:**
1. `app/template.tsx` - [Page transition wrapper]
2. `tailwind.config.js` - [Animation design system]
3. `app/globals.css` - [Global transition styles]
4. `components/transitions/` - [Transition components]
5. `components/ui/Button.tsx` - [Micro-interactions]
6. `components/ui/Loading.tsx` - [Loading states]
7. [Additional components as needed]

**Files Created:**
1. `components/transitions/PageTransition.tsx`
2. `components/transitions/FadeIn.tsx`
3. `components/ui/Skeleton.tsx`
4. `hooks/usePageTransition.ts`

**Dependencies Added:**
- None required (pure CSS + React)
- Optional: `framer-motion` if complex orchestration needed

---

### Fix #1: Smooth Page Transitions

**What Changed:**
- Added: `template.tsx` with page transition wrapper
- Created: Custom transition hook for route changes
- Implemented: Coordinated exit + enter animations
- Added: Loading state during transition

**Why This Works:**
[template.tsx re-renders on route change, allowing animation. Coordinated exit/enter prevents jarring switch. Loading state maintains context.]

**Performance Optimization:**
[Uses CSS transitions (GPU-accelerated), will-change property, transform instead of position]

#### Complete Updated Code:

**File: `app/template.tsx`** (create if doesn't exist)
```typescript
'use client'

// Page transition wrapper
// Re-renders on route change, enabling smooth transitions

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import PageTransition from '@/components/transitions/PageTransition'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // CRITICAL: Coordinate exit animation before showing new content
    setIsTransitioning(true)

    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 150) // Half of total transition (exit phase)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <PageTransition isTransitioning={isTransitioning}>
      {displayChildren}
    </PageTransition>
  )
}
```

**File: `components/transitions/PageTransition.tsx`** (create new)
```typescript
'use client'

// Smooth page transition component
// Apple-quality cross-fade between routes

import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  isTransitioning: boolean
}

export default function PageTransition({ children, isTransitioning }: PageTransitionProps) {
  return (
    <div
      className={`
        transition-opacity duration-page ease-apple
        ${isTransitioning ? 'opacity-0' : 'opacity-100'}
      `}
      style={{
        // CRITICAL: GPU acceleration for smooth 60fps
        willChange: 'opacity',
      }}
    >
      {children}
    </div>
  )
}
```

**File: `tailwind.config.js`** (animation system)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // CRITICAL: Apple-quality animation system
      transitionDuration: {
        'micro': '150ms',      // Micro-interactions (hover, small changes)
        'standard': '250ms',   // Standard transitions (modals, components)
        'page': '300ms',       // Page transitions (route changes)
        'complex': '500ms',    // Complex animations (multi-step)
      },
      transitionTimingFunction: {
        // CRITICAL: Apple's standard easing curves
        'apple': 'cubic-bezier(0.4, 0.0, 0.2, 1)',      // Most transitions
        'apple-in': 'cubic-bezier(0.4, 0.0, 1, 1)',     // Enter animations
        'apple-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',  // Exit animations
        'apple-inout': 'cubic-bezier(0.4, 0.0, 0.6, 1)', // Symmetric
      },
    },
  },
  plugins: [],
}
```

---

### Fix #2: Eliminate FOUC with Progressive Loading

**What Changed:**
- Implemented: Skeleton loading screens
- Added: Next.js Image blur placeholders
- Created: Progressive reveal pattern
- Ensured: No layout shift

**Why This Works:**
[Skeleton screens provide immediate visual feedback while content loads. Blur placeholders prevent image pop-in. Progressive reveal respects visual hierarchy.]

#### Complete Updated Code:

**File: `components/ui/Skeleton.tsx`** (create new)
```typescript
// Skeleton loading component
// Apple-style shimmer effect

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

export default function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  }

  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        // CRITICAL: Subtle shimmer effect
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite',
      }}
    />
  )
}
```

**File: `app/globals.css`** (shimmer animation)
```css
/* ============================================
   LOADING & TRANSITION ANIMATIONS
   ============================================ */

/* CRITICAL: Subtle shimmer for skeleton screens */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* CRITICAL: Fade in for loaded content */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* CRITICAL: Prevent layout shift during load */
.image-container {
  position: relative;
  overflow: hidden;
}

.image-container::before {
  content: '';
  display: block;
  padding-top: 100%; /* Aspect ratio - adjust as needed */
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**File: `components/ProductCard.tsx`** (example with skeleton)
```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Skeleton from '@/components/ui/Skeleton'

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="product-card">
      <div className="relative aspect-square">
        {/* CRITICAL: Skeleton shown until image loads */}
        {!imageLoaded && (
          <Skeleton className="absolute inset-0" />
        )}
        
        {/* CRITICAL: Blur placeholder + fade in when loaded */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`
            object-cover rounded-lg
            transition-opacity duration-standard ease-apple
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          placeholder="blur"
          blurDataURL={product.blurDataURL} // Generate this during build
          onLoadingComplete={() => setImageLoaded(true)}
          priority={product.featured} // First few images
        />
      </div>
      
      {/* Content fades in after image */}
      <div className={imageLoaded ? 'fade-in' : 'opacity-0'}>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    </div>
  )
}
```

---

### Fix #3: Micro-interactions for Premium Feel

**What Changed:**
- Added: Hover states to all interactive elements
- Implemented: Touch feedback for mobile
- Created: Focus states with proper accessibility
- Added: Smooth transitions to all state changes

**Why This Works:**
[Subtle scale changes and transitions make interface feel responsive and alive. Touch feedback acknowledges user interaction. Accessibility maintained with visible focus states.]

#### Complete Updated Code:

**File: `components/ui/Button.tsx`** (with micro-interactions)
```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

export default function Button({ 
  children, 
  variant = 'primary', 
  loading = false,
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = `
    relative
    px-6 py-3
    rounded-lg
    font-medium
    
    /* CRITICAL: Smooth transitions for all states */
    transition-all duration-micro ease-apple
    
    /* CRITICAL: Transform for smooth scaling */
    transform-gpu
    
    /* Disabled state */
    disabled:opacity-50 disabled:cursor-not-allowed
    
    /* Focus state - accessibility critical */
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `

  const variantStyles = {
    primary: `
      bg-[#A0826D] text-white
      
      /* CRITICAL: Hover state - subtle scale up */
      hover:scale-[1.02] hover:brightness-110
      
      /* CRITICAL: Active state - scale down for press feedback */
      active:scale-[0.98]
      
      /* Focus ring color */
      focus:ring-[#A0826D]
    `,
    secondary: `
      bg-white text-[#A0826D] border-2 border-[#A0826D]
      hover:scale-[1.02] hover:bg-[#A0826D] hover:text-white
      active:scale-[0.98]
      focus:ring-[#A0826D]
    `,
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]}`}
      disabled={disabled || loading}
      style={{
        // CRITICAL: GPU acceleration for smooth animations
        willChange: 'transform',
      }}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
```

**File: `app/globals.css`** (global micro-interactions)
```css
/* ============================================
   MICRO-INTERACTIONS - Apple Quality
   ============================================ */

/* CRITICAL: All links get subtle hover feedback */
a {
  transition: opacity 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

a:hover {
  opacity: 0.8;
}

/* CRITICAL: Input fields get smooth focus transitions */
input,
textarea,
select {
  transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  ring: 2px;
  ring-color: #A0826D;
  ring-offset: 2px;
}

/* CRITICAL: Card hover effects */
.card {
  transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* CRITICAL: Touch feedback for mobile */
@media (hover: none) and (pointer: coarse) {
  button:active,
  .button:active {
    transform: scale(0.98);
  }
}
```

---

### Fix #4: Async Operation Feedback

**What Changed:**
- Added: Loading states to all async buttons
- Implemented: Optimistic UI for cart updates
- Created: Success/error feedback animations
- Added: Disabled states during processing

**Why This Works:**
[Immediate feedback acknowledges action. Loading states prevent confusion. Optimistic updates feel instant while real update happens in background.]

#### Complete Updated Code:

**File: `components/AddToCartButton.tsx`** (with feedback)
```typescript
'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface AddToCartButtonProps {
  productId: string
  productName: string
}

export default function AddToCartButton({ productId, productName }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)

    try {
      // CRITICAL: Optimistic UI - add to cart immediately in UI
      // (Update cart state optimistically here)
      
      // Then do actual API call
      await fetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      })

      // CRITICAL: Success feedback
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      
    } catch (error) {
      // Handle error with visual feedback
      console.error('Failed to add to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      loading={loading}
      disabled={loading || success}
      className={`
        ${success ? 'bg-green-600' : ''}
        transition-colors duration-standard ease-apple
      `}
    >
      {success ? (
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
          Added!
        </span>
      ) : (
        `Add to Cart`
      )}
    </Button>
  )
}
```

---

### Fix #5: Respect User Preferences (Accessibility)

**What Changed:**
- Added: `prefers-reduced-motion` media query support
- Implemented: Reduced animations for accessibility
- Ensured: Functionality preserved without animations

**Why This Works:**
[Respects user accessibility needs. Users with motion sensitivity can still use site. Apple standard practice.]

**File: `app/globals.css`** (reduced motion)
```css
/* ============================================
   ACCESSIBILITY - Reduced Motion
   ============================================ */

/* CRITICAL: Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Maintain functionality, just instant instead of animated */
  .page-transition,
  .fade-in {
    animation: none;
    transition: none;
  }
}
```

---

## PART 3: TESTING & VALIDATION

### Implementation Steps

1. Add `template.tsx` for page transitions
2. Update Tailwind config with animation system
3. Update all buttons with micro-interactions
4. Add skeleton screens to loading states
5. Implement Next.js Image blur placeholders
6. Add async operation feedback
7. Test thoroughly on iOS devices

### Verification Commands

```bash
npm run build
npm run dev

# Check for console errors
# Verify no hydration warnings
# Test page transitions
# Validate 60fps animations (Chrome DevTools Performance)
```

### Comprehensive Testing Protocol

**Page Transition Testing:**

- [ ] Navigate between pages → smooth 300ms fade
- [ ] No flash of old content
- [ ] No flash of new content
- [ ] Loading state during transition (if needed)
- [ ] Feels smooth and intentional
- [ ] Works on iOS Safari
- [ ] Works on Chrome mobile

**Loading State Testing:**

- [ ] Images show blur placeholder
- [ ] Images fade in when loaded
- [ ] Skeletons display during data fetch
- [ ] No layout shift when content loads
- [ ] Progressive reveal feels smooth
- [ ] No FOUC anywhere on site

**Micro-interaction Testing:**

- [ ] Buttons scale on hover (desktop)
- [ ] Buttons scale on press (mobile)
- [ ] Links fade on hover
- [ ] Input fields show focus rings
- [ ] Cards lift on hover
- [ ] All interactions feel smooth
- [ ] Timing consistent across elements

**Async Operation Testing:**

- [ ] Add to cart shows loading state
- [ ] Button disabled during processing
- [ ] Success feedback displays
- [ ] Optimistic UI updates immediately
- [ ] Form submissions show feedback
- [ ] No confusion about action status

**Performance Testing:**

- [ ] All animations 60fps (Chrome DevTools)
- [ ] No jank or stutter
- [ ] Page transitions smooth on slow devices
- [ ] GPU acceleration working (check layers)
- [ ] No layout thrashing
- [ ] Lighthouse performance score maintained

**Accessibility Testing:**

- [ ] prefers-reduced-motion respected
- [ ] Focus states visible and clear
- [ ] Keyboard navigation smooth
- [ ] Screen reader friendly
- [ ] ARIA labels on loading states

**Professional Polish:**

- [ ] Every transition feels intentional
- [ ] Timing consistent with design system
- [ ] Apple-quality feel throughout
- [ ] No jarring or abrupt changes
- [ ] Premium, considered experience
- [ ] Brand perception: professional, high-quality

---

## PART 4: BEFORE/AFTER DOCUMENTATION

### Before State

**Page Transitions:**
- Before: Instant, jarring page replacement
- After: Smooth 300ms cross-fade, Apple-quality

**Loading States:**
- Before: Images pop in, layout shifts, FOUC
- After: Blur placeholders, skeletons, smooth reveal

**Timing Consistency:**
- Before: 15 different durations, random easing
- After: Defined scale (150/250/300/500ms), Apple easing

**Async Feedback:**
- Before: No loading states, user confusion
- After: Immediate feedback, loading states, success indicators

**Micro-interactions:**
- Before: Static, lifeless interface
- After: Responsive, alive, premium feel

### Test Results Summary

**Transition Quality:**
✅ Page transitions smooth and graceful
✅ No flash or jarring changes
✅ Apple-quality timing and easing
✅ Consistent throughout site

**Loading Experience:**
✅ No FOUC anywhere
✅ Blur placeholders prevent pop-in
✅ Skeletons provide feedback
✅ Progressive reveal feels smooth

**Interactive Feel:**
✅ All buttons responsive to interaction
✅ Hover states subtle and professional
✅ Touch feedback on mobile
✅ Premium, polished experience

**Performance:**
✅ All animations 60fps
✅ GPU-accelerated transforms
✅ No performance regression
✅ Lighthouse score maintained

---

## PART 5: MAINTENANCE & PREVENTION

### Code Quality

**Maintainability:**
- Unified animation system in Tailwind config
- Reusable transition components
- Clear documentation of timing scale
- Consistent patterns throughout

**Performance Impact:**
- Positive: GPU-accelerated animations
- Neutral: Minimal JavaScript overhead
- Optimized: CSS transitions preferred over JS
- Overall: Professional quality at high performance

**Browser Compatibility:**
- CSS transitions: Universal support
- backdrop-filter: 95%+ support (fallback provided)
- prefers-reduced-motion: 92%+ support
- Overall: Excellent compatibility

### What NOT to Change

1. **Animation timing scale** - Defined values create consistency
2. **Apple easing curves** - Carefully calibrated for premium feel
3. **template.tsx structure** - Required for page transitions
4. **GPU acceleration properties** - Critical for performance
5. **prefers-reduced-motion** - Accessibility requirement
6. **Button micro-interactions** - Standardized across site

### Safe Future Modifications

- Individual component animations (within timing scale)
- Loading skeleton designs
- Success/error feedback styling
- Transition component variants
- Color schemes (maintain timing/easing)

### Design System Usage

**For New Components:**
```typescript
// Use defined timing scale
className="transition-all duration-micro ease-apple"    // Small changes
className="transition-all duration-standard ease-apple" // Components
className="transition-all duration-page ease-apple"     // Major transitions

// Use hover patterns
hover:scale-[1.02]  // Subtle lift
active:scale-[0.98] // Press feedback

// Use loading patterns
<Skeleton /> while data loading
<Image placeholder="blur" /> for images
```

### Prevention Strategy

**For All New Features:**
- Never use instant state changes
- Always add loading states for async
- Use design system timing values
- Add micro-interactions to interactive elements
- Test on actual iOS devices
- Verify 60fps performance
- Respect prefers-reduced-motion

---

## FINAL QUALITY CONFIRMATION

I have verified that these solutions:

- ✅ Provide Apple-quality page transitions
- ✅ Eliminate all FOUC and layout shift
- ✅ Implement consistent timing system
- ✅ Add micro-interactions throughout
- ✅ Provide feedback for all async operations
- ✅ Respect user accessibility preferences
- ✅ Maintain 60fps performance
- ✅ Feel premium and professional
- ✅ Are maintainable and scalable
- ✅ Are thoroughly documented

**Professional Standard Confirmation:**

The site now provides an Apple-level transition and animation experience. Every page change, content load, and user interaction feels smooth, intentional, and premium. The unified animation system ensures consistency. Micro-interactions make the interface feel alive and responsive. Loading states provide clear feedback. The entire experience communicates craft, attention to detail, and professional quality—exactly what Apple is known for.

---

## Success Criteria

Solutions are successful when:

✅ Page transitions smooth and graceful (no jarring changes)
✅ No flash of unstyled content anywhere
✅ Consistent timing following defined scale
✅ All async operations provide clear feedback
✅ Micro-interactions throughout interface
✅ Orientation changes smooth
✅ Maintains 60fps performance
✅ Respects prefers-reduced-motion
✅ Feels Apple-quality professional
✅ Complete documentation for maintenance
