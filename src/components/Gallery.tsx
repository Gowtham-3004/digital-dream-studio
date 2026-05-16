'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { GALLERY_ITEMS } from '@/lib/data'
import styles from './Gallery.module.css'

// 3D tilt effect for each gallery item
function TiltCard({
  item,
  delayClass,
  onOpen,
  priority = false,
}: {
  item: { src: string; alt: string; label: string }
  delayClass: string
  onOpen: (src: string, alt: string) => void
  priority?: boolean
}) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const rafRef  = useRef<number>(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const card = cardRef.current!
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5   // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      card.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
      card.style.setProperty('--ry', `${( x * 8).toFixed(2)}deg`)
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const card = cardRef.current!
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
  }, [])

  const blockInteraction = useCallback((e: React.MouseEvent | React.DragEvent | React.TouchEvent) => {
    e.preventDefault()
  }, [])

  return (
    <button
      ref={cardRef}
      className={`${styles.item} gallery-item reveal ${delayClass}`}
      style={{ '--rx': '0deg', '--ry': '0deg' } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(item.src, item.alt)}
      onContextMenu={blockInteraction}
      onDragStart={blockInteraction}
      aria-label={`Open image: ${item.label}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={600}
        height={800}
        className={styles.img}
        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        draggable={false}
        unoptimized
      />
      {/* <div className={styles.overlay}>
        <span className={styles.overlayLabel}>{item.label}</span>
      </div> */}
      {/* Shimmer glare that follows mouse */}
      <div className={styles.glare} aria-hidden="true" />
    </button>
  )
}

export default function Gallery() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [lightboxAlt, setLightboxAlt] = useState('')

  const open  = useCallback((src: string, alt: string) => {
    setLightboxSrc(src); setLightboxAlt(alt)
  }, [])
  const close = useCallback(() => setLightboxSrc(null), [])

  const delayClasses = ['', 'reveal-delay-1', 'reveal-delay-2']

  return (
    <>
      <section id="gallery" className={styles.section}>
        <div className={styles.header}>
          <div>
            <p className="section-label reveal">Our Portfolio</p>
            <h2 className="section-title reveal reveal-delay-1">Frames of <em>Forever</em></h2>
          </div>
          <a href="#contact" className="btn-outline reveal reveal-delay-2">Book a Shoot</a>
        </div>

        <div className={styles.grid}>
          {GALLERY_ITEMS.map((item, i) => (
            <TiltCard
              key={i}
              item={item}
              delayClass={delayClasses[i % 3]}
              onOpen={open}
              priority={i < 3}
            />
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={close}
        >
          <button className={styles.lightboxClose} onClick={close} aria-label="Close lightbox">✕</button>
          <div
            onClick={e => e.stopPropagation()}
            onContextMenu={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()}
            className={styles.lightboxImgWrap}
          >
            <Image
              src={lightboxSrc}
              alt={lightboxAlt}
              width={1400}
              height={1000}
              className={styles.lightboxImg}
              priority
              draggable={false}
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  )
}
