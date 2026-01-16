# Payment Implementation Plan - Caramel & Jo

**Created:** January 15, 2026  
**Status:** Backend Complete, Frontend Pending  
**Payment Provider:** Stripe

---

## 🎯 Payment Flow Overview

### User Experience
1. **Browse Menu** → User views products and adds items to cart
2. **Review Cart** → User sees cart summary, can modify quantities
3. **Checkout** → User stays on Caramel & Jo website (no redirect)
4. **Enter Details** → User fills customer info and payment details
5. **Process Payment** → Stripe handles transaction securely (embedded payment form)
6. **Confirmation** → User sees order confirmation and receives email

### Key Principle
**Users never leave the Caramel & Jo website** - all payment processing happens via embedded Stripe Elements on our site.

---

## ✅ Backend Implementation (Complete)

### API Endpoint: `/api/checkout`

**Location:** `src/app/api/checkout/route.ts`

**What it does:**
1. Validates checkout data (customer info, items, quantities)
2. Calculates totals:
   - Total order amount (100%)
   - Deposit amount (50% of total)
   - Remaining amount (50% of total)
3. Creates order in database with status `PENDING`
4. Creates Stripe PaymentIntent for 50% deposit only
5. Returns `clientSecret` for frontend payment form

**Response:**
```json
{
  "success": true,
  "orderId": "order_123",
  "orderNumber": "CJ-2026-001",
  "clientSecret": "pi_xxx_secret_xxx",
  "depositAmount": 25.00,
  "remainingAmount": 25.00,
  "totalAmount": 50.00
}
```

### Webhook Handler: `/api/webhooks/stripe`

**Location:** `src/app/api/webhooks/stripe/route.ts`

**What it does:**
1. Receives Stripe webhook events
2. On `payment_intent.succeeded`:
   - Updates order status to `CONFIRMED`
   - Marks deposit as paid
   - Sends confirmation emails (customer + vendor)
3. On `payment_intent.payment_failed`:
   - Updates order status to `CANCELLED`

---

## 🚧 Frontend Implementation (To Be Built)

### Required Components

#### 1. Shopping Cart Component
**Purpose:** Manage cart items, quantities, totals

**Features:**
- Add/remove items
- Update quantities
- Calculate subtotals
- Display cart total
- Show deposit amount (50%)
- Show remaining balance (50%)

**Location:** `src/components/Cart.tsx` (to be created)

#### 2. Checkout Page
**Purpose:** Complete order and payment

**Route:** `/checkout` (to be created)

**Features:**
- Customer information form (name, email, phone)
- Order summary (items, quantities, prices)
- Payment breakdown:
  - Total: $X.XX
  - Deposit (50%): $X.XX ← **This is what they pay now**
  - Remaining (50%): $X.XX ← **Due at pickup**
- Stripe Elements payment form
- Submit button

**Location:** `src/app/checkout/page.tsx` (to be created)

#### 3. Stripe Payment Integration
**Purpose:** Process payment securely without leaving site

**Implementation:**
- Use `@stripe/stripe-js` (already installed)
- Use Stripe Elements for payment form
- Use `clientSecret` from checkout API
- Handle payment confirmation
- Redirect to success page

**Code Pattern:**
```typescript
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// In checkout component:
<Elements stripe={stripePromise} options={{ clientSecret }}>
  <PaymentElement />
  <button onClick={handleSubmit}>Pay Deposit</button>
</Elements>
```

**Location:** `src/components/CheckoutForm.tsx` (to be created)

#### 4. Order Confirmation Page
**Purpose:** Show order success and details

**Route:** `/checkout/success?orderId=xxx` (to be created)

**Features:**
- Order number
- Order summary
- Deposit paid confirmation
- Remaining balance reminder
- Email confirmation notice

**Location:** `src/app/checkout/success/page.tsx` (to be created)

---

## 💳 Payment Details

### Deposit Structure
- **50% deposit** collected online via Stripe
- **50% remaining** paid at pickup (cash/card)
- Clearly communicated to customer at checkout

### Payment Flow Diagram
```
User clicks "Checkout"
    ↓
Checkout Page loads
    ↓
User enters customer info
    ↓
Stripe Elements form loads (embedded)
    ↓
User enters card details
    ↓
User clicks "Pay Deposit"
    ↓
Stripe processes payment (50% deposit)
    ↓
Webhook receives confirmation
    ↓
Order status → CONFIRMED
    ↓
Emails sent (customer + vendor)
    ↓
User redirected to success page
```

---

## 🔧 Technical Stack

### Installed Packages
- `stripe` - Server-side Stripe SDK
- `@stripe/stripe-js` - Client-side Stripe SDK
- `@stripe/react-stripe-js` - React components for Stripe Elements (may need to install)

### Environment Variables (All Set)
- `STRIPE_SECRET_KEY` - Server-side API key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side public key
- `STRIPE_WEBHOOK_SECRET` - Webhook signature verification

### Database Schema
- `Order` model - Stores order details, payment status
- `OrderItem` model - Stores individual items in order
- Payment tracking: `depositPaid`, `depositPaidAt`, `stripePaymentId`

---

## 📋 Implementation Checklist

### Backend ✅
- [x] Checkout API endpoint
- [x] Webhook handler
- [x] Order creation in database
- [x] Payment intent creation
- [x] Email notifications
- [x] 50% deposit calculation

### Frontend 🚧
- [ ] Shopping cart component
- [ ] Cart state management (Context/State)
- [ ] Checkout page route
- [ ] Customer information form
- [ ] Stripe Elements integration
- [ ] Payment form component
- [ ] Payment processing logic
- [ ] Success/confirmation page
- [ ] Error handling
- [ ] Loading states
- [ ] Mobile responsiveness

---

## 🎨 UI/UX Considerations

### Checkout Page Design
- Clean, minimal design matching site aesthetic
- Clear payment breakdown (total, deposit, remaining)
- Prominent display of "50% deposit" information
- Secure payment badge/indicator
- Mobile-optimized payment form

### Payment Form
- Stripe Elements handles styling (customizable)
- Match site color scheme
- Clear "Pay Deposit" button
- Loading state during processing
- Error messages for failed payments

---

## 🔒 Security Notes

- Payment processing handled by Stripe (PCI compliant)
- Never store card details
- All sensitive operations server-side
- Webhook signature verification required
- HTTPS required for production

---

## 🧪 Testing Checklist

### Local Development
- [ ] Test with Stripe test cards
- [ ] Verify webhook forwarding (Stripe CLI)
- [ ] Test successful payment flow
- [ ] Test failed payment flow
- [ ] Verify email notifications
- [ ] Check database order creation

### Test Cards (Stripe)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires 3D Secure: `4000 0025 0000 3155`

---

## 📝 Next Steps

1. **Build Shopping Cart Component**
   - Add to cart functionality
   - Cart state management
   - Cart UI component

2. **Build Checkout Page**
   - Customer form
   - Order summary
   - Stripe Elements integration

3. **Build Payment Processing**
   - Handle payment submission
   - Process with Stripe
   - Handle success/error states

4. **Build Confirmation Page**
   - Display order details
   - Show payment confirmation

5. **Test End-to-End**
   - Full payment flow
   - Email delivery
   - Database persistence

---

## 📚 Reference Links

- [Stripe Elements Documentation](https://stripe.com/docs/stripe-js/react)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Test Cards](https://stripe.com/docs/testing)

---

**Last Updated:** January 15, 2026
