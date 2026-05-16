import { CONTACT_INFO } from '@/lib/data'
import styles from './Footer.module.css'

const NAV_LINKS = [
  { href: '#hero',      label: 'Home' },
  { href: '#gallery',   label: 'Gallery' },
  { href: '#services',  label: 'Services' },
  { href: '#about',     label: 'About' },
  { href: '#contact',   label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Ornamental tagline banner */}
      <div className={styles.taglineRow} aria-hidden="true">
        <span className={styles.taglineLine} />
        <span className={styles.taglineGlyph}>✦</span>
        <span className={styles.taglineText}>We make your memories special</span>
        <span className={styles.taglineGlyph}>✦</span>
        <span className={styles.taglineLine} />
      </div>

      {/* Three-column content grid */}
      <div className={styles.grid}>

        {/* Column 1 — Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            Digital <span>Dream</span> Studios
          </div>
          <p className={styles.brandDesc}>
            Premium wedding &amp; event photography based in Chennai —
            capturing timeless stories with elegance and heart.
          </p>
          <div className={styles.socials}>
            <a
              href={CONTACT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={CONTACT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91A16 16 0 0015.1 17.1l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2 — Navigate */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Navigate</h3>
          <ul className={styles.colLinks}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={styles.colLink}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Get in Touch */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Get in Touch</h3>
          <ul className={styles.contact}>
            <li>
              <a href={`mailto:${CONTACT_INFO.email}`} className={styles.contactItem}>
                {CONTACT_INFO.email}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className={styles.contactItem}>
                {CONTACT_INFO.phone}
              </a>
            </li>
            <li>
              <address className={styles.address}>
                {CONTACT_INFO.address.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </address>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom copyright bar */}
      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Digital Dream Studios. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
