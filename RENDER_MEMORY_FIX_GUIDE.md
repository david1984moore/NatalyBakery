# Render Memory Leak Fix - Caramelandjo

**For recurring "Ran out of memory (used over 512MB)" events (Feb 2026+):** See **MEMORY-OOM-INVESTIGATION-REPORT.md** for full root-cause analysis. The main fix is in `src/lib/image-utils.server.ts`: blur placeholders are now computed **sequentially** and **cached** via `unstable_cache` to avoid parallel full-image loads and repeated work. Also consider adding `NODE_OPTIONS=--max-old-space-size=384` in Render → Environment (documented in Phase 4 below).

## Problem Summary

**Issue:** Render instance crashed with "Ran out of memory (used over 512MB)" error  
**When:** February 8, 2026 at 7:06 PM (35 minutes after successful deployment)  
**Context:** App was idle with no active user interaction  
**Current Plan:** Render Starter (512MB RAM)

**Key Evidence:**
- Crash occurred during runtime, NOT during build/deployment
- No traffic spike or active usage at time of crash
- Memory accumulated gradually over ~35 minutes
- Classic symptom: Connection pool leak or improper Prisma Client instantiation

## Root Cause Analysis

**High Confidence Diagnosis: Prisma Client Memory Leak**

In Next.js + Prisma + Supabase environments, the most common cause of this specific failure pattern is:

1. **Multiple Prisma Client instances** being created across requests
2. Each instance opens database connections that aren't properly closed
3. In serverless/containerized environments, connections accumulate
4. After 30-40 minutes, memory limit is exceeded
5. Instance crashes and restarts

**Why this happens:**
- Next.js hot reloading in development creates multiple client instances
- Without proper singleton pattern, production suffers same issue
- Each API route that does `new PrismaClient()` creates a new instance
- Connection pools don't get cleaned up properly in serverless context

## Pre-Fix Investigation

**@cursor - Before implementing fixes, please investigate and report:**

### 1. Current Prisma Initialization Pattern
```bash
# Search for all Prisma Client instantiations
grep -r "new PrismaClient" .
grep -r "from '@prisma/client'" app/
grep -r "import.*PrismaClient" .
```

**Report:**
- How many places instantiate PrismaClient?
- Are they creating new instances or importing from a shared module?
- Show the current initialization code

### 2. Database Connection Configuration
```bash
# Check current DATABASE_URL structure
cat .env | grep DATABASE_URL
```

**Report:**
- What does the DATABASE_URL connection string look like?
- Does it have any connection pool parameters (pgbouncer, connection_limit, etc.)?
- Is there a DIRECT_URL configured?

### 3. API Route Inventory
```bash
# Find all API routes
find app/api -name "*.ts" -o -name "*.js"
```

**Report:**
- List all API route files
- Which ones use Prisma/database operations?

### 4. Current Prisma Schema
```bash
cat prisma/schema.prisma
```

**Report:**
- Show the datasource configuration
- Show the generator configuration
- Are there any existing connection settings?

### 5. Existing Prisma Utility Files
```bash
# Check for existing prisma utility modules
find . -name "prisma.ts" -o -name "prisma.js" -o -name "db.ts" -o -name "db.js"
ls -la lib/ 2>/dev/null
```

**Report:**
- Do any shared Prisma utility files already exist?
- If so, show their contents

---

## Fix Implementation Plan

Once investigation is complete, implement in this order:

### Phase 1: Create Prisma Singleton (CRITICAL)

**Create: `lib/prisma.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

// Prevent multiple Prisma Client instances in development hot reloading
// This is the official Prisma recommendation for Next.js
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })

// In development, store client on global object to survive hot reloads
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown in production
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
```

**Why this works:**
- Single instance shared across all API routes
- Survives Next.js hot reloads in development
- Properly disconnects on shutdown
- Prevents connection pool exhaustion

### Phase 2: Update All API Routes

