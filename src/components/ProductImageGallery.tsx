'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { BLUR_DATA_URL, getOptimizedImageUrl } from '@/lib/image-utils'

interface ProductImageGalleryProps {
  images: string[]
  alt: string
  className?: string
  imageClassName?: string
  sizes?: string
  /** Mobile only: fill hero area, use scroll-snap carousel for multiple images */
  mobileHero?: boolean
  /** Per-image blur placeholder for main image. Falls back to generic blur if not provided. */
  blurDataURL?: string
}

export default function ProductImageGallery({
  images,
  alt,
  className = '',
  imageClassName = '',
  sizes = '(max-width: 640px) 180px, (max-width: 768px) 240px, 400px',
  mobileHero = false,
  blurDataURL: blurDataURLProp,
}: ProductImageGalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
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

  // Use Next.js optimized URLs so lightbox loads resized WebP/AVIF, not raw files
  const slides = images.map((src) => ({
    src: getOptimizedImageUrl(src, 1920, 75),
    alt,
  }))
  const useMobileCarousel = mobileHero && isMobile && images.length > 1
  const useMobileHero = mobileHero && isMobile
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
            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x overscroll-x-contain [-webkit-overflow-scrolling:touch] flex-1 min-h-0 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
              onScroll={handleScroll}
            >
              {images.map((src, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 w-full basis-full snap-center"
                  onClick={() => setLightboxOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true)
                  }}
                  aria-label={`View image ${i + 1} full screen, swipe to change photo`}
                >
                  <Image
                    src={src}
                    alt={`${alt} ${i + 1} of ${images.length}`}
                    fill
                    className="object-contain object-center"
                    sizes="100vw"
                    priority={i === 0}
                    quality={90}
                    placeholder="blur"
                    blurDataURL={blurDataURLProp || BLUR_DATA_URL}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-1.5 mt-2 py-2 flex-shrink-0">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (scrollRef.current) {
                      const w = scrollRef.current.clientWidth
                      scrollRef.current.scrollTo({ left: i * w, behavior: 'smooth' })
                    }
                    setIndex(i)
                  }}
                  className={`rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-warmbrown-500 focus:ring-offset-1 ${
                    i === index ? 'w-2.5 h-2.5 bg-warmbrown-500' : 'w-2 h-2 bg-warmgray-300'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop: click zones - left half = prev, right half = next */}
            <div className="hidden md:grid md:grid-cols-2 absolute inset-0 z-10">
              <button type="button" onClick={goPrev} className="cursor-pointer focus:outline-none" aria-label="Previous image" />
              <button type="button" onClick={goNext} className="cursor-pointer focus:outline-none" aria-label="Next image" />
            </div>

            {/* Image container - desktop or non-hero mobile */}
            <div
              className={`relative w-full overflow-hidden select-none ${useMobileHero ? 'min-h-full rounded-none cursor-pointer md:rounded-2xl' : 'rounded-2xl'} ${isMobile && !mobileHero ? 'touch-pan-y cursor-pointer' : ''}`}
              style={{ aspectRatio: useMobileHero ? undefined : aspectRatio }}
              onClick={useMobileHero ? () => setLightboxOpen(true) : undefined}
              onTouchStart={isMobile && !mobileHero ? onTouchStart : undefined}
              onTouchMove={isMobile && !mobileHero ? onTouchMove : undefined}
              onTouchEnd={isMobile && !mobileHero ? onTouchEnd : undefined}
              role={isMobile || useMobileHero ? 'button' : undefined}
              tabIndex={isMobile || useMobileHero ? 0 : undefined}
              onKeyDown={(e) => {
                if ((isMobile || useMobileHero) && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  setLightboxOpen(true)
                }
              }}
              aria-label={isMobile || useMobileHero ? 'Tap to view full screen, swipe to change photo' : undefined}
            >
              <div key={index} className={`absolute inset-0 ${useMobileHero ? '' : 'animate-fade-in'}`}>
                <Image
                  src={images[index]}
                  alt={`${alt} ${index + 1} of ${images.length}`}
                  fill
                  className={`object-contain object-center ${imageClassName}`}
                  sizes={sizes}
                  priority={index === 0}
                  quality={90}
                  placeholder="blur"
                  blurDataURL={blurDataURLProp || BLUR_DATA_URL}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement
                    if (img?.naturalWidth && img?.naturalHeight) {
                      setAspectRatio(img.naturalWidth / img.naturalHeight)
                    }
                  }}
                />
              </div>
            </div>

            {/* Dots indicator - desktop and non-carousel mobile */}
            <div className="flex justify-center gap-1.5 mt-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIndex(i)
                    setAspectRatio(4 / 3)
                  }}
                  className={`rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-warmbrown-500 focus:ring-offset-1 ${
                    i === index ? 'w-2.5 h-2.5 bg-warmbrown-500' : 'w-2 h-2 bg-warmgray-300 hover:bg-warmgray-400'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                />
              ))}
            </div>
          </>
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
