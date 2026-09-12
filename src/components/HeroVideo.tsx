'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'

// Tried in order: the local file first, then the hosted sample (Pexels, free
// licence) when the local one is missing. Drop a real clip into /public/videos
// to take over; if every source fails the hero degrades to its gradient.
const HERO_SOURCES = [
  '/videos/hero.mp4',
  'https://videos.pexels.com/video-files/35238081/14928430_1920_1080_50fps.mp4',
]
const HERO_POSTER = '/videos/hero-poster.jpg'

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [srcIndex, setSrcIndex] = useState(0)
  const src = HERO_SOURCES[srcIndex]

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // The 404 may fire before React attaches onError (SSR markup starts loading
    // immediately), so also check the persistent error state here. Changing
    // `src` resets it, so this is safe to re-run per source.
    if (video.error) { setSrcIndex(i => i + 1); return }

    // Reduced motion: never start playback — poster (or gradient) stays.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Guarantee the DOM property, not just the attribute; iOS refuses inline autoplay otherwise.
    video.muted        = true
    video.defaultMuted = true

    // Play only while on screen. Also serves as the initial autoplay trigger.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Rejection is expected (iOS Low Power Mode, autoplay policy): poster stays.
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [srcIndex])

  // Every source failed: unmount so no browser "can't play" glyph shows through the tint.
  if (!src) return null

  return (
    <video
      ref={ref}
      className={styles.video}
      src={src}
      poster={HERO_POSTER}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      onError={() => setSrcIndex(i => i + 1)}
    />
  )
}
