import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Include private-images in the deployment bundle (Vercel / serverless)
  outputFileTracingIncludes: {
    '/api/image/[name]': ['./private-images/**/*'],
  },

  // Security headers for all pages
  async headers() {
    return [
      {
        source: '/api/image/:name*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store, no-cache, must-revalidate' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}

export default nextConfig
