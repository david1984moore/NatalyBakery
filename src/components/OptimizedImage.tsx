'use client'

import Image from 'next/image'
import { useState } from 'react'
import imageManifest from '@/data/image-blur-data.json'
import { BLUR_DATA_URL } from '@/lib/image-utils'

export interface OptimizedImageProps {
  /** Original path or filename (e.g. /Images/IMG_7616.jpeg or IMG_7616.jpeg) */
  src: string
  alt: string
  priority?: boolean
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  objectFit?: 'contain' | 'cover'
  /** Fallback blur when image is not in manifest (e.g. remote URLs) */
  blurDataURL?: string
}

type ImageManifest = Record<
  string,
  { original: string; sizes: Record<string, Record<string, string>>; blur: string | null }
>

export function OptimizedImage({
  src,
  alt,
  priority = false,
  className = '',
  fill = false,
  width,
  height,
  sizes,
  objectFit = 'cover',
  blurDataURL: blurDataURLProp,
}: OptimizedImageProps) {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [retryCount, setRetryCount] = useState(0)

  const filename = src.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
  const manifest = imageManifest as ImageManifest
  const imageData = manifest[filename]

  if (!imageData) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        className={className}
        style={{ objectFit }}
        sizes={sizes ?? '100vw'}
        placeholder="blur"
        blurDataURL={blurDataURLProp ?? BLUR_DATA_URL}
      />
    )
  }

  const blurDataURL = imageData.blur ?? undefined
  const defaultSrc =
    imageData.sizes['-xl']?.webp ?? imageData.sizes['-lg']?.webp ?? src

  const handleLoad = () => setLoadState('loaded')
  const handleError = () => {
    if (retryCount < 2) {
      setTimeout(() => setRetryCount((prev) => prev + 1), 1000)
    } else {
      setLoadState('error')
    }
  }

  if (loadState === 'error') {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <span className="px-4 text-center text-sm text-gray-500">{alt}</span>
      </div>
    )
  }

  return (
    <>
      <Image
        key={retryCount}
        src={defaultSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        quality={75}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        className={className}
        style={{
          objectFit,
          opacity: loadState === 'loaded' ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        sizes={sizes ?? '100vw'}
        onLoad={handleLoad}
        onError={handleError}
      />
      {loadState === 'loading' && (
        <div
          className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          style={{ backgroundSize: '200% 100%' }}
          aria-hidden
        />
      )}
    </>
  )
}
