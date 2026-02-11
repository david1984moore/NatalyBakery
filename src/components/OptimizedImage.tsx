'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import imageManifest from '@/data/image-blur-data.json'

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
  /** Fallback blur when image is not in manifest (e.g. remote URLs) — unused; kept for API compatibility */
  blurDataURL?: string
  /** Override transition duration (e.g. '400ms' for hero). Default: priority 400ms, else 200ms. */
  transitionDuration?: string
  /** Override transition easing. Default: Material standard. */
  transitionEasing?: string
  /** If set (e.g. "hero"), emit performance marks for validation: {id}-blur-render, -request, -decode-done, -visible */
  markTimeline?: string
}

type ImageManifest = Record<
  string,
  {
    original: string
    sizes: Record<string, Record<string, string>>
    blur: string | null
    width?: number
    height?: number
    dominantColor?: string
  }
>

/** Neutral placeholder when no blur data (e.g. non-manifest URLs). */
const PLACEHOLDER_BG = 'bg-warmgray-100'

/** Material Design standard — natural deceleration for image reveal. */
const IMAGE_REVEAL_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'
/** Hero / above-fold: deliberate, smooth reveal. */
const PRIORITY_DURATION_MS = 400
/** Thumbnails / below-fold: quick, imperceptible. */
const DEFAULT_DURATION_MS = 200

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
  transitionDuration: durationProp,
  transitionEasing: easingProp,
  markTimeline,
}: OptimizedImageProps) {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [retryCount, setRetryCount] = useState(0)
  const decodeStarted = useRef(false)
  const markedVisible = useRef(false)
  const loadedReported = useRef(false)

  const filename = src.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
  const manifest = imageManifest as ImageManifest
  const imageData = manifest[filename]

  const revealDurationMs = durationProp ?? (priority ? PRIORITY_DURATION_MS : DEFAULT_DURATION_MS)
  const revealEasing = easingProp ?? IMAGE_REVEAL_EASING
  const durationMs =
    typeof revealDurationMs === 'number'
      ? revealDurationMs
      : parseInt(String(revealDurationMs).replace(/\D/g, ''), 10) || 300

  // Fallback: image not in manifest (e.g. remote URLs) — use Next.js Image with same graceful reveal
  if (!imageData) {
    const containerStyle: React.CSSProperties = fill
      ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
      : { width, height }
    return (
      <div className={`relative ${PLACEHOLDER_BG} ${className}`} style={containerStyle}>
        <div
          className="absolute inset-0"
          style={{
            opacity: loadState === 'loaded' ? 1 : 0,
            transition: `opacity ${durationMs}ms ${revealEasing}`,
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill={fill}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            priority={priority}
            className="w-full h-full"
            style={{ objectFit }}
            sizes={sizes ?? '100vw'}
            placeholder="empty"
            onLoad={() => requestAnimationFrame(() => setLoadState('loaded'))}
          />
        </div>
      </div>
    )
  }

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

  // Reset decode flag and loaded report on retry so we can run decode again
  useEffect(() => {
    decodeStarted.current = false
    loadedReported.current = false
  }, [retryCount])

  // Single path to "loaded": defer to next frame so placeholder paints once (avoids cached-load jitter)
  const setLoadedGracefully = () => {
    if (loadedReported.current) return
    loadedReported.current = true
    requestAnimationFrame(() => {
      setLoadState('loaded')
    })
  }

  // Timeline mark: blur is shown (for validation protocol)
  useEffect(() => {
    if (typeof window === 'undefined' || !markTimeline || !imageData?.blur || loadState !== 'loading') return
    performance.mark(`${markTimeline}-blur-render`)
  }, [markTimeline, imageData?.blur, loadState])

  // Decode before transition: preload same URL, await decode(), then reveal (avoids decode jank)
  useEffect(() => {
    if (typeof window === 'undefined' || !imageData || decodeStarted.current || loadState !== 'loading') return
    decodeStarted.current = true
    if (markTimeline) performance.mark(`${markTimeline}-request`)
    const img = new window.Image()
    img.decoding = 'async'
    img.src = fallbackSrc
    img
      .decode()
      .then(() => {
        if (markTimeline) performance.mark(`${markTimeline}-decode-done`)
        setLoadedGracefully()
      })
      .catch(() => {
        // Decode failed (e.g. CORS); picture onLoad will still fire
      })
  }, [imageData, fallbackSrc, loadState, markTimeline])

  // Timeline mark: transition ended, image fully visible
  useEffect(() => {
    if (typeof window === 'undefined' || !markTimeline || loadState !== 'loaded' || markedVisible.current) return
    markedVisible.current = true
    const t = setTimeout(() => {
      performance.mark(`${markTimeline}-visible`)
    }, durationMs)
    return () => clearTimeout(t)
  }, [markTimeline, loadState, durationMs])

  const handleLoad = () => setLoadedGracefully()
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
        className={`flex items-center justify-center bg-warmgray-200 ${className}`}
        style={
          fill
            ? { position: 'absolute', inset: 0 }
            : { width, height }
        }
      >
        <span className="px-4 text-center text-sm text-warmgray-600">{alt}</span>
      </div>
    )
  }

  const containerStyle: React.CSSProperties = {
    ...(fill
      ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
      : { width, height }),
    ...(!fill &&
      imageData.width != null &&
      imageData.height != null &&
      imageData.width > 0 &&
      imageData.height > 0 && {
        aspectRatio: `${imageData.width} / ${imageData.height}`,
      }),
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    opacity: loadState === 'loaded' ? 1 : 0,
    transition: `opacity ${durationMs}ms ${revealEasing}`,
    willChange: loadState === 'loading' ? 'opacity' : 'auto',
  }

  const isLoaded = loadState === 'loaded'
  const blurPlaceholderStyle: React.CSSProperties = imageData.blur
    ? {
        backgroundImage: `url("${imageData.blur}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(40px) saturate(1.2)',
        transform: 'scale(1.1)',
        opacity: isLoaded ? 0 : 1,
        transition: `opacity ${durationMs}ms ${revealEasing}`,
        willChange: loadState === 'loading' ? 'opacity' : 'auto',
        pointerEvents: 'none',
      }
    : {}

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      {/* Blur placeholder: crossfades out with image fade-in (no unmount = no jitter when cached) */}
      {imageData.blur && (
        <div
          className="absolute inset-0"
          aria-hidden
          style={blurPlaceholderStyle}
        />
      )}
      {/* Neutral fallback when no blur data */}
      {!imageData.blur && loadState === 'loading' && (
        <div className={`absolute inset-0 ${PLACEHOLDER_BG}`} aria-hidden />
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
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full"
        />
      </picture>
    </div>
  )
}
