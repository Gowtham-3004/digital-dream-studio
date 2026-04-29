import styles from './Footer.module.css'

// Server Component
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        Digital <span>Dream</span> Studios
      </div>
      <div className={styles.tagline}>We make your memories special</div>
      <div className={styles.copy}>
        © {new Date().getFullYear()} Digital Dream Studios. All rights reserved.
      </div>
    </footer>
  )
}
