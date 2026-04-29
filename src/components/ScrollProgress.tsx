'use client'

import { useEffect, useRef } from 'react'
import styles from './ScrollProgress.module.css'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current!

    const update = () => {
      const scrolled = window.scrollY
      const total    = document.documentElement.scrollHeight - window.innerHeight
      const pct      = total > 0 ? (scrolled / total) * 100 : 0
      bar.style.transform = `scaleX(${pct / 100})`
    }

    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return <div ref={barRef} className={styles.bar} aria-hidden="true" />
}
