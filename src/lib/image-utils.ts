/**
 * Minimal blur placeholder for image loading - reduces perceived load time.
 * 10x10 gray pixel, base64 JPEG (~100 bytes).
 */
export const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwA/8AAI/9k='

/**
 * Builds the Next.js Image Optimization API URL for a given src.
 * Use this for contexts that can't use next/image (e.g. lightbox) so the
 * browser receives resized, WebP/AVIF images instead of raw files.
 * @param src - Image path (e.g. /Images/hero.jpeg) or absolute URL
 * @param width - Requested width in px (server will resize)
 * @param quality - 1–100 (must be in next.config.js images.qualities if set)
 */
export function getOptimizedImageUrl(
  src: string,
  width: number = 1920,
  quality: number = 75
): string {
  const params = new URLSearchParams()
  params.set('url', src)
  params.set('w', String(width))
  params.set('q', String(quality))
  return `/_next/image?${params.toString()}`
}
