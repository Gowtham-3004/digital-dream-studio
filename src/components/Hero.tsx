'use client'

import { useEffect, useRef } from 'react'
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      x = 0; y = 0; r = 0; alpha = 0; vx = 0; vy = 0; life = 0; maxLife = 0
      constructor() { this.reset() }
      reset() {
        this.x       = Math.random() * canvas.width
        this.y       = Math.random() * canvas.height
        this.r       = Math.random() * 3 + 1
        this.alpha   = Math.random() * 0.4 + 0.05
        this.vx      = (Math.random() - 0.5) * 0.3
        this.vy      = (Math.random() - 0.5) * 0.3
        this.life    = Math.random() * 200 + 100
        this.maxLife = this.life
      }
      draw() {
        const fade = Math.sin((1 - this.life / this.maxLife) * Math.PI)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3)
        g.addColorStop(0, `rgba(201,169,110,${this.alpha * fade})`)
        g.addColorStop(1, `rgba(201,169,110,0)`)
        ctx.fillStyle = g
        ctx.fill()
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life--
        if (this.life <= 0) this.reset()
      }
    }

    const particles = Array.from({ length: 100 }, () => new Particle())
    let raf = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.bg} aria-hidden="true" />

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
          <a href="#gallery" className="btn-primary">View Portfolio</a>
          <a href="#contact" className="btn-outline">Book Us Now</a>
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