**@cursor - For EACH file that uses Prisma:**

**BEFORE (problematic pattern):**
```typescript
import { PrismaClient } from '@prisma/client'

export async function POST(request: Request) {
  const prisma = new PrismaClient() // ❌ Creates new instance every request
  const result = await prisma.order.create({ data })
  return Response.json(result)
}
```

**AFTER (correct pattern):**
```typescript
import { prisma } from '@/lib/prisma' // ✅ Import singleton

export async function POST(request: Request) {
  // Use imported singleton directly
  const result = await prisma.order.create({ data })
  return Response.json(result)
}
```

**Action Items:**
1. Update ALL API routes to import from `@/lib/prisma`
2. Remove any `new PrismaClient()` instantiations
3. Remove any local `const prisma = ...` declarations in API routes
4. Ensure all routes use the shared singleton

### Phase 3: Optimize Database Connection Pool

**Update: `prisma/schema.prisma`**

Add connection pooling configuration:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Used for migrations, bypasses pooler
}

generator client {
  provider = "prisma-client-js"
  // Add if using Prisma 5.x+ and experiencing issues:
  // previewFeatures = ["driverAdapters"]
}

// Rest of your schema...
```

### Phase 4: Update Environment Variables

**In Render Dashboard → Environment:**

Update your `DATABASE_URL` to include connection limits:

```bash
# Current URL (example - use your actual values)
DATABASE_URL=postgresql://user:password@host.supabase.co:5432/postgres

# Updated URL with connection limiting
DATABASE_URL=postgresql://user:password@host.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1

# If Supabase provides a direct URL (for migrations), add:
DIRECT_URL=postgresql://user:password@host.supabase.co:5432/postgres
```

**Critical parameters:**
- `connection_limit=1` - Limits each Node.js instance to 1 connection (prevents pool exhaustion)
- `pgbouncer=true` - Uses Supabase's connection pooler (if available)

**Optional – cap Node heap (recommended if OOM persists):**
- Add `NODE_OPTIONS=--max-old-space-size=384` in Render Dashboard → Environment.
- This limits the V8 heap so total process memory (RSS) is less likely to exceed 512MB; leaves headroom for native modules (e.g. Sharp), buffers, and the rest of the process.
- See **MEMORY-OOM-INVESTIGATION-REPORT.md** for full OOM root-cause analysis and blur-placeholder fixes.

**@cursor - Determine:**
- Does the existing DATABASE_URL use Supabase's pooler endpoint (port 6543)?
- Or direct database endpoint (port 5432)?
- Recommend appropriate connection string based on Supabase setup

### Phase 5: Add Memory Monitoring (Optional but Recommended)

**Create: `middleware.ts` (root directory)**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Production memory monitoring
  if (process.env.NODE_ENV === 'production') {
    const used = process.memoryUsage()
    const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024)
    const rssMB = Math.round(used.rss / 1024 / 1024)
    
    // Warn if approaching 80% of 512MB limit
    if (heapUsedMB > 400 || rssMB > 400) {
      console.warn('⚠️ Memory usage high:', {
        heapUsed: `${heapUsedMB}MB`,
        rss: `${rssMB}MB`,
        limit: '512MB',
        path: request.nextUrl.pathname
      })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*' // Only monitor API routes
}
```

**Benefits:**
- Early warning if memory starts climbing again
- Helps identify which routes cause spikes
- Visible in Render logs for debugging

### Phase 6: Regenerate Prisma Client

After all changes:

```bash
# Regenerate Prisma Client with new configuration
npx prisma generate

# Verify no errors
npx prisma validate
```

---

## Deployment & Testing Protocol

### Pre-Deployment Checklist

**@cursor - Verify before deploying:**

