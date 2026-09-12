'use client'

import type { ReactNode } from 'react'
import { track } from '@vercel/analytics'
import styles from './Services.module.css'

type IconKind = 'wedding' | 'film' | 'preWedding' | 'postWedding' | 'maternity' | 'birthday' | 'corporate' | 'events'

/* Heart outline path, `w` wide, centred on (cx, cy) — shared by several icons */
function heart(cx: number, cy: number, w: number) {
  const x = cx - w / 2
  const y = cy - w / 2
  const p = (px: number, py: number) => `${+(x + px * w).toFixed(2)} ${+(y + py * w).toFixed(2)}`
  return (
    `M${p(0.5, 1)}` +
    `C${p(0.125, 0.69)} ${p(0, 0.56)} ${p(0, 0.31)}` +
    `C${p(0, 0.125)} ${p(0.15, 0)} ${p(0.29, 0)}` +
    `C${p(0.39, 0)} ${p(0.46, 0.06)} ${p(0.5, 0.14)}` +
    `C${p(0.54, 0.06)} ${p(0.61, 0)} ${p(0.71, 0)}` +
    `C${p(0.85, 0)} ${p(1, 0.125)} ${p(1, 0.31)}` +
    `C${p(1, 0.56)} ${p(0.875, 0.69)} ${p(0.5, 1)}Z`
  )
}

/* Thin single-stroke line icons on a 48×48 grid */
const ICONS: Record<IconKind, ReactNode> = {
  // Interlocking rings with a small heart
  wedding: (
    <>
      <circle cx="18.5" cy="30" r="9.5" />
      <circle cx="29.5" cy="30" r="9.5" />
      <path d={heart(24, 15, 9)} />
    </>
  ),
  // Cine camera — two reels, body, lens cone
  film: (
    <>
      <circle cx="16" cy="13" r="5.5" />
      <circle cx="28" cy="13" r="5.5" />
      <circle cx="16" cy="13" r="1.5" />
      <circle cx="28" cy="13" r="1.5" />
      <rect x="8" y="19" width="26" height="17" rx="2.5" />
      <circle cx="15.5" cy="27.5" r="4" />
      <path d="M34 25l8-4v14l-8-4" />
    </>
  ),
  // Couple with a heart between them
  preWedding: (
    <>
      <circle cx="14.5" cy="16" r="5.5" />
      <circle cx="33.5" cy="16" r="5.5" />
      <path d="M6 38v-3.5a8.5 8.5 0 0 1 17 0V38" />
      <path d="M25 38v-3.5a8.5 8.5 0 0 1 17 0V38" />
      <path d={heart(24, 14, 7)} />
    </>
  ),
  // Diamond ring
  postWedding: (
    <>
      <circle cx="24" cy="32.5" r="9" />
      <path d="M17.5 17L21 12h6l3.5 5-6.5 7.5z" />
      <path d="M17.5 17h13M21 12l3 5 3-5" />
    </>
  ),
  // Figure with a heart on the belly
  maternity: (
    <>
      <circle cx="24" cy="11" r="5" />
      <path d="M14 41V30C14 24 18 19.5 24 19.5S34 24 34 30V41" />
      <path d={heart(24, 31, 9)} />
    </>
  ),
  // Two-tier cake with candles
  birthday: (
    <>
      <path d="M6 40h36" />
      <path d="M9 40v-8.5a1.5 1.5 0 0 1 1.5-1.5h27a1.5 1.5 0 0 1 1.5 1.5V40" />
      <path d="M14 30v-6.5a1.5 1.5 0 0 1 1.5-1.5h17a1.5 1.5 0 0 1 1.5 1.5V30" />
      <path d="M14 26c1.5 2.2 3.5 2.2 5 0c1.5 2.2 3.5 2.2 5 0c1.5 2.2 3.5 2.2 5 0c1.5 2.2 3.5 2.2 5 0" />
      <path d="M9 34c1.5 2.2 3.5 2.2 5 0c1.5 2.2 3.5 2.2 5 0c1.5 2.2 3.5 2.2 5 0c1.5 2.2 3.5 2.2 5 0c1.5 2.2 3.5 2.2 5 0c1.5 2.2 3.5 2.2 5 0" />
      <path d="M19 22v-6M24 22v-6M29 22v-6" />
      <path d="M19 15.5c-1.3-1.6-1.3-3.2 0-4.8 1.3 1.6 1.3 3.2 0 4.8zM24 15.5c-1.3-1.6-1.3-3.2 0-4.8 1.3 1.6 1.3 3.2 0 4.8zM29 15.5c-1.3-1.6-1.3-3.2 0-4.8 1.3 1.6 1.3 3.2 0 4.8z" />
    </>
  ),
  // Group of three people
  corporate: (
    <>
      <circle cx="24" cy="14" r="5" />
      <path d="M14 38v-4a10 10 0 0 1 20 0v4" />
      <circle cx="11" cy="18" r="4" />
      <path d="M3 38v-2.5a8 8 0 0 1 9.5-7.8" />
      <circle cx="37" cy="18" r="4" />
      <path d="M45 38v-2.5a8 8 0 0 0-9.5-7.8" />
    </>
  ),
  // Calendar with a heart
  events: (
    <>
      <rect x="7" y="10" width="34" height="30" rx="3" />
      <path d="M7 18h34M15 6.5v7M33 6.5v7" />
      <path d={heart(24, 29.5, 12)} />
    </>
  ),
}

