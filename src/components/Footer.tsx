import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Ornamental accent */}
        <div className={styles.ornament} aria-hidden="true">
          <span className={styles.ornLine} />
          <span className={styles.ornGlyph}>✦</span>
          <span className={styles.ornLine} />
        </div>

        {/* Brand */}
        <div className={styles.logo}>
          Digital <span>Dream</span> Studios
        </div>
        <p className={styles.tagline}>
          Capturing timeless stories with elegance and heart. Your memories, our passion.
        </p>

        {/* Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Copyright */}
        <p className={styles.copy}>
          © {new Date().getFullYear()} Digital Dream Studios. All rights reserved.
        </p>

      </div>
    </footer>
  )
}
