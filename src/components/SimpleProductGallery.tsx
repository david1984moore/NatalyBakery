'use client'

import { useState, useRef, useCallback } from 'react'
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
 * Swipe gallery: direct finger-swipe on the image (no tap required), CSS
 * scroll-snap ensures snapping to each photo, touch-action pan-x eliminates
 * any vertical drift, photo counter (1/N) replaces dots. Tap/click opens
 * full-screen lightbox with pinch-zoom.
 */
export default function SimpleProductGallery({
  images,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 240px, 400px',
}: SimpleProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef<number | null>(null)
  const scrollAtTouchStartRef = useRef<number>(0)
  const didSwipeRef = useRef(false)

  const slides = images.map((src) => ({ src: getLightboxUrl(src), alt }))

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || el.offsetWidth === 0) return
    const idx = Math.round(el.scrollLeft / el.offsetWidth)
    setCurrentIndex(Math.max(0, Math.min(idx, images.length - 1)))
  }, [images.length])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    scrollAtTouchStartRef.current = scrollRef.current?.scrollLeft ?? 0
    didSwipeRef.current = false
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartXRef.current)
    const scrollDelta = Math.abs((scrollRef.current?.scrollLeft ?? 0) - scrollAtTouchStartRef.current)
    didSwipeRef.current = deltaX > 8 || scrollDelta > 8
    touchStartXRef.current = null
  }, [])

  const handleClick = useCallback(() => {
    if (!didSwipeRef.current) {
      setLightboxOpen(true)
    }
  }, [])

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        {/* Scroll container — browser handles snapping natively */}
        <div
          ref={scrollRef}
          className="w-full h-full flex"
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            touchAction: images.length > 1 ? 'pan-x' : 'auto',
            scrollbarWidth: 'none',
            cursor: 'pointer',
          }}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label={images.length > 1 ? `${alt} — swipe to browse, tap to enlarge` : `${alt} — tap to enlarge`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setLightboxOpen(true)
            }
            if (e.key === 'ArrowRight') {
              const el = scrollRef.current
              if (el) el.scrollBy({ left: el.offsetWidth, behavior: 'smooth' })
            }
            if (e.key === 'ArrowLeft') {
              const el = scrollRef.current
              if (el) el.scrollBy({ left: -el.offsetWidth, behavior: 'smooth' })
            }
          }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="relative flex-shrink-0 w-full h-full"
              style={{ scrollSnapAlign: 'start' }}
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
        </div>

        {/* Photo counter — only when multiple images */}
        {images.length > 1 && (
          <div
            className="absolute bottom-3 right-3 z-10 pointer-events-none bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full leading-none"
            aria-live="polite"
            aria-label={`Photo ${currentIndex + 1} of ${images.length}`}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={currentIndex}
        on={{ view: ({ index: i }) => setCurrentIndex(i) }}
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
