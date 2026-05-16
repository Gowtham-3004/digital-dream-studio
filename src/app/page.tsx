import Cursor         from '@/components/Cursor'
import Navbar         from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Hero           from '@/components/Hero'
import MarqueeSection from '@/components/MarqueeSection'
import Stats          from '@/components/Stats'
import Gallery        from '@/components/Gallery'
import Services       from '@/components/Services'
import About          from '@/components/About'
import Reasons        from '@/components/Reasons'
import Testimonials   from '@/components/Testimonials'
import Contact        from '@/components/Contact'
import Footer         from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'

// Server-rendered page — client interactivity isolated to leaf components
export default function Home() {
  return (
    <>
      {/* Fixed chrome */}
      <ScrollProgress />
      <Cursor />
      <RevealObserver />
      <Navbar />

      <main>
        <Hero />
        <MarqueeSection />
        <Stats />
        <Gallery />
        <Services />
        <About />
        <Reasons />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
