import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

  // Strict filename validation — no path traversal, only known extensions
  if (!/^[\w-]+\.(jpg|jpeg|png|webp)$/i.test(name)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const ext = path.extname(name).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Block requests that don't come from this site (hotlinking / direct URL access)
  const referer = request.headers.get('referer') ?? ''
  const host = request.headers.get('host') ?? ''
  const origin = request.headers.get('origin') ?? ''
  const sameHost =
    referer.includes(host) ||
    origin.includes(host) ||
    process.env.NODE_ENV === 'development'

  if (!sameHost) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const imagePath = path.join(process.cwd(), 'private-images', name)
    const data = await readFile(imagePath)

    return new NextResponse(data, {
      headers: {
        'Content-Type': CONTENT_TYPES[ext] ?? 'image/jpeg',
        'Cache-Control': 'private, no-store, no-cache, must-revalidate',
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Pragma': 'no-cache',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}
