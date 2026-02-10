import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPlaiceholder } from 'plaiceholder'
import path from 'path'
import fs from 'fs/promises'

/**
 * Generates a blur data URL for an image.
 * Used as placeholder while full image loads.
 * Called by getBase64Cached; avoid calling directly in hot paths to prevent memory spikes.
 *
 * @param imageUrl - Full URL or path to image (/Images/... or https://...)
 * @returns Base64-encoded blur placeholder or undefined if fails
 */
export async function getBase64(imageUrl: string): Promise<string | undefined> {
  try {
    let buffer: Buffer
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const res = await fetch(imageUrl)
      if (!res.ok) {
        console.warn(`Failed to fetch image for blur: ${imageUrl}`)
        return undefined
      }
      const arrayBuffer = await res.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else {
      const filePath = path.join(process.cwd(), 'public', imageUrl)
      buffer = await fs.readFile(filePath)
    }
    const { base64 } = await getPlaiceholder(buffer)
    return base64
  } catch (error) {
    console.error(`Error generating blur placeholder for ${imageUrl}:`, error)
    return undefined
  }
}

const BLUR_CACHE_TAG = 'blur-placeholders'
const BLUR_REVALIDATE_SECONDS = 86400 // 24h; product images change rarely

/**
 * Cached blur for a single image. Reduces memory pressure by avoiding repeated
 * full-image reads and plaiceholder runs on every request.
 */
async function getBase64Cached(imageUrl: string): Promise<string | undefined> {
  return unstable_cache(
    async () => getBase64(imageUrl),
    [BLUR_CACHE_TAG, imageUrl],
    { revalidate: BLUR_REVALIDATE_SECONDS, tags: [BLUR_CACHE_TAG] }
  )()
}

/**
 * Processes array of items with image property to add blur placeholders.
 * Processes images SEQUENTIALLY to avoid OOM on 512MB instances (Render);
 * uses cached blur data when available.
 * Use in server components or getStaticProps.
 *
 * @param items - Array of objects with image (or imageUrl) property
 * @returns Items with added blurDataURL property
 */
export async function addBlurPlaceholders<
  T extends { image: string } | { imageUrl: string },
>(items: T[]): Promise<(T & { blurDataURL?: string })[]> {
  const result: (T & { blurDataURL?: string })[] = []
  for (const item of items) {
    const img = 'image' in item ? item.image : item.imageUrl
    const blurDataURL = await getBase64Cached(img)
    result.push({ ...item, blurDataURL })
  }
  return result
}
