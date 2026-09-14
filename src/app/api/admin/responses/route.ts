import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const adminPassword = 'digitalDreamsAdmin123'
  const scriptUrl = "https://script.google.com/macros/s/AKfycbxAsTJyOSMnlZyYErWDV0ErYPoH2HTMXR8M57d4f3ZqOQet_pxtfNC2cmRSJHgiKG30sA/exec"

  if (!adminPassword || !scriptUrl) {
    console.error('Missing ADMIN_PASSWORD or APPS_SCRIPT_URL env var')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const { password } = await req.json().catch(() => ({}))

  if (typeof password !== 'string' || password !== adminPassword) {
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
