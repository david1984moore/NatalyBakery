import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Note: Memory monitoring via process.memoryUsage() is not available in Edge Runtime.
// The Prisma singleton fix (Phase 1-2) addresses the root cause. Monitor memory via
// Render Dashboard metrics. See RENDER_MEMORY_FIX_GUIDE.md Phase 5 for details.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
