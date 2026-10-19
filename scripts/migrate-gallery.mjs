// One-time migration: uploads the static gallery photos to Neon Object Storage
// and records them in the gallery_images table.
//   node --env-file=.env.local scripts/migrate-gallery.mjs
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Previous GALLERY_ITEMS from src/lib/data.ts, in display order
const ITEMS = [
  ['1.jpg', 'Wedding couple bridal portrait', 'Bridal Portrait'],
  ['5.jpg', 'Wedding floral detail arrangement', 'Floral Details'],
  ['11.jpg', 'Bride in silk saree under warm window light', 'Window Light'],
  ['9.jpg', 'Fine wedding detail decor', 'Fine Details'],
  ['12.jpg', 'Bride portrait in a circular spotlight', 'Spotlight'],
  ['7.jpg', 'Golden hour wedding portrait', 'Golden Hour'],
  ['4.jpg', 'Candid couple portrait moments', 'Candid Moments'],
  ['2.jpg', 'Wedding ceremony sacred vows', 'Sacred Vows'],
  ['10.jpg', 'Wedding celebration moments', 'Celebration'],
  ['6.jpg', 'Pre-wedding outdoor shoot', 'Pre-Wedding'],
  ['13.jpg', 'Black and white dramatic bridal portrait', 'Light & Shadow'],
  ['3.jpg', 'Wedding reception evening celebration', 'Reception Evening'],
]

for (const name of ['DATABASE_URL', 'AWS_ENDPOINT_URL_S3', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'GALLERY_BUCKET']) {
  if (!process.env[name]) {
    console.error(`Missing env var ${name}`)
    process.exit(1)
  }
}

const sql = neon(process.env.DATABASE_URL)
const s3 = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION,
  forcePathStyle: true,
})
const bucket = process.env.GALLERY_BUCKET

await sql.query(await readFile(path.join(root, 'scripts', 'gallery-schema.sql'), 'utf8'))

const [{ count }] = await sql`select count(*)::int as count from gallery_images`
if (count > 0) {
  console.log(`gallery_images already has ${count} rows — nothing to do.`)
  process.exit(0)
}

for (const [index, [file, alt, label]] of ITEMS.entries()) {
  const input = await readFile(path.join(root, 'public', 'images', file))
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer({ resolveWithObject: true })

  const key = `img/${randomUUID()}.jpg`
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentType: 'image/jpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }))
  await sql`
    insert into gallery_images (key, alt, label, width, height, sort_order)
    values (${key}, ${alt}, ${label}, ${info.width}, ${info.height}, ${index})`
  console.log(`✓ ${file} → ${key} (${info.width}×${info.height})`)
}

console.log(`Migrated ${ITEMS.length} images.`)
