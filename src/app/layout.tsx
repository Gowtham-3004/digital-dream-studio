import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
      'Premium wedding photography and cinematic films across India. Capturing love stories with elegance and depth.',
    images: [
      {
        url: '/og-image.jpg',
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
      'Premium wedding photography and cinematic films across India.',
    images: ['/og-image.jpg'],
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
  image: 'https://digitaldreamstudios.in/og-image.jpg',
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
      </body>
    </html>
  )
}
