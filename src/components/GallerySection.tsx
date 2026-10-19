import Gallery from './Gallery'
import { getGalleryItems, type GalleryItem } from '@/lib/gallery'

// Server wrapper: loads gallery photos from Neon, renders the interactive client grid
export default async function GallerySection() {
  let items: GalleryItem[] = []
  try {
    items = await getGalleryItems()
  } catch (err) {
    console.error('Failed to load gallery images:', err)
  }
  return <Gallery items={items} />
}
