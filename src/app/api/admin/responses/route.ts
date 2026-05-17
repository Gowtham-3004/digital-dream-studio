import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password || password !== "digitalDreamsAdmin123") {
  // if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // const scriptUrl = process.env.APPS_SCRIPT_URL
    const scriptUrl = "https://script.google.com/macros/s/AKfycbxAsTJyOSMnlZyYErWDV0ErYPoH2HTMXR8M57d4f3ZqOQet_pxtfNC2cmRSJHgiKG30sA/exec"
  if (!scriptUrl) {
    return NextResponse.json({ error: 'Apps Script URL not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(scriptUrl, {
      redirect: 'follow',
      headers: { 'Accept': 'application/json' },
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