- [ ] `lib/prisma.ts` singleton created
- [ ] All API routes updated to use singleton import
- [ ] No remaining `new PrismaClient()` in codebase
- [ ] `DATABASE_URL` updated with connection limits
- [ ] `prisma/schema.prisma` has directUrl configured
- [ ] Prisma client regenerated (`npx prisma generate`)
- [ ] All TypeScript compilation succeeds (`npm run build`)

### Deployment Steps

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix: Implement Prisma singleton pattern to prevent memory leak"
   git push origin main
   ```

2. **Monitor Render deployment:**
   - Watch deployment logs for successful build
   - Verify "Ready in XXXms" message appears
   - Note deployment timestamp

3. **Post-deployment monitoring:**
   - Keep Render logs open (Dashboard → Logs)
   - Note baseline memory usage after startup
   - Monitor for 60+ minutes with site idle
   - Look for memory warnings from middleware

### Success Criteria

**Fixed if:**
- No memory crashes after 60+ minutes idle
- Memory usage stays relatively flat (not climbing)
- No "out of memory" events in Render dashboard
- Site remains responsive

**Still problematic if:**
- Memory still climbing steadily over time
- Crashes occur again within hours
- Middleware shows memory > 400MB consistently

### If Issue Persists

**Additional diagnostic steps:**

1. **Check for other leaks:**
   ```bash
   # Search for other potential issues
   grep -r "setInterval" app/
   grep -r "setTimeout" app/
   grep -r "EventEmitter" app/
   ```

2. **Review Next.js configuration:**
   ```bash
   cat next.config.js
   cat next.config.mjs
   ```

3. **Check for large dependencies:**
   ```bash
   npm ls --depth=0
   npx bundle-analyzer # If configured
   ```

4. **Consider instance upgrade:**
   - If baseline memory > 350MB after fixes
   - Upgrade to Standard plan ($7/mo, 2GB RAM)
   - This provides headroom for traffic growth

---

## Long-Term Recommendations

### 1. Memory Headroom
Even with fixes, 512MB is tight for production Next.js apps. Consider:
- **Now:** Validate fix works on Starter plan
- **Before launch:** Upgrade to Standard (2GB) for production reliability
- **Rationale:** Room for traffic spikes, background tasks, future features

### 2. Monitoring Setup
Add proper application monitoring:
- Render's built-in metrics (already have)
- Consider: Sentry, LogRocket, or similar for production
- Track: Memory trends, API response times, error rates

### 3. Database Query Optimization
Once memory leak is fixed, review queries:
- Use Prisma's query analysis: `log: ['query']` in dev
- Check for N+1 queries
- Add database indexes where needed
- Consider: `include` vs `select` strategies

### 4. Connection Pool Sizing
As traffic grows, revisit connection pool:
- Current: 1 connection per instance (serverless safe)
- Future: May need dedicated connection pooler
- Monitor: Database connection count in Supabase dashboard

---

## Reference Information

### Prisma + Next.js Best Practices
- [Official Prisma Guide](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
- Key principle: One client instance per application
- Critical for: Edge functions, serverless, containers

### Supabase Connection Pooling
- Port 5432: Direct database (use with `directUrl` for migrations)
- Port 6543: Connection pooler (use with `url` for queries)
- Transaction mode vs Session mode pooling

### Render Resource Limits
- Starter: 512MB RAM, 0.5 CPU
- Standard: 2GB+ RAM, 1+ CPU
- Memory limits are hard caps (instant restart on exceed)

---

## Questions for Human Verification

**@cursor - After completing investigation, ask the human:**

1. **Supabase Setup:**
   - "I found your DATABASE_URL uses [port/configuration]. Do you have access to Supabase's connection pooler (port 6543)? This would be in your Supabase project settings."

2. **Current Behavior:**
   - "Since the crash, has the site been working normally, or are you seeing recurring crashes?"
   - "How long has the site been deployed before the first crash?"

3. **Traffic Patterns:**
   - "Besides the browser windows you had open, is there any other traffic to the site? (bots, monitoring services, search engines?)"

4. **Database Operations:**
   - "Which features/pages hit the database most? (orders, product listings, contact form?)"

5. **Future Plans:**
   - "When are you planning to launch publicly? This helps determine if we should upgrade the Render plan proactively."

---

## Implementation Notes for @cursor

**Code Style Consistency:**
- Match existing import patterns (@ alias vs relative paths)
- Maintain consistent TypeScript usage
- Follow existing error handling patterns
- Keep logging style consistent with rest of codebase

**Testing Approach:**
- Validate all changes compile before committing
- Test one API route locally before updating all
- Verify Prisma migrations still work with directUrl
- Check that existing functionality unchanged

**Git Workflow:**
- Create descriptive commit message
- Consider creating PR if using feature branches
- Tag commit with "memory-leak-fix" for tracking

**Documentation:**
- Add comment in lib/prisma.ts explaining singleton pattern
- Update README if it exists with new architecture notes
- Document environment variables in .env.example

---

## Expected Outcome

After implementing these fixes:

1. **Immediate:** Memory leak stops, no more crashes
2. **Short-term:** Site remains stable under idle and light usage
3. **Long-term:** Foundation for scaling to production traffic

**Time to implement:** 30-45 minutes  
**Time to validate:** 2-4 hours monitoring  
**Risk level:** Low (changes improve standard practices, don't break functionality)

---

## Emergency Rollback Plan

If fixes cause unexpected issues:

```bash
# Revert to previous working deployment
git revert HEAD
git push origin main

