import { MARQUEE_ITEMS } from '@/lib/data'
import styles from './MarqueeSection.module.css'

// Repeat items 4× so one group's width exceeds any viewport (including 4K)
const group = Array.from({ length: 4 }, () => MARQUEE_ITEMS).flat()

const Group = () => (
  <div className={styles.inner}>
    {group.map((item, i) => (
      <div key={i} className={styles.item}>
        <span className={styles.dot} />
        {item}
      </div>
    ))}
  </div>
)

// Server Component — no interactivity needed
export default function MarqueeSection() {
  return (
    <div className={styles.wrap}>
      <div className={styles.track} aria-hidden="true">
        <Group />
        <Group />
      </div>
    </div>
  )
}
