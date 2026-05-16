import Image from 'next/image'
import styles from './Reasons.module.css'

const reasons = [
  {
    label: 'Commitment',
    description:
      'Every project receives our full dedication — from the first consultation to the final delivery, we show up completely for you.',
    image: '/icons/commitment.png',
    alt: 'Commitment icon',
  },
  {
    label: 'Creativity',
    description:
      'We approach every frame with a fresh eye — blending light, motion, and emotion into images that feel timeless and alive.',
    image: '/icons/creative-thinking.png',
    alt: 'Creative thinking icon',
  },
  {
    label: 'Passion',
    description:
      'Photography is not just our profession — it is our calling. That love for the craft pours into every shot we take for you.',
    image: '/icons/motivation.png',
    alt: 'Motivation and passion icon',
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
        {reasons.map(({ label, description, image, alt }, i) => (
          <div key={label} className={`${styles.card} reveal reveal-delay-${i + 1}`}>
            <div className={styles.imgWrap}>
              <Image src={image} alt={alt} fill className={styles.img} sizes="300px" />
            </div>
            <h3 className={styles.label}>{label}</h3>
            <p className={styles.desc}>{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
