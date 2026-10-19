import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { insertImage, listAdminImages, processImage, MAX_TEXT } from '@/lib/gallery'
import { putImage } from '@/lib/storage'

export const runtime = 'nodejs'

const MAX_BYTES = 4 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req)
  if (denied) return denied

  try {
    return NextResponse.json(await listAdminImages())
  } catch (err) {
    console.error('Failed to list gallery images:', err)
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG or WebP images are allowed' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File is larger than 4 MB' }, { status: 413 })
  }

  const alt = String(form?.get('alt') ?? '').trim().slice(0, MAX_TEXT)
  const label = String(form?.get('label') ?? '').trim().slice(0, MAX_TEXT)

  let processed
  try {
    processed = await processImage(Buffer.from(await file.arrayBuffer()))
  } catch {
    return NextResponse.json({ error: 'File is not a readable image' }, { status: 400 })
  }

  try {
    const key = `img/${randomUUID()}.jpg`
    await putImage(key, processed.data)
    const image = await insertImage({ key, alt, label, width: processed.width, height: processed.height })
    return NextResponse.json(image, { status: 201 })
  } catch (err) {
    console.error('Failed to store gallery image:', err)
    return NextResponse.json({ error: 'Failed to store image' }, { status: 500 })
  }
}
