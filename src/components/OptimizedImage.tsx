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

  // Fallback: image not in manifest (e.g. remote URLs like Unsplash) — use Next.js Image
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

  // Build responsive srcsets for AVIF and WebP — browser picks correct size by viewport
  const avifSrcSet = [
    imageData.sizes['-sm']?.avif && `${imageData.sizes['-sm'].avif} 384w`,
    imageData.sizes['-md']?.avif && `${imageData.sizes['-md'].avif} 640w`,
    imageData.sizes['-lg']?.avif && `${imageData.sizes['-lg'].avif} 1080w`,
    imageData.sizes['-xl']?.avif && `${imageData.sizes['-xl'].avif} 1920w`,
  ].filter(Boolean).join(', ')

  const webpSrcSet = [
    imageData.sizes['-sm']?.webp && `${imageData.sizes['-sm'].webp} 384w`,
    imageData.sizes['-md']?.webp && `${imageData.sizes['-md'].webp} 640w`,
    imageData.sizes['-lg']?.webp && `${imageData.sizes['-lg'].webp} 1080w`,
    imageData.sizes['-xl']?.webp && `${imageData.sizes['-xl'].webp} 1920w`,
  ].filter(Boolean).join(', ')

  const fallbackSrc = imageData.sizes['-md']?.webp ?? imageData.sizes['-lg']?.webp ?? imageData.original

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
        style={
          fill
            ? { position: 'absolute', inset: 0 }
            : { width, height }
        }
      >
        <span className="px-4 text-center text-sm text-gray-500">{alt}</span>
      </div>
    )
  }

  const containerStyle: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    : { width, height }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    opacity: loadState === 'loaded' ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  }

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      {blurDataURL && loadState === 'loading' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${blurDataURL}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden
        />
      )}

      <picture key={retryCount} className="absolute inset-0 block w-full h-full">
        {avifSrcSet && (
          <source type="image/avif" srcSet={avifSrcSet} sizes={sizes ?? '100vw'} />
        )}
        {webpSrcSet && (
          <source type="image/webp" srcSet={webpSrcSet} sizes={sizes ?? '100vw'} />
        )}
        <img
          src={fallbackSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full"
        />
      </picture>

      {loadState === 'loading' && (
        <div
          className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          style={{ backgroundSize: '200% 100%' }}
          aria-hidden
        />
      )}
    </div>
  )
}
