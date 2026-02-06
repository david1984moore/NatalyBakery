import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken } from '@/lib/admin-auth'

const ADMIN_COOKIE_NAME = 'admin_session'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export const dynamic = 'force-dynamic'

function buildSetCookieHeader(token: string): string {
  const maxAge = SESSION_DURATION_MS / 1000
  const secure = process.env.NODE_ENV === 'production'
  const parts = [
    `${ADMIN_COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    `Max-Age=${maxAge}`,
    'SameSite=Lax',
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = (typeof body.password === 'string' ? body.password : '').trim()
    const expectedPassword = (process.env.ADMIN_PASSWORD ?? '').trim()

    if (!expectedPassword) {
      return NextResponse.json(
        { success: false, error: 'Admin not configured' },
        { status: 500 }
      )
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    const token = createAdminToken()
    const response = NextResponse.json({ success: true, token })
    response.headers.append('Set-Cookie', buildSetCookieHeader(token))
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
