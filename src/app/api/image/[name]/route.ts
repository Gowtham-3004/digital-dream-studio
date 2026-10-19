import { NextRequest, NextResponse } from 'next/server'
import { getImage, keyFromImageName } from '@/lib/storage'

export const runtime = 'nodejs'

type Params = { params: Promise<{ name: string }> }

// Streams gallery photos from the private bucket; cache/CORP headers come from next.config.ts
export async function GET(_req: NextRequest, { params }: Params) {
  const key = keyFromImageName((await params).name)
  if (!key) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const body = await getImage(key)
    if (!body) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return new Response(body, { headers: { 'Content-Type': 'image/jpeg' } })
  } catch (err) {
    console.error('Failed to read gallery image', key, err)
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 })
  }
}
