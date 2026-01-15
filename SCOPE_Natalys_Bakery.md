# Project Scope - Nataly's Home Bakery

**Project:** Nataly's Home Bakery Website
**Version:** 1.0
**Updated:** January 14, 2026
**Archive Count:** 1
**Archive Location:** archives/SCOPE_Natalys_Bakery_20260114_185846.md
**Line Count:** [Auto-calculated]
**Handoff Support:** Enabled (v2.3.1)

---

## ✅ IN SCOPE (Building Now)

### Core Features

1. **Landing Page** - Animated photo slideshow with dynamic transitions, hero section, call-to-action
2. **Navigation System** - Fixed/sticky nav bar, mobile-responsive hamburger menu (Home, About, Menu, Gallery, Contact)
3. **Menu & Ordering System** - Product catalog (Flan, Choco-flan, Chocolate Cake, Cinnamon Rolls, Conchas), add-to-cart, shopping cart, checkout with **50% deposit payment**
4. **Payment Integration** - Stripe (recommended), 50% deposit online, remaining 50% offline
5. **Email Notification System** - Customer confirmation email + vendor notification email with order details
6. **Contact Form** - Required fields (name, phone, email, subject, message), email delivery
7. **About Page** - Professional photo, personal story/bio, brand values
8. **Gallery** - Masonry/collage layout, lightbox view, lazy loading

### Design Requirements
- **Visual Style:** Modern minimalist with rustic warmth
- **Color Palette:** Warm neutrals, earth tones, clean whites
- **Typography:** Clean readable fonts with rustic accent
- **Spacing:** 70% whitespace principle
- **Animations:** Subtle, purposeful, performance-optimized

### Technical Requirements
- Responsive design (mobile, tablet, desktop)
- Fast load times (<3s initial, <1s navigation)
- SEO optimization
- Accessibility (WCAG 2.1 AA)
- Secure payment processing (PCI compliant)
- Email deliverability
- Database for order persistence
- Form validation (client + server side)

---

## ❌ OUT OF SCOPE (Not Building)

- Inventory Management System, Customer Accounts/Login, Order Tracking Portal, Admin Dashboard
- Blog/Recipe Section, Social Media Integration, Delivery Scheduling System
- Customer Reviews/Ratings, Multi-language Support, Subscription/Recurring Orders
- Gift Cards, Loyalty/Rewards Program, Live Chat Support, Analytics Dashboard

*(Full details in archived version)*

---

## 🎯 Technical Boundaries

### Stack
- **Framework:** Next.js 14+ (React 18+), TypeScript, Tailwind CSS
- **Payment:** Stripe (Checkout or Elements)
- **Email:** Resend (or SendGrid/Mailgun), React Email
- **Database:** Vercel Postgres (or Supabase), Prisma ORM
- **Storage:** Vercel Blob (or Cloudinary)
- **Hosting:** Vercel
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion

### Constraints
- Mobile-first responsive design
- Performance budget: <100KB initial JS
- Image optimization (WebP, lazy loading)
- Accessibility: keyboard navigation, screen readers
- Security: HTTPS only, environment variables for secrets
- Email deliverability: SPF/DKIM configuration

### Excluded Technologies
- WordPress/CMS, jQuery, Bootstrap, MongoDB, Firebase

---

## ⚠️ Critical Constraints

1. **Payment:** Must collect 50% deposit, clearly communicate remaining balance
2. **Email:** Must be reliable, deliverable, and professional
3. **Mobile:** Must work flawlessly on mobile (primary traffic expected)
4. **Performance:** Must load fast (bakery customers won't wait)
5. **Design:** Must balance rustic warmth with modern professionalism
6. **Simplicity:** Must be easy for Nataly to understand order notifications

---

**Note:** Full scope details including User Flows, Data Models, Quality Standards, Launch Requirements, Design Specifications, and Content Requirements are available in the archived version: `archives/SCOPE_Natalys_Bakery_20260114_185846.md`

---

**Scope Locked:** ❌ No - Initial draft, refinements expected

**AI Instructions:**
- Check IN SCOPE before implementing features
- Archive completed features at 200 lines
- Never add features without explicit approval
- Suggest /confer after 3 failed implementation attempts
- Maintain modern minimalist + rustic design throughout
- Prioritize mobile-first responsive design
- Ensure 50% deposit calculation is always accurate
