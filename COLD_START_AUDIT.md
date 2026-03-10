# Cold Start Audit Report — NatalyBakery (Next.js on Render)

**Date:** March 10, 2025  
**Target:** Reduce cold start from ~10 minutes to under 30 seconds  
**Stack:** Next.js 16, Prisma 5, Supabase (Postgres), Stripe, Render free/starter tier

---

## 1. RENDER DEPLOYMENT CONFIGURATION

### Findings

| Item | Status | Details |
|------|--------|---------|
| **render.yaml** | ❌ **Missing** | No `render.yaml` or Blueprint in repo. Config is likely in Render Dashboard only. |
| **Service type** | Assumed Web Service | Required for Next.js with API routes and SSR |
| **Instance type** | Unknown (free tier) | Free tier sleeps after 15 min inactivity; limited CPU/RAM |
| **Build command** | `prisma generate && npm run optimize-images && next build` | From package.json |
| **Start command** | `next start` | Standard |
| **Health check path** | ❌ **Not configured** | No `/api/health` route exists; no `healthCheckPath` in config |
| **Health check timeout** | 5 seconds (Render default) | Render fails health check if response > 5 sec |
| **Auto-deploy** | Unknown | Likely enabled from Git |
| **NODE_ENV** | Unknown in prod | .env.example shows `NODE_ENV="development"` |

### Critical: Health Check Gap

**Render requires a health check endpoint for zero-downtime deploys.** Without one:

- Render may use the root path (`/`) or have undefined behavior
- If `/` is used for health checks, the full Next.js app loads (fonts, layout, React hydration)
- The 5-second timeout can be exceeded if the app is slow to boot
- **After 60 consecutive seconds of failed health checks, Render restarts the service**
- This restart loop can cause the observed ~10-minute behavior: start → health check fails → restart → repeat

**Action:** Create a dedicated `/api/health` route and configure `healthCheckPath: /api/health` in Render.

---

## 2. PACKAGE.JSON — START SCRIPT & DEPENDENCIES

### Scripts

| Script | Command |
|--------|---------|
| **start** | `next start` |
| **build** | `prisma generate && npm run optimize-images && next build` |
| **dev** | `npm run optimize-images && next dev` |

### Dependencies

| Type | Count |
|------|-------|
| **dependencies** | 18 |
| **devDependencies** | 10 |

### Notable Packages

| Package | Location | Cold Start Impact |
|---------|-----------|-------------------|
| **sharp** | devDependencies | Used only in build (optimize-images script). Not loaded at runtime. |
| **prisma** | devDependencies | `prisma generate` runs at build time. Client is pre-generated. |
| **@prisma/client** | dependencies | Loaded when first API route imports `@/lib/prisma`. Lazy connect on first query. |
| **plaiceholder** | dependencies | Build-time only (optimize-images). Not used at runtime. |
| **stripe** | dependencies | Lazy init in checkout/webhook routes via `getStripe()`. |
| **nodemailer** | dependencies | Loaded when email lib is used. No top-level init. |

### Node Version

- **No `.nvmrc`** found
- **No `engines` field** in package.json
- Render recommends Node 20.x or 22.x for Next.js 16

**Action:** Add `engines: { "node": ">=20" }` or `.nvmrc` with `20` for consistent builds.

---

## 3. PRISMA CLIENT INITIALIZATION

### File: `src/lib/prisma.ts`

| Aspect | Implementation |
|--------|----------------|
| **Pattern** | Singleton via `globalThis` |
| **Instantiation** | Top-level (module load time) |
| **Connection** | Lazy (first query connects) |
| **Logging** | `['error']` in production; `['query','error','warn']` in dev |
| **Shutdown** | `beforeExit` handler calls `$disconnect()` in production |

### Usage

All 7 API routes import `prisma` from `@/lib/prisma`:

- `src/app/api/admin/orders/route.ts`
- `src/app/api/admin/orders/[id]/route.ts`
- `src/app/api/admin/orders/[id]/confirm/route.ts`
- `src/app/api/checkout/route.ts`
- `src/app/api/orders/place/route.ts`
- `src/app/api/contact/route.ts`
- `src/app/api/webhooks/stripe/route.ts`

`src/lib/email.ts` imports `Order` and `OrderItem` types from `@prisma/client` only (no PrismaClient).

### Database URL Configuration

