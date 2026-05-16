import styles from './Reasons.module.css'

const reasons = [
  {
    label: 'Commitment',
    description:
      'Every project receives our full dedication — from the first consultation to the final delivery, we show up completely for you.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M6 28c0-2.5 1.5-4.5 4-5.5l6-2.5 4-6h4l3 4 5-1.5c2-.5 4 .5 4.5 2.5s-.5 4-2.5 4.5L28 25l-2 7H18l-2-4-4 1.5C9 30.5 6 29.5 6 28Z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
        />
        <path d="M18 20l-4-8 3-3 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 25l4 8-3 3-5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Creativity',
    description:
      'We approach every frame with a fresh eye — blending light, motion, and emotion into images that feel timeless and alive.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M24 6c-5.5 0-10 4.5-10 10 0 3.5 1.8 6.5 4.5 8.3V30h11v-5.7C32.2 22.5 34 19.5 34 16c0-5.5-4.5-10-10-10Z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
        />
        <path d="M19 30h10v3H19zM20.5 33v3a3.5 3.5 0 007 0v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 10v4M17.5 12.5l2.8 2.8M30.5 12.5l-2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Passion',
    description:
      'Photography is not just our profession — it is our calling. That love for the craft pours into every shot we take for you.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M24 38S8 28 8 17.5A8.5 8.5 0 0124 13a8.5 8.5 0 0116 4.5C40 28 24 38 24 38Z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export default function Reasons() {
  return (
    <section id="reasons" className={styles.section}>
      <div className={styles.header}>
        <p className="section-label reveal" style={{ justifyContent: 'center' }}>Why Us</p>
        <h2 className={`section-title reveal reveal-delay-1 ${styles.title}`}>
          3 Reasons to<br /><em>Choose&nbsp;Us</em>
        </h2>
      </div>

      <div className={styles.grid}>
        {reasons.map(({ label, description, icon }, i) => (
          <div key={label} className={`${styles.card} reveal reveal-delay-${i + 1}`}>
            <div className={styles.iconWrap}>{icon}</div>
            <h3 className={styles.label}>{label}</h3>
            <p className={styles.desc}>{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
