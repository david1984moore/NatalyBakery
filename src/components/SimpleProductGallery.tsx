'use client'

import { useState, useCallback } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { getOptimizedImageUrl } from '@/lib/image-utils'
import imageManifest from '@/data/image-blur-data.json'
import { OptimizedImage } from '@/components/OptimizedImage'

type ImageManifest = Record<string, { sizes?: Record<string, Record<string, string>> }>

function getLightboxUrl(src: string): string {
  if (src.startsWith('http')) return getOptimizedImageUrl(src, 1920, 75)
  const filename = src.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
  const data = (imageManifest as ImageManifest)[filename]
  const xlWebp = data?.sizes?.['-xl']?.webp
  return xlWebp ?? getOptimizedImageUrl(src, 1920, 75)
}

interface SimpleProductGalleryProps {
  images: string[]
  alt: string
  sizes?: string
}

/**
 * Clean image viewer: full-width cover image, dot indicators for multiple
 * images (tap a dot to switch with crossfade), tap image to open full-screen
 * lightbox with pinch-zoom. No swipe carousel.
 */
export default function SimpleProductGallery({
  images,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 240px, 400px',
}: SimpleProductGalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const slides = images.map((src) => ({ src: getLightboxUrl(src), alt }))

  const handleDotClick = useCallback(
    (e: React.MouseEvent, i: number) => {
      e.stopPropagation()
      setIndex(i)
    },
    []
  )

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer select-none"
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setLightboxOpen(true)
          }
        }}
        aria-label="Tap to view full screen"
      >
        {/* Images — each rendered absolutely, crossfade via opacity */}
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }}
          >
            <OptimizedImage
              src={src}
              alt={`${alt}${images.length > 1 ? ` — photo ${i + 1} of ${images.length}` : ''}`}
              fill
              sizes={sizes}
              priority={i === 0}
              objectFit="cover"
            />
          </div>
        ))}

        {/* Dot indicators — shown when multiple images */}
        {images.length > 1 && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => handleDotClick(e, i)}
                aria-label={`View photo ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === index
                    ? 'w-2.5 h-2.5 bg-white shadow'
                    : 'w-2 h-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={index}
        on={{ view: ({ index: i }) => setIndex(i) }}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        animation={{ zoom: 300, fade: 300, swipe: 300 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.95)' } }}
        render={{
          buttonPrev: images.length > 1 ? undefined : () => null,
          buttonNext: images.length > 1 ? undefined : () => null,
        }}
      />
    </>
  )
}
