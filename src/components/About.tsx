import Image from 'next/image'
import styles from './About.module.css'

// Server Component — static content
export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        {/* Image stack */}
        <div className={`${styles.imgStack} reveal`}>
          <Image
            src="/images/9.jpg"
            alt="Digital Dream Studios team photographing a wedding"
            width={600}
            height={800}
            className={styles.imgMain}
            sizes="(max-width: 900px) 100vw, 45vw"
          />
          <Image
            src="/images/10.jpg"
            alt="Behind the scenes at a wedding shoot"
            width={400}
            height={400}
            className={styles.imgAccent}
            sizes="(max-width: 900px) 0vw, 25vw"
          />
        </div>

        {/* Text */}
        <div>
          <p className="section-label reveal">Our Story</p>
          <h2 className={`section-title reveal reveal-delay-1`}>
            We are<br /><em>dreamers</em><br />with cameras
          </h2>
          <blockquote className={`${styles.quote} reveal reveal-delay-2`}>
            "Capturing the moments of today that will last a lifetime."
          </blockquote>
          <p className={`${styles.text} reveal reveal-delay-3`}>
            Digital Dream Studios was born from a single belief — that love deserves to be documented
            with as much care and artistry as it is felt. We are a collective of visual storytellers
            who believe weddings are the greatest human stories ever told.
          </p>
          <p className={`${styles.text} reveal reveal-delay-4`}>
            Our team brings together cinematographers, photographers, and editors who are obsessive
            about light, emotion, and narrative. We blend into your day, so every frame is authentic
            — never posed, always true.
          </p>
          <a href="#contact" className={`btn-primary reveal ${styles.cta}`}>
            Work With Us
          </a>
        </div>
      </div>
    </section>
  )
}
