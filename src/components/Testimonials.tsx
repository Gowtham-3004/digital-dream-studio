'use client'

import { useRef, useEffect } from 'react'
import { TESTIMONIALS } from '@/lib/data'
import styles from './Testimonials.module.css'

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: dir === 'right' ? 460 : -460, behavior: 'smooth' })
    // Reset auto-scroll timer when user manually scrolls
    resetAutoScroll()
  }

  const autoScroll = () => {
    if (!trackRef.current) return
    const el = trackRef.current
    const maxScroll = el.scrollWidth - el.clientWidth
    if (el.scrollLeft >= maxScroll) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: 460, behavior: 'smooth' })
    }
  }

  const resetAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    autoScrollRef.current = setInterval(autoScroll, 4000)
  }

  useEffect(() => {
    resetAutoScroll()
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [])

  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.header}>
        <p className="section-label reveal" style={{ justifyContent: 'center' }}>Love Notes</p>
        <h2 className="section-title reveal reveal-delay-1">What Couples <em>Say</em></h2>
        <div className={styles.controls}>
          <button className={styles.arrow} onClick={() => scroll('left')} aria-label="Previous testimonial">←</button>
          <button className={styles.arrow} onClick={() => scroll('right')} aria-label="Next testimonial">→</button>
        </div>
      </div>

      <div 
        className={styles.track} 
        ref={trackRef} 
        role="list"
        onMouseEnter={() => {
          if (autoScrollRef.current) clearInterval(autoScrollRef.current)
        }}
        onMouseLeave={resetAutoScroll}
      >
        {TESTIMONIALS.map((t) => (
          <article key={t.name} className={styles.card} role="listitem">
            <span className={styles.quoteMark} aria-hidden="true">"</span>
            <p className={styles.text}>{t.text}</p>
            <div className={styles.author}>
              <div className={styles.avatar} aria-hidden="true">{t.initial}</div>
              <div>
                <div className={styles.stars} aria-label="5 stars">★★★★★</div>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.event}>{t.event}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
