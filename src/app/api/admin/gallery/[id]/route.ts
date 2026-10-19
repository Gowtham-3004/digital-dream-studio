import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { deleteImageRow, updateImage, MAX_TEXT } from '@/lib/gallery'
import { deleteImage } from '@/lib/storage'

export const runtime = 'nodejs'

type Params = { params: Promise<{ id: string }> }

const parseId = (raw: string): number | null => (/^\d+$/.test(raw) ? Number(raw) : null)

export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const id = parseId((await params).id)
  if (id === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await req.json().catch(() => null)
  if (typeof body?.alt !== 'string' || typeof body?.label !== 'string') {
    return NextResponse.json({ error: 'alt and label are required strings' }, { status: 400 })
  }

  try {
    const found = await updateImage(id, {
      alt: body.alt.trim().slice(0, MAX_TEXT),
      label: body.label.trim().slice(0, MAX_TEXT),
    })
    return found
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (err) {
    console.error('Failed to update gallery image:', err)
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const id = parseId((await params).id)
  if (id === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    const key = await deleteImageRow(id)
    if (!key) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    // Row is gone first so the site stops showing it even if the object delete fails
    await deleteImage(key).catch(err => console.error('Orphaned gallery object', key, err))
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Failed to delete gallery image:', err)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
