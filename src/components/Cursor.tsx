'use client'

import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse   = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const rafRef  = useRef<number>(0)

  useEffect(() => {
    const dot = dotRef.current!

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      dot.style.left = `${e.clientX}px`
      dot.style.top  = `${e.clientY}px`
    }

    const animate = () => {
      const rx = ringPos.current.x + (mouse.current.x - ringPos.current.x) * 0.12
      const ry = ringPos.current.y + (mouse.current.y - ringPos.current.y) * 0.12
      ringPos.current.x = rx; ringPos.current.y = ry
      const r = ringRef.current
      if (r) { r.style.left = `${rx}px`; r.style.top = `${ry}px` }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    const targets = document.querySelectorAll<HTMLElement>(
      'a, button, .gallery-item, .service-item, .social-link'
    )

    const grow  = () => { dot.style.width = '14px'; dot.style.height = '14px'; ringRef.current!.style.width = '52px'; ringRef.current!.style.height = '52px' }
    const shrink = () => { dot.style.width = '8px';  dot.style.height = '8px';  ringRef.current!.style.width = '36px'; ringRef.current!.style.height = '36px' }

    targets.forEach(el => { el.addEventListener('mouseenter', grow); el.addEventListener('mouseleave', shrink) })
    document.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('mousemove', onMove)
      targets.forEach(el => { el.removeEventListener('mouseenter', grow); el.removeEventListener('mouseleave', shrink) })
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className={styles.dot}  aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  )
}
