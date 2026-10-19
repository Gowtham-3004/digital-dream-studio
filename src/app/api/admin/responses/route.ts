import { NextRequest, NextResponse } from 'next/server'
import { isAdminPassword, requireAdmin } from '@/lib/adminAuth'

const MAX_DELETE = 500

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const scriptUrl = process.env.APPS_SCRIPT_URL

  if (!adminPassword || !scriptUrl) {
    console.error('Missing ADMIN_PASSWORD or APPS_SCRIPT_URL env var')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const { password } = await req.json().catch(() => ({}))

  if (!isAdminPassword(password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetch(scriptUrl, {
      redirect: 'follow',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      const body = await res.text()
      console.error('Apps Script returned non-JSON. Status:', res.status, 'Body (first 300):', body.slice(0, 300))
      return NextResponse.json(
        { error: 'Apps Script returned HTML — check deployment: set access to "Anyone, even anonymous"' },
        { status: 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Failed to fetch from Apps Script:', err)
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const scriptUrl = process.env.APPS_SCRIPT_URL
  if (!scriptUrl) {
    console.error('Missing APPS_SCRIPT_URL env var')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const body = await req.json().catch(() => null)
  const timestamps: unknown = body?.timestamps
  if (
    !Array.isArray(timestamps) ||
    timestamps.length === 0 ||
    timestamps.length > MAX_DELETE ||
    !timestamps.every(t => typeof t === 'string' && t.length > 0)
  ) {
    return NextResponse.json({ error: `timestamps must be 1–${MAX_DELETE} non-empty strings` }, { status: 400 })
  }

  try {
    const res = await fetch(scriptUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', timestamps }),
      cache: 'no-store',
    })

    const contentType = res.headers.get('content-type') ?? ''
    const data = contentType.includes('application/json') ? await res.json() : null
    // An Apps Script without the delete handler appends a row and returns no `deleted` count
    if (!data || data.error || typeof data.deleted !== 'number') {
      console.error('Apps Script delete failed. Status:', res.status, 'Body:', data)
      return NextResponse.json({ error: data?.error ?? 'Apps Script did not confirm the delete' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, deleted: data.deleted })
  } catch (err) {
    console.error('Failed to delete via Apps Script:', err)
    return NextResponse.json({ error: 'Failed to delete responses' }, { status: 500 })
  }
}
