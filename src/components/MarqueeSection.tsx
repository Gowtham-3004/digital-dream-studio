import { MARQUEE_ITEMS } from '@/lib/data'
import styles from './MarqueeSection.module.css'

// Server Component — no interactivity needed
export default function MarqueeSection() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <div className={styles.wrap}>
      <div className={styles.track} aria-hidden="true">
        {doubled.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.dot} />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
