import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { reorder } from '@/lib/gallery'

export const runtime = 'nodejs'

export async function PUT(req: NextRequest) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const body = await req.json().catch(() => null)
  const ids: unknown = body?.ids
  if (
    !Array.isArray(ids) || ids.length === 0 || ids.length > 500 ||
    !ids.every(id => Number.isInteger(id) && id > 0) ||
    new Set(ids).size !== ids.length
  ) {
    return NextResponse.json({ error: 'ids must be a list of unique positive integers' }, { status: 400 })
  }

  try {
    await reorder(ids as number[])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Failed to reorder gallery:', err)
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 })
  }
}
