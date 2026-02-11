# Stripe Live (Production) Setup

Use this guide to switch from Stripe **test** keys to **live** keys so you can accept real payments and verify confirmation emails.

---

## 1. Get your live API keys

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com).
2. **Turn on Live mode** using the toggle in the top-right (it usually says "Test mode" — switch it to **Live**).
3. Go to **Developers → API keys**.
4. Copy:
   - **Publishable key** (starts with `pk_live_...`) → use for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (starts with `sk_live_...`) → use for `STRIPE_SECRET_KEY`  
     Click "Reveal live key" if needed.

**Important:** Never commit live secret keys to git. Set them only in `.env`, `.env.local`, or your host’s environment (e.g. Render).

---

## 2. Create a live webhook (required for confirmation emails)

Your app sends **confirmation emails** when Stripe calls your webhook with `payment_intent.succeeded`. For live payments you need a **live** webhook and its signing secret.

1. In Stripe Dashboard, stay in **Live** mode.
2. Go to **Developers → Webhooks**.
3. Click **Add endpoint**.
4. **Endpoint URL:** your production base URL + `/api/webhooks/stripe`  
   Example: `https://your-app.onrender.com/api/webhooks/stripe`
5. Click **Select events** and add:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Click **Add endpoint**.
7. On the new endpoint’s page, click **Reveal** under "Signing secret" and copy the value (starts with `whsec_...`).  
   This is your **live** `STRIPE_WEBHOOK_SECRET` — it is different from your test webhook secret.

---

## 3. Set environment variables (production)

Set these in your **production** environment (e.g. Render dashboard → Environment):

| Variable | Value | Notes |
|----------|--------|--------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Live secret key from API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Signing secret from the **live** webhook you just created |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Live publishable key from API keys |
| `NEXT_PUBLIC_APP_URL` | `https://your-production-domain.com` | Must be your real site URL for redirects/emails |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` / `EMAIL_FROM` / `EMAIL_TO` | (unchanged) | Required for confirmation and notification emails |

After changing env vars, **redeploy** so the new values are used.

---

## 4. Test live payments and confirmation emails

1. Deploy with the live keys and live webhook secret.
2. Place a **small real order** (e.g. minimum amount) and complete payment with a real card.
3. Check:
   - Stripe Dashboard → **Live** → **Payments**: the payment appears and is succeeded.
   - Your inbox: customer **order confirmation** email.
   - Vendor inbox (EMAIL_TO): **order notification** email.
4. If emails don’t arrive:
   - Check Render (or your host) logs for errors from the webhook (e.g. "Missing STRIPE_WEBHOOK_SECRET", "Invalid signature", or email errors).
   - In Stripe → **Developers → Webhooks**, open your live endpoint and check **Recent deliveries** for failed requests and error responses.

---

## 5. Quick reference: test vs live

| Item | Test (development) | Live (production) |
|------|--------------------|-------------------|
| Stripe Dashboard mode | Test mode | Live mode |
| Publishable key | `pk_test_...` | `pk_live_...` |
| Secret key | `sk_test_...` | `sk_live_...` |
| Webhook secret | From a webhook created in **Test** mode (or Stripe CLI) | From a webhook created in **Live** mode |
| Webhook URL | `http://localhost:3000/api/webhooks/stripe` (or ngrok) | `https://your-domain.com/api/webhooks/stripe` |

Your code does not need to change: it only reads these environment variables. Switching to live is done by using live keys and the live webhook secret in production.
