# Project Setup Guide

**Status:** ✅ Setup Complete (January 15, 2026)

## ✅ Completed Setup

All environment variables have been configured:
- ✅ Database (Supabase)
- ✅ Stripe API keys and webhook
- ✅ Gmail email service (Nodemailer)
- ✅ Email addresses (caramelcakeJo@gmail.com)
- ✅ Prisma client generated

## 📋 Environment Variables Reference

Your `.env.local` file should contain:

```env
# Database (Supabase)
# For Render: Add ?pgbouncer=true&connection_limit=1 to prevent memory leaks
DATABASE_URL="postgresql://..."
# Direct connection for migrations (required for Prisma). Use port 5432 for Supabase.
DIRECT_URL="postgresql://..."

# Stripe Payment Configuration
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email Configuration (Gmail via Nodemailer)
# IMPORTANT: Use a Gmail App Password, not your regular Gmail password
# To create an App Password: https://myaccount.google.com/apppasswords
GMAIL_USER="caramelcakejo@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"  # 16-character App Password (spaces optional)
EMAIL_FROM="caramelcakejo@gmail.com"
EMAIL_TO="caramelcakejo@gmail.com"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Admin (for order management and delivery confirmation)
ADMIN_PASSWORD="your-secure-admin-password"
```

## 🚀 Quick Start

### Initialize Database

Push the Prisma schema to your database:

```bash
npm run db:push
```

### Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🔍 Verification

After setup, verify everything works:

1. ✅ Database connection - Check that `npm run db:push` succeeds
2. ✅ Prisma client - Should be generated in `node_modules/@prisma/client`
3. ✅ Environment variables - All required vars should be set
4. ✅ Development server - Should start without errors
5. ✅ Stripe webhook - Test with Stripe CLI (local) or dashboard (production)

## 🖼️ Adding New Images

When you add new photos to `public/Images/`, run the optimizer so the site stays fast and doesn’t hit memory limits:

```bash
npm run optimize-images
```

This resizes and compresses images; the build can also run it. See `PHOTO-PERFORMANCE-INVESTIGATION-REPORT.md` for the full image strategy.

## 📚 Project Documentation

- **Payment Implementation:** See `PAYMENT_IMPLEMENTATION_PLAN.md`
- **Project Scope:** See `SCOPE_Natalys_Bakery.md`
- **Design Plan:** See `DESIGN_PLAN.md`

## 📝 Next Steps

1. Push database schema: `npm run db:push`
2. Start development: `npm run dev`
3. Build frontend components (see payment implementation plan)

## 🆘 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` format is correct
- Ensure database exists

### Prisma Issues
- Run `npm run db:generate` after schema changes
- Run `npm run db:push` to sync schema to database

### Stripe Webhook Issues
- Verify webhook secret matches
- Check webhook endpoint URL is correct
- Use Stripe CLI for local testing

### Confirmation emails not received (customer or vendor)
Confirmation emails are sent **only when Stripe calls the webhook** after a successful payment (`payment_intent.succeeded`). They are not sent from the checkout page itself.

- **Local development:** Stripe cannot reach `localhost`. You must forward webhooks with the Stripe CLI:
  1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli).
  2. Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
  3. Copy the **webhook signing secret** (e.g. `whsec_...`) and set `STRIPE_WEBHOOK_SECRET` in `.env.local` to that value (not the Dashboard secret).
  4. Keep the CLI running while testing checkout; when you pay, the CLI forwards the event and the app sends the emails.
- **Production (e.g. Render):** Ensure `GMAIL_APP_PASSWORD`, `GMAIL_USER`, `EMAIL_FROM`, and `EMAIL_TO` are set in the host’s environment. If any are missing, the server log will show: `Cannot send confirmation emails: GMAIL_APP_PASSWORD is not set`.

### Email Issues
- Verify Gmail App Password is correct (not your regular password!)
- Enable 2-Step Verification on Gmail account first (required for App Passwords)
- Create App Password: https://myaccount.google.com/apppasswords
- Check Gmail daily sending limits (~500/day for personal accounts)
