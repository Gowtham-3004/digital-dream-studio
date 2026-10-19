import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export function isAdminPassword(candidate: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || typeof candidate !== 'string') return false
  const a = Buffer.from(candidate)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Returns a 401 response when the x-admin-password header is wrong, otherwise null */
export function requireAdmin(req: NextRequest): NextResponse | null {
  if (!process.env.ADMIN_PASSWORD) {
    console.error('Missing ADMIN_PASSWORD env var')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }
  return isAdminPassword(req.headers.get('x-admin-password'))
    ? null
    : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
