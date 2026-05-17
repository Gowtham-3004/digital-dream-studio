import { NextRequest, NextResponse } from 'next/server'

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAsTJyOSMnlZyYErWDV0ErYPoH2HTMXR8M57d4f3ZqOQet_pxtfNC2cmRSJHgiKG30sA/exec"
const WEB2PHONE_URL = 'https://web2phone.co.uk/api/v1/submit/'
const WEB2PHONE_KEY = 'JLlcg4wp3AtPeAWLsLdIF5TM'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, partner, email, phone, date, service, message } = body

  const web2phoneBody = new FormData()
  web2phoneBody.append('public_key', WEB2PHONE_KEY)
  web2phoneBody.append('field', name ?? '')
  web2phoneBody.append('field_2', partner ?? '')
  web2phoneBody.append('field_3', email ?? '')
  web2phoneBody.append('field_4', phone ?? '')
  web2phoneBody.append('field_5', date ?? '')
  web2phoneBody.append('field_6', service ?? '')
  web2phoneBody.append('field_7', message ?? '')

  const sheetsPayload = { ...body, timestamp: new Date().toISOString() }

  const [sheetsResult, web2phoneResult] = await Promise.allSettled([
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetsPayload),
    }),
    fetch(WEB2PHONE_URL, { method: 'POST', body: web2phoneBody }),
  ])

  const sheetsOk = sheetsResult.status === 'fulfilled' && sheetsResult.value.ok
  const web2phoneOk = web2phoneResult.status === 'fulfilled' && web2phoneResult.value.ok

  if (!sheetsOk) {
    const detail = sheetsResult.status === 'rejected'
      ? sheetsResult.reason
      : await sheetsResult.value.text().catch(() => '')
    console.error('Apps Script failed:', detail)
  }

  if (!web2phoneOk) {
    const detail = web2phoneResult.status === 'rejected'
      ? web2phoneResult.reason
      : await web2phoneResult.value.text().catch(() => '')
    console.error('web2phone failed:', detail)
  }

  return NextResponse.json({ ok: true })
}
