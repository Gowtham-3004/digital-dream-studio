'use client'

import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    // ── 1. Standard reveal: all .reveal, .reveal-left, .reveal-right, .reveal-scale
    const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale']
    const allRevealEls  = document.querySelectorAll<HTMLElement>(revealClasses.join(','))

    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            revealObs.unobserve(e.target) // fire once
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    )

    allRevealEls.forEach((el) => revealObs.observe(el))

    // ── 2. Auto-stagger: children of elements marked .stagger-children
    //    Adds reveal-delay-N to each child automatically
    const staggerParents = document.querySelectorAll<HTMLElement>('.stagger-children')
    staggerParents.forEach((parent) => {
      const children = Array.from(parent.children) as HTMLElement[]
      children.forEach((child, i) => {
        if (!child.classList.contains('reveal')) child.classList.add('reveal')
        const delayClass = `reveal-delay-${Math.min(i + 1, 6)}`
        if (!child.classList.contains(delayClass)) child.classList.add(delayClass)
        revealObs.observe(child)
      })
    })

    // ── 3. Section-label line draw: fire lineDraw animation when label enters view
    const labelLines = document.querySelectorAll<HTMLElement>('.section-label')
    const lineObs    = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // Retrigger the ::before animation by toggling a class
            e.target.classList.add('label-visible')
            lineObs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.5 }
    )
    labelLines.forEach((el) => lineObs.observe(el))

    return () => {
      revealObs.disconnect()
      lineObs.disconnect()
    }
  }, [])

  return null
}
