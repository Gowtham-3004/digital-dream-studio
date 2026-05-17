'use client'

import { useState } from 'react'
import { CONTACT_INFO } from '@/lib/data'
import styles from './Contact.module.css'

const SERVICES = [
  'Wedding Photography',
  'Cinematic Films',
  'Pre-Wedding Shoots',
  'Post-Wedding Shoots',
  'Birthday Parties',
  'Corporate Events',
  'Other Events',
]

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [dateInputType, setDateInputType] = useState<'text' | 'date'>('text')
  const [form, setForm] = useState({
    name: '', partner: '', email: '', phone: '', date: '', service: '', message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const web2phoneBody = new FormData()
    web2phoneBody.append('public_key', 'JLlcg4wp3AtPeAWLsLdIF5TM')
    web2phoneBody.append('field', form.name)
    web2phoneBody.append('field_2', form.partner)
    web2phoneBody.append('field_3', form.email)
    web2phoneBody.append('field_4', form.phone)
    web2phoneBody.append('field_5', form.date)
    web2phoneBody.append('field_6', form.service)
    web2phoneBody.append('field_7', form.message)

    setStatus('loading')

    try {
      const [sheetsRes] = await Promise.allSettled([
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }),
        fetch('https://web2phone.co.uk/api/v1/submit/', {
          method: 'POST',
          body: web2phoneBody,
        }),
      ])

      const ok = sheetsRes.status === 'fulfilled' && sheetsRes.value.ok
      setStatus(ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }

    setTimeout(() => setStatus('idle'), 3500)
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        {/* Info column */}
        <div>
          <p className="section-label reveal">Get in Touch</p>
          <h2 className="section-title reveal reveal-delay-1">
            Let&apos;s Tell<br />Your <em>Story</em>
          </h2>
          <p className={`${styles.lead} reveal reveal-delay-2`}>
            Your love story deserves the finest storytelling. Reach out and let&apos;s talk
            about how we&apos;ll capture your most precious memories.
          </p>

          <div className={`${styles.details} reveal reveal-delay-3`}>
            <div className={styles.detail}>
              <div className={styles.icon}>✉</div>
              <div>
                <div className={styles.detailLabel}>Email</div>
                <div className={styles.detailValue}>{CONTACT_INFO.email}</div>
              </div>
            </div>
            <div className={styles.detail}>
              <div className={styles.icon}>☎</div>
              <div>
                <div className={styles.detailLabel}>Phone / WhatsApp</div>
                <div className={styles.detailValue}>{CONTACT_INFO.phone}</div>
              </div>
            </div>
            <div className={styles.detail}>
              <div className={styles.icon}>◎</div>
              <div>
                <div className={styles.detailLabel}>Studio</div>
                <div className={styles.detailValue} style={{ whiteSpace: 'pre-line' }}>
                  {CONTACT_INFO.address}
                </div>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className={`${styles.socials} reveal reveal-delay-4`}>
            <a
              href={CONTACT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-link ${styles.socialLink}`}
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={CONTACT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-link ${styles.socialLink}`}
              aria-label="WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.073 23.27a.75.75 0 00.916.916l5.412-1.46A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.385l-.36-.214-3.733 1.008 1.008-3.733-.214-.36A9.818 9.818 0 1112 21.818z"/>
              </svg>
            </a>
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
              className={`social-link ${styles.socialLink}`}
              aria-label="Call us"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91A16 16 0 0015.1 17.1l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Form */}
        <form
          className={`${styles.form} reveal reveal-delay-2`}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className={styles.row}>
            <div className={styles.group}>
              <label htmlFor="name">Your Name</label>
              <input id="name" name="name" type="text" placeholder="Enter your name" value={form.name} onChange={handleChange} required />
            </div>
            <div className={styles.group}>
              <label htmlFor="partner">
                Partner&apos;s Name{' '}
                <span className={styles.optional}>(Optional)</span>
              </label>
              <input id="partner" name="partner" type="text" placeholder="Enter partner's name" value={form.partner} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="hello@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className={styles.group}>
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange} />
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label htmlFor="date">Event Date</label>
              <input
                id="date"
                name="date"
                type={dateInputType}
                placeholder="DD-MM-YYYY"
                value={form.date}
                onChange={handleChange}
                onFocus={() => setDateInputType('date')}
                onBlur={() => { if (!form.date) setDateInputType('text') }}
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="service">Service Needed</label>
              <select id="service" name="service" value={form.service} onChange={handleChange} data-placeholder={!form.service ? 'true' : undefined}>
                <option value="">Select a service</option>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="message">Your Love Story</label>
            <textarea id="message" name="message" placeholder="Tell us about your dream wedding..." value={form.message} onChange={handleChange} rows={4} />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`${styles.submit} ${status === 'success' ? styles.submitSuccess : ''} ${status === 'error' ? styles.submitError : ''}`}
          >
            {status === 'loading' ? 'Sending…' : status === 'success' ? 'Message Sent ✓' : status === 'error' ? 'Send Failed ✕' : 'Send Message →'}
          </button>
        </form>
      </div>
    </section>
  )
}
