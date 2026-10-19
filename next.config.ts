import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Gallery photos proxied from the private Neon bucket
  async headers() {
    return [
      {
        source: '/api/image/:name*',
        headers: [
          // Names are random UUIDs and never reused; the CDN keeps a copy for 7 days
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=604800, immutable' },
          // Blocks other sites from embedding the photos
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}

export default nextConfig
