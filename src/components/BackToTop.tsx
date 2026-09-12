'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './BackToTop.module.css'

// Lens ring geometry — matches the r="26" progress circle below
const RADIUS = 26
const CIRC   = 2 * Math.PI * RADIUS

export default function BackToTop() {
  const ringRef  = useRef<SVGCircleElement>(null)
  const flashRef = useRef<number>(0)
  const [visible, setVisible]   = useState(false)
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    const ring = ringRef.current!
    let shown = false

    const update = () => {
      const scrolled = window.scrollY
      const total    = document.documentElement.scrollHeight - window.innerHeight
      const pct      = total > 0 ? scrolled / total : 0
      ring.style.strokeDashoffset = `${CIRC * (1 - pct)}`

      // Only re-render when crossing the threshold, not on every scroll tick
      const shouldShow = scrolled > window.innerHeight * 0.6
      if (shouldShow !== shown) { shown = shouldShow; setVisible(shouldShow) }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.clearTimeout(flashRef.current)
    }
  }, [])

  const handleClick = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Shutter flash, then rewind to the top
    if (!reduce) {
      setFlashing(true)
      window.clearTimeout(flashRef.current)
      flashRef.current = window.setTimeout(() => setFlashing(false), 500)
    }
    window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`${styles.btn} ${visible ? styles.show : ''} ${flashing ? styles.flash : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
    >
      <span className={styles.label} aria-hidden="true">Back to top</span>

      {/* Lens rings — track, rotating focus ring, scroll-progress arc */}
      <svg className={styles.ring} viewBox="0 0 60 60" aria-hidden="true">
        <circle className={styles.track} cx="30" cy="30" r={RADIUS} />
        <circle className={styles.focus} cx="30" cy="30" r="22" />
        <circle
          ref={ringRef}
          className={styles.progress}
          cx="30" cy="30" r={RADIUS}
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC}
        />
      </svg>

      {/* Camera */}
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </button>
  )
}
