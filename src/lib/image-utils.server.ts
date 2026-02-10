import 'server-only'
import { getPlaiceholder } from 'plaiceholder'
import path from 'path'
import fs from 'fs/promises'

/**
 * Generates a blur data URL for an image.
 * Used as placeholder while full image loads.
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

/**
 * Processes array of items with image property to add blur placeholders.
 * Use in server components or getStaticProps.
 *
 * @param items - Array of objects with image (or imageUrl) property
 * @returns Items with added blurDataURL property
 */
export async function addBlurPlaceholders<
  T extends { image: string } | { imageUrl: string },
>(items: T[]): Promise<(T & { blurDataURL?: string })[]> {
  return Promise.all(
    items.map(async (item) => {
      const img = 'image' in item ? item.image : item.imageUrl
      return {
        ...item,
        blurDataURL: await getBase64(img),
      }
    })
  )
}
