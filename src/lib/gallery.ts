import { unstable_cache, revalidateTag } from 'next/cache'
import sharp from 'sharp'
import { db } from './db'
import { imageUrl } from './storage'

export type GalleryItem = {
  src: string
  alt: string
  label: string
  /** Intrinsic pixel size — drives the tile's aspect ratio so photos are never cropped */
  width: number
  height: number
}

export type GalleryRow = {
  id: number
  key: string
  alt: string
  label: string
  width: number
  height: number
  sort_order: number
}

export type AdminGalleryImage = GalleryRow & { src: string }

const TAG = 'gallery'

export const MAX_TEXT = 200

/** Normalise any upload to a ≤2560px, EXIF-stripped JPEG */
export async function processImage(input: Buffer): Promise<{ data: Buffer; width: number; height: number }> {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

async function listRows(): Promise<GalleryRow[]> {
  const rows = await db()`
    select id, key, alt, label, width, height, sort_order
    from gallery_images
    order by sort_order, id`
  return rows as GalleryRow[]
}

export const getGalleryItems = unstable_cache(
  async (): Promise<GalleryItem[]> =>
    (await listRows()).map(r => ({
      src: imageUrl(r.key),
      alt: r.alt,
      label: r.label,
      width: r.width,
      height: r.height,
    })),
  [TAG],
  { tags: [TAG] },
)

export async function listAdminImages(): Promise<AdminGalleryImage[]> {
  return (await listRows()).map(r => ({ ...r, src: imageUrl(r.key) }))
}

export async function insertImage(img: Omit<GalleryRow, 'id' | 'sort_order'>): Promise<AdminGalleryImage> {
  const [row] = await db()`
    insert into gallery_images (key, alt, label, width, height, sort_order)
    values (${img.key}, ${img.alt}, ${img.label}, ${img.width}, ${img.height},
            (select coalesce(max(sort_order), -1) + 1 from gallery_images))
    returning id, key, alt, label, width, height, sort_order`
  revalidateTag(TAG)
  const r = row as GalleryRow
  return { ...r, src: imageUrl(r.key) }
}

export async function updateImage(id: number, fields: { alt: string; label: string }): Promise<boolean> {
  const rows = await db()`
    update gallery_images set alt = ${fields.alt}, label = ${fields.label}
    where id = ${id} returning id`
  revalidateTag(TAG)
  return rows.length > 0
}

/** Removes the row and returns its object key so the caller can delete the file */
export async function deleteImageRow(id: number): Promise<string | null> {
  const rows = await db()`delete from gallery_images where id = ${id} returning key`
  revalidateTag(TAG)
  return rows.length ? (rows[0] as { key: string }).key : null
}

export async function reorder(ids: number[]): Promise<void> {
  const sql = db()
  await sql.transaction(ids.map((id, i) => sql`update gallery_images set sort_order = ${i} where id = ${id}`))
  revalidateTag(TAG)
}
