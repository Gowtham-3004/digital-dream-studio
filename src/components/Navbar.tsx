'use client'

import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { href: '#gallery',      label: 'Portfolio' },
  { href: '#services',     label: 'Services' },
  { href: '#about',        label: 'About' },
  { href: '#testimonials', label: 'Stories' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false) // controls CSS animation

  // Track scroll for nav styling (but suppress when drawer is open)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Body scroll lock + Escape key
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      setDrawerVisible(true)
    } else {
      document.body.style.overflow = ''
      // Let fade-out play before unmounting
      const t = setTimeout(() => setDrawerVisible(false), 320)
      return () => clearTimeout(t)
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        className={[
          styles.nav,
          scrolled && !menuOpen ? styles.scrolled : '',
          menuOpen ? styles.menuOpen : '',
        ].filter(Boolean).join(' ')}
        role="navigation"
        aria-label="Main navigation"
      >
        <a href="#" className={styles.logo} aria-label="Digital Dream Studios home">
          Digital <span>Dream</span> Studios
        </a>

        {/* Desktop links */}
        <ul className={styles.links} role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={styles.link}>{label}</a>
            </li>
          ))}
        </ul>

        <a href="#contact" className={styles.btn}>Book a Session</a>

        {/* Hamburger — always on top via z-index */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </nav>

      {/* Drawer rendered as a sibling — escapes nav stacking context */}
      {drawerVisible && (
        <div
          className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : styles.drawerClose}`}
          aria-hidden={!menuOpen}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={styles.drawerLink}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className={`btn-primary ${styles.drawerBtn}`}
            onClick={closeMenu}
          >
            Book a Session
          </a>
        </div>
      )}
    </>
  )
}