# Or in Render Dashboard:
# Settings → Manual Deploy → Select previous successful deploy
```

**When to rollback:**
- Site fails to build after changes
- API routes return 500 errors consistently
- Database connection failures

**Note:** Memory leak will return, but site will be functional again

---

## Success Metrics

**Track these in Render Dashboard:**

| Metric | Before Fix | Target After Fix |
|--------|-----------|------------------|
| Memory crashes | 1+ per day | 0 per week |
| Baseline memory | Unknown | < 300MB |
| Peak memory | 512MB+ (crash) | < 450MB |
| Instance restarts | Multiple | Only on deploy |
| Uptime | < 99% | > 99.9% |

**Document findings:**
- Screenshot Render metrics after 24 hours
- Note any remaining memory patterns
- Report back on stability

---

## Additional Context

**About Render's Memory Management:**
- Hard limit enforcement (no graceful degradation)
- Instant container restart on exceed
- No memory swap available
- Restarts lose all in-memory state

**About Next.js Memory Characteristics:**
- Base Next.js app: ~150-200MB
- Prisma adds: ~50-100MB
- Each unnecessary PrismaClient: +30-50MB
- Under normal load: Should stay < 350MB

**About This Specific Case:**
- Crash after 35 minutes suggests slow leak, not spike
- Idle state rules out request-based accumulation
- Points to: Connection pool or unclosed resources
- High confidence in Prisma singleton fix

---

## Version Info

**Document Version:** 1.0  
**Date Created:** February 9, 2026  
**Target Application:** Caramelandjo (Next.js + Prisma + Supabase)  
**Render Plan:** Starter (512MB)  
**Issue Ticket:** Memory exceeded 512MB on Feb 8, 2026 at 7:06 PM

**Last Updated:** Initial creation

---

## Cursor AI Instructions Summary

1. **Investigate** current Prisma usage patterns (Phase 1 of investigation)
2. **Report findings** to human for verification
3. **Implement fixes** systematically following the phase order
4. **Validate** changes compile and tests pass
5. **Deploy** via git push (auto-deploys to Render)
6. **Monitor** with human for 2+ hours post-deployment
7. **Document** final state and any remaining observations

**Priority:** HIGH - Production stability issue  
**Complexity:** MEDIUM - Well-understood fix, requires careful execution  
**Risk:** LOW - Implements official best practices

---

End of document. Ready for Cursor AI implementation.
