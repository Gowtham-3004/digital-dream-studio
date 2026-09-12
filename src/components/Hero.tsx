'use client'

import { track } from '@vercel/analytics'
import HeroVideo from './HeroVideo'
import styles from './Hero.module.css'

// Splits a string into word-span pairs for the slide-up reveal
function WordReveal({
  text,
  baseDelay = 0,
  className = '',
}: {
  text: string
  baseDelay?: number
  className?: string
}) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className={`${styles.wordWrap} ${className}`}>
          <span
            className={styles.wordInner}
            style={{ animationDelay: `${baseDelay + i * 0.08}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 && <>&nbsp;</>}
        </span>
      ))}
    </>
  )
}

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <HeroVideo />
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.content}>
        {/* Eyebrow */}
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} aria-hidden="true" />
          <span className={styles.eyebrowText} style={{ animationDelay: '0.2s' }}>
            Premium Wedding Photography
          </span>
          <span className={styles.eyebrowLine} aria-hidden="true" />
        </div>

        {/* Title — word-by-word slide-up */}
        <h1 className={styles.title} aria-label="We Make Your Memories Special">
          <span className={styles.titleLine}>
            <WordReveal text="We Make Your" baseDelay={0.5} />
          </span>
          <span className={`${styles.titleLine} ${styles.titleLineEm}`}>
            <span className={styles.wordWrap}>
              <em className={styles.wordInner} style={{ animationDelay: '0.74s' }}>
                Memories
              </em>
            </span>
          </span>
          <span className={styles.titleLine}>
            <WordReveal text="Special" baseDelay={0.9} />
          </span>
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle} style={{ animationDelay: '1.1s' }}>
          Capturing love stories across India
        </p>

        {/* CTAs */}
        <div className={styles.ctas} style={{ animationDelay: '1.25s' } as React.CSSProperties}>
          <a href="#gallery" className="btn-primary" onClick={() => track('hero_cta_click', { cta: 'view_portfolio' })}>View Portfolio</a>
          <a href="#contact" className="btn-outline" onClick={() => track('hero_cta_click', { cta: 'book_now' })}>Book Us Now</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scroll} aria-hidden="true">
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
