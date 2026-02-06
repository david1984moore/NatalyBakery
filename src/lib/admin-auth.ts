import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const ADMIN_COOKIE_NAME = 'admin_session'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET
  if (!secret) {
    throw new Error('ADMIN_PASSWORD or ADMIN_SECRET must be set for admin access')
  }
  return secret
}

export function createAdminToken(): string {
  const exp = Date.now() + SESSION_DURATION_MS
  const payload = JSON.stringify({ exp })
  const signature = createHmac('sha256', getSecret()).update(payload).digest('hex')
  return `${payload}:${signature}`
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const lastColon = token.lastIndexOf(':')
    if (lastColon === -1) return false
    const payload = token.slice(0, lastColon)
    const signature = token.slice(lastColon + 1)
    if (!payload || !signature) return false

    const { exp } = JSON.parse(payload) as { exp: number }
    if (exp < Date.now()) return false

    const expected = createHmac('sha256', getSecret()).update(payload).digest('hex')
    if (expected.length !== signature.length) return false
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get('Authorization')
  if (auth?.startsWith('Bearer ')) return auth.slice(7).trim()
  return null
}

export async function isAdminAuthenticated(request?: Request): Promise<boolean> {
  const headerToken = request ? getTokenFromRequest(request) : null
  if (headerToken) return verifyAdminToken(headerToken)

  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (cookieToken) return verifyAdminToken(cookieToken)

  return false
}

export async function setAdminCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_MS / 1000,
    path: '/',
  })
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}