- **.env.example** shows: `postgresql://user:password@host.supabase.co:5432/postgres`
- **Comment:** "Add ?connection_limit=1 to prevent pool exhaustion"
- **SETUP.md:** "Add ?pgbouncer=true&connection_limit=1 to prevent memory leaks"

**Current .env.example URL has no connection params.** If production `DATABASE_URL` lacks `connection_limit=1`:

- Supabase pooler can exhaust connections
- Free tier has limited connections; multiple Prisma clients can cause timeouts

**Action:** Ensure `DATABASE_URL` includes `?connection_limit=1` (and `?pgbouncer=true` if using port 6543 pooler).

### Prisma Client Generation

- `prisma generate` runs at build time. Client is **not** generated on cold start.
- ✅ No runtime Prisma generation.

---

## 4. NEXT.JS CONFIGURATION

### File: `next.config.js`

| Setting | Value | Notes |
|---------|-------|-------|
| **output** | `standalone` not set | Default output |
| **turbopack** | `root` set | Dev-only; does not affect production build |
| **images.unoptimized** | `false` | Image optimization enabled (requires server) |
| **images** | AVIF/WebP, multiple sizes | Adds server work on first image request |
| **serverExternalPackages** | `['@prisma/client']` | Correct for Prisma |
| **compress** | `true` | Gzip |
| **poweredByHeader** | `false` | Minor |

### Middleware

- **File:** `src/middleware.ts`
- **Matcher:** `/api/:path*` only
- **Logic:** `return NextResponse.next()` — no DB or external calls
- **Runtime:** Edge (default)

### Build Output Size

- **.next folder:** ~555 MB
- **Standalone output:** Not used (no `output: 'standalone'`)

**555 MB is large** for a free-tier instance. Standalone output would reduce this.

---

## 5. SERVER-SIDE INITIALIZATION CODE

### Top-Level `await` / Side Effects

- **None found** in `/lib`, `/utils`, `/api`, or server components.

### Database Seeding / Migrations on Startup

- **None.** No `prisma migrate` or seed in start script.

### External API Calls at Module Load

- **None.** Stripe is lazy via `getStripe()` in checkout and webhook routes.

### Module Load Chain

- **Prisma:** `src/lib/prisma.ts` creates `PrismaClient` at import. Constructor is cheap; no DB connect until first query.
- **Email:** `createTransporter()` is called inside `sendOrderConfirmationEmail` etc., not at module load.
- **Admin auth:** `getSecret()` is called on demand; no top-level init.

### Layout (`src/app/layout.tsx`)

- Uses `next/font` (Inter, Roboto, Playfair_Display) — fonts are embedded at build time.
- No Prisma or data fetching in layout.
- No blocking server-side init.

---

## 6. MIDDLEWARE

### File: `src/middleware.ts`

```ts
export function middleware(request: NextRequest) {
  return NextResponse.next()
}
export const config = { matcher: '/api/:path*' }
```

- **Logic:** Pass-through only.
- **DB/API calls:** None.
- **Matcher:** Only `/api/*` routes.
- **Impact:** Minimal; no cold start contribution.

---

## 7. API ROUTES — COLD PATH ANALYSIS

### Route Handlers

| Route | Prisma Import | Stripe Init | Pattern |
|-------|---------------|-------------|---------|
| `/api/orders/place` | Top-level | N/A | Single DB create; `Promise.all` for emails |
| `/api/checkout` | Top-level | Lazy `getStripe()` | DB create → Stripe → DB update |
| `/api/webhooks/stripe` | Top-level | Lazy `getStripe()` | DB queries in handler |
| `/api/admin/orders` | Top-level | N/A | `findMany` |
| `/api/admin/orders/[id]` | Top-level | N/A | `findUnique` |
| `/api/admin/orders/[id]/confirm` | Top-level | N/A | `update` |
| `/api/contact` | Top-level | N/A | `create` + email |
| `/api/admin/login` | No Prisma | N/A | Password check only |

### Observations

- **Prisma:** Imported at top level in all routes that use DB. First import triggers `prisma.ts` load and `PrismaClient` creation.
- **Stripe:** Lazy init in checkout and webhook routes. No startup cost.
- **Sequential vs parallel:** `orders/place` uses `Promise.all` for emails. No obvious N+1 bottlenecks.

### Health check endpoint

- **No `/api/health` route** exists.
- Render health checks (if configured) have no dedicated endpoint.

---

## 8. ENVIRONMENT & SECRETS LOADING

