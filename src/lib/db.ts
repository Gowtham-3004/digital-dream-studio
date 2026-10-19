import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

let client: NeonQueryFunction<false, false> | null = null

// Lazily created so builds without DATABASE_URL don't fail at import time
export function db(): NeonQueryFunction<false, false> {
  if (!client) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is not set')
    client = neon(url)
  }
  return client
}
