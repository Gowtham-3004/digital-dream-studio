import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Digital Dream Studios — We Make Your Memories Special',
    template: '%s | Digital Dream Studios',
  },
  description:
    'Premium wedding photography and cinematic films across India. Capturing love stories with elegance and depth. Pre-wedding shoots, destination weddings, and traditional ceremonies. Book your session today.',
  keywords: [
    'wedding photography',
    'wedding cinematography',
    'cinematic wedding films',
    'pre-wedding shoots',
    'destination wedding',
    'Chennai wedding photographer',
    'India wedding photographer',
    'Tamil Nadu wedding photography',
    'bridal photography',
    'candid wedding photography',
    'Wedding photography in Adyar', 
    'besant Nagar', 
    'Thiruvanmiyur'
  ],
  authors: [{ name: 'Digital Dream Studios' }],
  creator: 'Digital Dream Studios',
  publisher: 'Digital Dream Studios',
  metadataBase: new URL('https://digitaldreamstudios.in'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://digitaldreamstudios.in',
    siteName: 'Digital Dream Studios',
    title: 'Digital Dream Studios — We Make Your Memories Special',
    description:
      'Premium wedding photography and cinematic films across India. Capturing love stories with elegance and depth. Pre-wedding shoots, destination weddings, and traditional ceremonies. Book your session today.',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Digital Dream Studios — Premium Wedding Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Dream Studios — We Make Your Memories Special',
    description:
      'Premium wedding photography and cinematic films across India. Capturing love stories with elegance and depth. Pre-wedding shoots, destination weddings, and traditional ceremonies. Book your session today.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://digitaldreamstudios.in/#business',
  name: 'Digital Dream Studios',
  description:
    'Premium wedding photography and cinematic films across India. Capturing love stories with elegance and depth.',
  url: 'https://digitaldreamstudios.in',
  telephone: '+919841021625',
  email: 'hello@digitaldreamstudios.in',
  logo: {
    '@type': 'ImageObject',
    url: 'https://digitaldreamstudios.in/logo.jpg',
  },
  image: 'https://digitaldreamstudios.in/logo.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '45/68 Kamarajar Street, Lakshmipuram, Thiruvanmiyur',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    postalCode: '600041',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.9977,
    longitude: 80.2599,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '09:00',
    closes: '21:00',
  },
  sameAs: ['https://www.instagram.com/digitaldreamstudios'],
  priceRange: '₹₹₹',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    ratingCount: '150',
    bestRating: '5',
    worstRating: '1',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Photography Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wedding Photography' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cinematic Wedding Films' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pre-Wedding Shoots' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Post-Wedding Shoots' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Birthday Parties' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Events' } },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Prevent image saving/downloading */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            function blockImg(e){ if(e.target.tagName==='IMG') e.preventDefault(); }
            document.addEventListener('contextmenu', blockImg);
            document.addEventListener('dragstart',   blockImg);
          })();
        `}} />
      </head>
      <body>
        {children}
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GTM-5KCDKFS5"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GTM-5KCDKFS5');
        `}</Script>
        <Script id="clarity-init" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "wslwrrq0s0");
        `}</Script>
      </body>
    </html>
  )
}