function ServiceIcon({ kind }: { kind: IconKind }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[kind]}
    </svg>
  )
}

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <p className={`section-label reveal ${styles.label}`}>What We Offer</p>
        <h2 className={`section-title reveal reveal-delay-1 ${styles.heading}`}>
          Every frame,<br />a <em>masterpiece</em>
        </h2>
        <p className={`${styles.sub} reveal reveal-delay-2`}>
          From sacred vows to candid laughter — we craft visual stories that outlive the moment.
        </p>
      </div>

      {/* Bento grid */}
      <div className={styles.grid}>

        {/* Row 1 — two featured hero cards */}
        <div className={`${styles.card} ${styles.cardFeatured} reveal`} onClick={() => track('service_click', { service: 'Wedding Photography' })}>
          <span className={styles.cardNum}>01</span>
          <div className={styles.cardBg} style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(201,169,110,0.12) 0%, transparent 70%)' }} />
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <h3 className={styles.cardName}>Wedding<br />Photography</h3>
              <span className={styles.cardIcon}><ServiceIcon kind="wedding" /></span>
            </div>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Timeless imagery crafted with elegance and depth. Every grand moment and intimate glance
              documented with a refined, storytelling eye — a collection as beautiful as the day itself.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Photography</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardFeatured} ${styles.cardDark} reveal reveal-delay-1`} onClick={() => track('service_click', { service: 'Cinematic Films' })}>
          <span className={styles.cardNum}>02</span>
          <div className={styles.cardBg} style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(201,169,110,0.1) 0%, transparent 70%)' }} />
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <h3 className={styles.cardName}>Cinematic<br />Films</h3>
              <span className={styles.cardIcon}><ServiceIcon kind="film" /></span>
            </div>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Your love story transformed into a visually stunning film. Carefully composed frames,
              emotive storytelling, and curated soundtracks — every second designed to move you.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Videography</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        {/* Row 2 — three medium cards */}
        <div className={`${styles.card} ${styles.cardMedium} reveal`} onClick={() => track('service_click', { service: 'Pre-Wedding Shoots' })}>
          <span className={styles.cardNum}>03</span>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <h3 className={styles.cardName}>Pre-Wedding<br />Shoots</h3>
              <span className={styles.cardIcon}><ServiceIcon kind="preWedding" /></span>
            </div>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Sophisticated portraits in carefully chosen locations — a natural, personal prelude to your wedding story.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Portrait</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardMedium} ${styles.cardDark} reveal reveal-delay-1`} onClick={() => track('service_click', { service: 'Post-Wedding Shoots' })}>
          <span className={styles.cardNum}>04</span>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <h3 className={styles.cardName}>Post-Wedding<br />Shoots</h3>
              <span className={styles.cardIcon}><ServiceIcon kind="postWedding" /></span>
            </div>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              No time constraints. Pure artistry. Refined compositions that feel effortlessly timeless and beautifully curated.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Portrait</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardMedium} reveal reveal-delay-2`} onClick={() => track('service_click', { service: 'Maternity Shoots' })}>
          <span className={styles.cardNum}>05</span>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <h3 className={styles.cardName}>Maternity<br />Shoots</h3>
              <span className={styles.cardIcon}><ServiceIcon kind="maternity" /></span>
            </div>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Graceful, softly lit portraits celebrating new beginnings — a tender keepsake of this fleeting chapter before your little one arrives.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Portrait</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        {/* Row 3 — three medium cards */}
        <div className={`${styles.card} ${styles.cardMedium} reveal`} onClick={() => track('service_click', { service: 'Birthday Parties' })}>
          <span className={styles.cardNum}>06</span>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <h3 className={styles.cardName}>Birthday<br />Parties</h3>
              <span className={styles.cardIcon}><ServiceIcon kind="birthday" /></span>
            </div>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Energy, emotion, celebration — captured with a polished storytelling approach and precise attention to every detail.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Events</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardMedium} ${styles.cardDark} reveal reveal-delay-1`} onClick={() => track('service_click', { service: 'Corporate Events' })}>
          <span className={styles.cardNum}>07</span>
          <div className={styles.cardBg} style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.08) 0%, transparent 60%)' }} />
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <h3 className={styles.cardName}>Corporate<br />Events</h3>
              <span className={styles.cardIcon}><ServiceIcon kind="corporate" /></span>
            </div>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Professionalism meets visual artistry. Brand-forward coverage that reflects your organisation's identity
              with clarity, confidence, and a polished edge that commands attention.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Corporate</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardMedium} reveal reveal-delay-2`} onClick={() => track('service_click', { service: 'Other Events' })}>
          <span className={styles.cardNum}>08</span>
          <div className={styles.cardContent}>
            <div className={styles.cardTitleRow}>
              <h3 className={styles.cardName}>Other<br />Events</h3>
              <span className={styles.cardIcon}><ServiceIcon kind="events" /></span>
            </div>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Intimate gatherings to grand celebrations — covered with the same precision and creative excellence.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Events</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

      </div>

      {/* Bottom CTA bar */}
      <div className={`${styles.cta} reveal`}>
        <p className={styles.ctaText}>
          Want to know more about the package?
        </p>
        <a href="#contact" className="btn-primary" onClick={() => track('services_cta_click')}>Let&apos;s talk</a>
      </div>
    </section>
  )
}
