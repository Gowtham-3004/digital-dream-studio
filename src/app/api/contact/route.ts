import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { CONTACT_INFO } from '@/lib/data'

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAsTJyOSMnlZyYErWDV0ErYPoH2HTMXR8M57d4f3ZqOQet_pxtfNC2cmRSJHgiKG30sA/exec"

type Enquiry = {
  name?: string
  partner?: string
  email?: string
  phone?: string
  date?: string
  service?: string
  message?: string
}

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/

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
  const body = await req.json()
  const { name, partner, email, phone, date, service, message } = body

  const sheetsPayload = { ...body, timestamp: new Date().toISOString() }

  const [sheetsResult, emailResult] = await Promise.allSettled([
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetsPayload),
    }),
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
