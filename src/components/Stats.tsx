'use client'

import { useEffect, useRef } from 'react'
import { STATS } from '@/lib/data'
import styles from './Stats.module.css'

function StatCard({ target, label }: { target: number; label: string }) {
  const numRef = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = numRef.current!
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let startTs = 0
          const duration = 1800
          const step = (ts: number) => {
            if (!startTs) startTs = ts
            const progress = Math.min((ts - startTs) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            el.textContent = String(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div className={`${styles.card} reveal`}>
      <div className={styles.number}>
        <span ref={numRef}>0</span>
        <span>+</span>
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}

export default function Stats() {
  return (
    <section id="stats" className={styles.section}>
      <div className={styles.grid}>
        {STATS.map(({ target, label }) => (
          <StatCard key={label} target={target} label={label} />
        ))}
      </div>
    </section>
  )
}
