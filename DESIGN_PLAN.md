# Design Plan - Caramel & Jo Bakery Website

**Created:** January 15, 2026  
**Status:** In Progress  
**Reference Image:** Images/IMG_8073.png

---

## 🎨 Design Direction

Redesign the frontend to match a clean, minimalist aesthetic with pastel colors, inspired by the example image (IMG_8073.png).

---

## 🔄 Design Changes

### 1. Navigation System

**Current State:**
- Fixed/sticky navigation bar with background
- Visible bar at top of page
- Hamburger menu for mobile

**New Design:**
- **Remove visible navigation bar entirely**
- Add discrete, minimal nav links (small text) in top-right corner
- Include navigation links: Home, About, Menu, Gallery, Contact
- Add "SHOP NOW" button next to nav links (small, outlined style)
- No background bar or heavy styling
- Links should be subtle, elegant text

---

### 2. Hero Section

**Current State:**
- "Caramel & Jo" in navigation bar (medium size)
- Background image with dark overlay
- Hero text centered

**New Design:**
- **"Caramel & Jo" as massive, prominent brand name**
  - Very large serif font (similar to "Bakery" in example)
  - White color
  - Positioned on left side of hero
  - Should be the visual focal point
- **Keep background image (IMG_7626.jpeg)**
  - Remove or significantly lighten dark overlay
  - Ensure image is clearly visible and prominent
  - Image should be the main visual element
- Keep CTA buttons below brand name
  - Adjust styling to match new aesthetic

---

### 3. Product Grid Section

**New Feature - Add Below Hero:**

**Product Catalog Grid:**
- Create product cards in a grid layout (2-3 columns responsive)
- Products to include:
  1. Flan
  2. Choco-flan
  3. Chocolate Cake
  4. Cinnamon Rolls
  5. Conchas
- Each product card should have:
  - Placeholder image (for now, can use existing images or placeholders)
  - Product name overlaid on image (light, slightly transparent text)
  - "SHOP NOW" or "ADD TO CART" button at bottom
  - Rounded corners
  - Subtle background colors (pastel tones)
- Section title: "ABOUT US" or similar separator above grid

---

### 4. Overall Styling Changes

**Color Palette:**
- Shift to softer, cleaner pastel colors
- Light pinks, creams, whites
- Reduce heavy earth tones
- More whitespace and lightness

**Visual Style:**
- **Clean and minimalist**
- Reduce heavy overlays and backgrounds
- Ensure background images are clearly visible
- More whitespace between sections
- Subtle, elegant typography
- Soft shadows and borders

**Typography:**
- Large serif font for "Caramel & Jo" brand name
- Clean sans-serif for navigation links
- Maintain readability but with lighter weight

---

## 📝 Implementation Notes

### Files to Modify:
1. `src/components/Navigation.tsx` - Remove nav bar, create discrete links
2. `src/components/Hero.tsx` - Update brand name styling, lighten overlay
3. `src/app/page.tsx` - Add product grid section
4. `tailwind.config.ts` - May need to add pastel color variants

### New Components to Create:
1. Product card component
2. Product grid component

### Images Needed:
- Product placeholder images for grid (can use existing Images/ folder images)

---

## ✅ Acceptance Criteria

- [ ] Navigation bar completely removed
- [ ] Discrete nav links in top-right corner
- [ ] "Caramel & Jo" appears as massive, prominent brand name (left side)
- [ ] Background image (IMG_7626.jpeg) is clearly visible with minimal/no overlay
- [ ] Product grid added below hero section
- [ ] All 5 products have cards with placeholder images
- [ ] Overall aesthetic matches clean, minimalist, pastel look
- [ ] Design is mobile-responsive

---

## 🎯 Design Reference

**Inspiration:** Images/IMG_8073.png

**Key Visual Elements from Reference:**
- No visible navigation bar
- Large brand name on left ("Bakery" style)
- Soft pastel pink/cream color scheme
- Product grid with cards
- Clean, minimalist aesthetic
- Prominent background/product imagery

---

**Last Updated:** January 15, 2026