- **No** `zod-env`, `@t3-oss/env-nextjs`, or similar.
- **No** startup validation of env vars.
- **Checkout route** does manual checks for `DATABASE_URL` and `STRIPE_SECRET_KEY` inside the handler.
- No env validation that could block startup or slow boot.

---

## 9. BUILD OUTPUT SIZE

### Commands Run

```powershell
# .next folder size
(Get-ChildItem -Path .next -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
# Result: ~555 MB

# Standalone output
Test-Path .next\standalone
# Result: False (no standalone output)
```

### Build Manifest

- **build-manifest.json** exists but is minimal (App Router).
- **Pages:** Build manifest shows `/_app` entry; App Router uses different structure.

### Summary

| Metric | Value |
|--------|-------|
|  **.next size** | ~555 MB |
| **Standalone** | Not used |
| **Output mode** | Default (full) |

---

## 10. SUMMARY OUTPUT

### Likely Root Causes (Ranked by Probability)

1. **Health check failure / restart loop** — No dedicated `/api/health` route. Render may use `/` or fail health checks. If the app takes >5s to respond or fails, Render restarts after 60s. Multiple restarts can cause 10+ minutes of apparent downtime.
2. **Large .next bundle (555 MB)** — Free tier has limited RAM and disk. Loading 555 MB on cold start can be slow and cause timeouts.
3. **Database connection timeout** — If `DATABASE_URL` lacks `connection_limit=1` and pooler params, Supabase pooler can exhaust connections or slow cold connections. First request that needs DB may hang.
4. **Root path as health check** — If Render uses `/` for health checks, it loads the full Next.js app (fonts, layout, React). That can exceed the 5s timeout on a cold instance.

### Configuration Issues Found

| Issue | File |
|-------|------|
| No `render.yaml` | Repo root |
| No health check path | Render config |
| No `/api/health` route | `src/app/api/` |
| No `connection_limit` in example .env | `.env.example` |
| No Node version specified | `package.json` |
| No `output: 'standalone'` | `next.config.js` |

### Code Patterns Contributing to Slow Start

| Pattern | File |
|---------|------|
| Prisma imported at top level in all API routes | All API routes |
| `optimize-images` runs on every build (sharp + plaiceholder) | `package.json` build script |
| `serverExternalPackages: ['@prisma/client']` | `next.config.js` (correct, but increases bundle) |

### Quick Wins (Can Fix Today)

1. **Add `/api/health` route** — Create `src/app/api/health/route.ts` that returns `200` quickly. Optionally add a minimal DB ping.
2. **Configure Render health check** — In Render Dashboard: Health Check Path = `/api/health`.
3. **Add `connection_limit=1` to DATABASE_URL** — In Render env vars: `DATABASE_URL?connection_limit=1` (and `pgbouncer=true` if using port 6543).
4. **Add Node version** — Add `engines: { "node": ">=20" }` to `package.json` or `.nvmrc` with `20` or `22`.

### Deeper Fixes (Architectural)

1. **Enable `output: 'standalone'`** — Reduce deployment size and startup time. Update `next.config.js` and Render start command accordingly.
2. **Move `optimize-images` out of build** — Run it only when images change (e.g. CI step) or pre-commit. Avoids sharp/plaiceholder on every deploy.
3. **Upgrade Render plan** — If possible, paid tier avoids sleep and provides more resources.

---

## Recommended Next Steps

1. Create `/api/health` route (see below).
2. Set `healthCheckPath: /api/health` in Render (or via Dashboard).
3. Verify `DATABASE_URL` in Render includes `?connection_limit=1`.
4. Add Node version to `package.json` or `.nvmrc`.
5. Consider `output: 'standalone'` for smaller deployments.
6. Use UptimeRobot or similar to ping `/api/health` every 5–10 minutes to reduce cold starts (if staying on free tier).

---

## Appendix: Suggested `/api/health` Implementation

```ts
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // Option A: Minimal (fastest)
  return NextResponse.json({ status: 'ok' }, { status: 200 })

  // Option B: With DB ping (Render recommends operation-critical checks)
  // try {
  //   const { prisma } = await import('@/lib/prisma')
  //   await prisma.$queryRaw`SELECT 1`
  //   return NextResponse.json({ status: 'ok', db: 'connected' }, { status: 200 })
  // } catch {
  //   return NextResponse.json({ status: 'error', db: 'disconnected' }, { status: 503 })
  // }
}
```

Start with Option A for fastest health check. Add Option B only if you want DB connectivity checks and accept the extra latency.
