import styles from './Services.module.css'

// Server Component — CSS-only hover interactions, no JS needed
export default function Services() {
  return (
    <section id="services" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <p className={`section-label reveal ${styles.label}`}>What We Offer</p>
        <h2 className={`section-title reveal reveal-delay-1 ${styles.heading}`}>
          Every frame,<br />a <em>masterpiece</em>
        </h2>
        <p className={`${styles.sub} reveal reveal-delay-2`}>
          From sacred vows to candid laughter — we craft visual stories that outlive the moment.
        </p>
      </div>

      {/* Bento grid */}
      <div className={styles.grid}>

        {/* Row 1 — two featured hero cards */}
        <div className={`${styles.card} ${styles.cardFeatured} reveal`}>
          <span className={styles.cardNum}>01</span>
          <div className={styles.cardBg} style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(201,169,110,0.12) 0%, transparent 70%)' }} />
          <div className={styles.cardContent}>
            <h3 className={styles.cardName}>Wedding<br />Photography</h3>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Timeless imagery crafted with elegance and depth. Every grand moment and intimate glance
              documented with a refined, storytelling eye — a collection as beautiful as the day itself.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Photography</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardFeatured} ${styles.cardDark} reveal reveal-delay-1`}>
          <span className={styles.cardNum}>02</span>
          <div className={styles.cardBg} style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(201,169,110,0.1) 0%, transparent 70%)' }} />
          <div className={styles.cardContent}>
            <h3 className={styles.cardName}>Cinematic<br />Films</h3>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Your love story transformed into a visually stunning film. Carefully composed frames,
              emotive storytelling, and curated soundtracks — every second designed to move you.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Videography</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        {/* Row 2 — three medium cards */}
        <div className={`${styles.card} ${styles.cardMedium} reveal`}>
          <span className={styles.cardNum}>03</span>
          <div className={styles.cardContent}>
            <h3 className={styles.cardName}>Pre-Wedding<br />Shoots</h3>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Sophisticated portraits in carefully chosen locations — a natural, personal prelude to your wedding story.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Portrait</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardMedium} ${styles.cardDark} reveal reveal-delay-1`}>
          <span className={styles.cardNum}>04</span>
          <div className={styles.cardContent}>
            <h3 className={styles.cardName}>Post-Wedding<br />Shoots</h3>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              No time constraints. Pure artistry. Refined compositions that feel effortlessly timeless and beautifully curated.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Portrait</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardMedium} reveal reveal-delay-2`}>
          <span className={styles.cardNum}>05</span>
          <div className={styles.cardContent}>
            <h3 className={styles.cardName}>Birthday<br />Parties</h3>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Energy, emotion, celebration — captured with a polished storytelling approach and precise attention to every detail.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Events</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        {/* Row 3 — wide card + narrow card */}
        <div className={`${styles.card} ${styles.cardWide} ${styles.cardDark} reveal`}>
          <span className={styles.cardNum}>06</span>
          <div className={styles.cardBg} style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.08) 0%, transparent 60%)' }} />
          <div className={styles.cardContent}>
            <h3 className={styles.cardName}>Corporate<br />Events</h3>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Professionalism meets visual artistry. Brand-forward coverage that reflects your organisation's identity
              with clarity, confidence, and a polished edge that commands attention.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Corporate</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardNarrow} reveal reveal-delay-1`}>
          <span className={styles.cardNum}>07</span>
          <div className={styles.cardContent}>
            <h3 className={styles.cardName}>Other<br />Events</h3>
            <div className={styles.cardDivider} />
            <p className={styles.cardDesc}>
              Intimate gatherings to grand celebrations — covered with the same precision and creative excellence.
            </p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Events</span>
            <span className={styles.cardArrow}>↗</span>
          </div>
        </div>

      </div>

      {/* Bottom CTA bar */}
      <div className={`${styles.cta} reveal`}>
        <p className={styles.ctaText}>
          Not sure which package fits?
        </p>
        <a href="#contact" className="btn-primary">Let&apos;s talk</a>
      </div>
    </section>
  )
}
