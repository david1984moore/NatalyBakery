'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { getOptimizedImageUrl } from '@/lib/image-utils'
import imageManifest from '@/data/image-blur-data.json'
import { OptimizedImage } from '@/components/OptimizedImage'

type ImageManifest = Record<string, { sizes?: Record<string, Record<string, string>> }>

function getLightboxImageUrl(src: string): string {
  if (src.startsWith('http')) return getOptimizedImageUrl(src, 1920, 75)
  const filename = src.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
  const data = (imageManifest as ImageManifest)[filename]
  const xlWebp = data?.sizes?.['-xl']?.webp
  if (xlWebp) return xlWebp
  return getOptimizedImageUrl(src, 1920, 75)
}

interface ProductImageGalleryProps {
  images: string[]
  alt: string
  className?: string
  imageClassName?: string
  sizes?: string
  /** Mobile only: fill hero area, use scroll-snap carousel for multiple images */
  mobileHero?: boolean
}

export default function ProductImageGallery({
  images,
  alt,
  className = '',
  imageClassName = '',
  sizes = '(max-width: 640px) 180px, (max-width: 1024px) 240px, 400px',
  mobileHero = false,
}: ProductImageGalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3)

  useEffect(() => {
    const mql = window.matchMedia('(hover: none) and (pointer: coarse)')
    const check = () => setIsMobile(mql.matches)
    check()
    mql.addEventListener('change', check)
    return () => mql.removeEventListener('change', check)
  }, [])

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? images.length - 1 : i - 1))
    setAspectRatio(4 / 3)
  }, [images.length])

  const goNext = useCallback(() => {
    setIndex((i) => (i >= images.length - 1 ? 0 : i + 1))
    setAspectRatio(4 / 3)
  }, [images.length])

  // Touch handling for swipe on mobile; tap opens lightbox
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  const onTouchEnd = () => {
    if (touchStart === null) return
    const endX = touchEnd ?? touchStart
    const distance = touchStart - endX
    const absDistance = Math.abs(distance)

    if (absDistance > minSwipeDistance) {
      if (distance > 0) goNext()
      else goPrev()
    } else {
      setLightboxOpen(true)
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Use build-time optimized URLs when available, else Next.js image API (e.g. remote)
  const slides = images.map((src) => ({
    src: getLightboxImageUrl(src),
    alt,
  }))
  const useMobileCarousel = mobileHero && isMobile && images.length > 1
  const useMobileHero = mobileHero && isMobile
  /** Desktop menu: same hero layout; image uses contain so full product is visible */
  const desktopMenuHero = mobileHero && !isMobile
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sync scroll position to index for dots when using scroll-snap carousel
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !useMobileCarousel) return
    const { scrollLeft, clientWidth } = scrollRef.current
    const newIndex = Math.round(scrollLeft / clientWidth)
    if (newIndex >= 0 && newIndex < images.length) setIndex(newIndex)
  }, [useMobileCarousel, images.length])

  return (
    <>
      <div className={`relative w-full ${mobileHero ? 'h-full' : ''} ${className}`}>
        {/* Mobile hero: scroll-snap carousel - iPhone-like swipe */}
        {useMobileCarousel ? (
          <div className="md:hidden flex flex-col h-full min-h-0">
            <div className="relative flex-1 min-h-0">
              <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth overscroll-x-contain [-webkit-overflow-scrolling:touch] h-full scrollbar-hide"
                style={{ scrollSnapType: 'x mandatory' }}
                onScroll={handleScroll}
              >
                {images.map((src, i) => (
                  <div
                    key={i}
                    className="relative flex-shrink-0 w-full basis-full snap-center h-full"
                    onClick={() => setLightboxOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true)
                    }}
                    aria-label={`View image ${i + 1} full screen, swipe to change photo`}
                  >
                    <OptimizedImage
                      src={src}
                      alt={`${alt} ${i + 1} of ${images.length}`}
                      fill
                      sizes="100vw"
                      priority={i === 0}
                      objectFit="contain"
                    />
                  </div>
                ))}
              </div>
              {/* Numeric position pill — bottom-right overlay, no extra height */}
              {images.length > 1 && (
                <div
                  className="absolute bottom-3 right-3 bg-black/40 text-white text-xs font-medium rounded-full px-2.5 py-1 pointer-events-none select-none"
                  aria-live="polite"
                  aria-label={`Image ${index + 1} of ${images.length}`}
                >
                  {index + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={desktopMenuHero ? 'flex flex-col h-full min-h-0' : 'relative'}>
            {/* Desktop: click zones - left half = prev, right half = next */}
            <div className="hidden md:grid md:grid-cols-2 absolute inset-0 z-10">
              <button type="button" onClick={goPrev} className="cursor-pointer focus:outline-none" aria-label="Previous image" />
              <button type="button" onClick={goNext} className="cursor-pointer focus:outline-none" aria-label="Next image" />
            </div>

            {/* Image container - desktop or non-hero mobile; on desktop menu hero: flex-1 to fill card */}
            <div
              className={`relative w-full overflow-hidden select-none ${useMobileHero ? 'min-h-full rounded-none cursor-pointer md:rounded-2xl' : 'rounded-2xl'} ${desktopMenuHero ? 'flex-1 min-h-0' : ''} ${isMobile && !mobileHero ? 'cursor-pointer' : ''}`}
              style={{ aspectRatio: desktopMenuHero ? undefined : (useMobileHero ? undefined : aspectRatio) }}
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
              <div key={index} className={`absolute inset-0 ${useMobileHero ? '' : 'animate-fade-in'}`}>
                <OptimizedImage
                  src={images[index]}
                  alt={`${alt} ${index + 1} of ${images.length}`}
                  fill
                  className={imageClassName}
                  sizes={sizes}
                  priority={index === 0}
                  objectFit="contain"
                />
              </div>
            </div>

            {/* Desktop: numeric pill indicator overlaid bottom-right */}
            {images.length > 1 && (
              <div
                className="hidden md:flex absolute bottom-3 right-3 bg-black/40 text-white text-xs font-medium rounded-full px-2.5 py-1 pointer-events-none select-none"
                aria-live="polite"
                aria-label={`Image ${index + 1} of ${images.length}`}
              >
                {index + 1} / {images.length}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full-screen lightbox - mobile tap to open, pinch zoom, swipe */}
      <Lightbox
        open={lightboxOpen}
        close={() => {
          setLightboxOpen(false)
          if (useMobileCarousel && scrollRef.current) {
            const w = scrollRef.current.clientWidth
            scrollRef.current.scrollTo({ left: index * w })
          }
        }}
        slides={slides}
        index={index}
        on={{
          view: ({ index: i }) => setIndex(i),
        }}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        animation={{ zoom: 300, fade: 300, swipe: 300 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: 'rgba(0,0,0,0.95)' },
        }}
        render={{
          buttonPrev: images.length > 1 ? undefined : () => null,
          buttonNext: images.length > 1 ? undefined : () => null,
        }}
      />
    </>
  )
}
