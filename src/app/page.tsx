import Cursor         from '@/components/Cursor'
import Navbar         from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import BackToTop      from '@/components/BackToTop'
import Hero           from '@/components/Hero'
import MarqueeSection from '@/components/MarqueeSection'
import Stats          from '@/components/Stats'
import GallerySection from '@/components/GallerySection'
import Services       from '@/components/Services'
import About          from '@/components/About'
import Reasons        from '@/components/Reasons'
import Testimonials   from '@/components/Testimonials'
import Contact        from '@/components/Contact'
import Footer         from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'

// Gallery updates revalidate via the 'gallery' tag; this is a fallback if a build couldn't reach the DB
export const revalidate = 3600

// Server-rendered page — client interactivity isolated to leaf components
export default function Home() {
  return (
    <>
      {/* Fixed chrome */}
      <ScrollProgress />
      <Cursor />
      <RevealObserver />
      <Navbar />
      <BackToTop />

      <main>
        <Hero />
        <MarqueeSection />
        <div className="ornamentDivider" aria-hidden="true"><span>◆</span></div>
        <Stats />
        <GallerySection />
        <div className="ornamentDivider" aria-hidden="true"><span>◆</span></div>
        <Services />
        <About />
        <div className="ornamentDivider" aria-hidden="true"><span>◆</span></div>
        <Reasons />
        <Testimonials />
        <div className="ornamentDivider" aria-hidden="true"><span>◆</span></div>
        <Contact />
      </main>

      <Footer />
    </>
  )
}
