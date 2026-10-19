import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { EMAIL_PATTERN, validateEnquiry } from '@/lib/validation'


type Enquiry = {
  name?: string
  partner?: string
  email?: string
  phone?: string
  date?: string
  service?: string
  message?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function sendNotificationEmail(enquiry: Enquiry) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping notification email')
    return
  }

  const rows: [string, string | undefined][] = [
    ['Name', enquiry.name],
    ['Partner', enquiry.partner],
    ['Email', enquiry.email],
    ['Phone', enquiry.phone],
    ['Event Date', enquiry.date],
    ['Service', enquiry.service],
    ['Message', enquiry.message],
  ]

  const html = `
    <h2>New enquiry from the website</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(([label, value]) => `
        <tr>
          <td style="font-weight:bold;vertical-align:top">${label}</td>
          <td style="white-space:pre-wrap">${escapeHtml(value || '-')}</td>
        </tr>`)
        .join('')}
    </table>`
  const text = rows.map(([label, value]) => `${label}: ${value || '-'}`).join('\n')

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: 'hello@digitaldreamstudios.in',
    to: 'hello.digitaldreamstudios@gmail.com',
    replyTo: enquiry.email && EMAIL_PATTERN.test(enquiry.email.trim()) ? enquiry.email.trim() : undefined,
    subject: `New enquiry: ${enquiry.name || 'Unknown'} – ${enquiry.service || 'General'}`,
    html,
    text,
  })

  if (error) throw error
}

export async function POST(req: NextRequest) {
  let body: Enquiry
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const errors = validateEnquiry(body ?? {})
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 })
  }

  const { name, partner, email, phone, date, service, message } = body

  const sheetsPayload = { ...body, timestamp: new Date().toISOString() }
  const scriptUrl = process.env.APPS_SCRIPT_URL

  const [sheetsResult, emailResult] = await Promise.allSettled([
    scriptUrl
      ? fetch(scriptUrl, {
          method: 'POST',
          redirect: 'follow',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetsPayload),
        })
      : Promise.reject(new Error('Missing APPS_SCRIPT_URL env var')),
    sendNotificationEmail({ name, partner, email, phone, date, service, message }),
  ])

  const sheetsOk = sheetsResult.status === 'fulfilled' && sheetsResult.value.ok

  if (!sheetsOk) {
    const detail = sheetsResult.status === 'rejected'
      ? sheetsResult.reason
      : await sheetsResult.value.text().catch(() => '')
    console.error('Apps Script failed:', detail)
  }

  if (emailResult.status === 'rejected') {
    console.error('Resend failed:', emailResult.reason)
  }

  return NextResponse.json({ ok: true })
}
