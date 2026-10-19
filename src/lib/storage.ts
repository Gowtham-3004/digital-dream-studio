import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// Neon Object Storage (private bucket) — S3-compatible, path-style addressing only
let client: S3Client | null = null

function s3(): S3Client {
  if (!client) {
    client = new S3Client({
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      region: process.env.AWS_REGION,
      forcePathStyle: true,
    })
  }
  return client
}

function bucket(): string {
  const name = process.env.GALLERY_BUCKET
  if (!name) throw new Error('GALLERY_BUCKET is not set')
  return name
}

export async function putImage(key: string, body: Buffer): Promise<void> {
  await s3().send(new PutObjectCommand({
    Bucket: bucket(),
    Key: key,
    Body: body,
    ContentType: 'image/jpeg',
    // Keys are random UUIDs and never reused, so caching forever is safe
    CacheControl: 'public, max-age=31536000, immutable',
  }))
}

export async function deleteImage(key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }))
}

/** Returns the image as a web stream, or null if the object doesn't exist */
export async function getImage(key: string): Promise<ReadableStream | null> {
  try {
    const res = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }))
    return res.Body?.transformToWebStream() ?? null
  } catch (err) {
    if ((err as { name?: string }).name === 'NoSuchKey') return null
    throw err
  }
}

const IMAGE_PREFIX = 'img/'
const IMAGE_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$/

/** Maps a public image name back to its object key; null for anything that isn't a generated name */
export function keyFromImageName(name: string): string | null {
  return IMAGE_NAME.test(name) ? IMAGE_PREFIX + name : null
}

/** Same-origin URL served by /api/image/[name] — the bucket itself is never exposed */
export function imageUrl(key: string): string {
  return `/api/image/${key.slice(IMAGE_PREFIX.length)}`
}
