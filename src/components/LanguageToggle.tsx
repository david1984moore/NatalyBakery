'use client'

import { useCallback, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const SWIPE_THRESHOLD = 40
const SWIPE_HORIZONTAL_RATIO = 1.5 // horizontal must be this much larger than vertical

interface LanguageToggleProps {
  variant?: 'desktop' | 'mobile' | 'mobileHeader' | 'menu' | 'menuHeader' | 'mobileMenu' | 'heroFooter'
}

function SlideToggle({
  variant,
  size = 'default',
}: {
  variant: 'hero' | 'light' | 'dark' | 'mobile' | 'headerButton'
  size?: 'default' | 'compact' | 'heroFooter' | 'header'
}) {
  const { language, setLanguage } = useLanguage()
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartRef.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      }
    },
    []
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      touchStartRef.current = null

      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      if (absX < SWIPE_THRESHOLD || absX < absY * SWIPE_HORIZONTAL_RATIO) return

      if (deltaX > 0) setLanguage('en')
      else setLanguage('es')
    },
    [setLanguage]
  )

  const isHero = variant === 'hero'
  const isLight = variant === 'light'
  const isMobile = variant === 'mobile'
  const isHeaderButton = variant === 'headerButton'
  const isHeroFooter = size === 'heroFooter'

  const heroBorderClass = isHeroFooter
    ? 'border-[4px] landscape:border-[3px]'
    : 'border-[3px]'

  const trackClass = isHeaderButton
    ? `${heroBorderClass} border-white bg-gradient-to-r from-[#8a7160] to-[#75604f]`
    : isHero
      ? `${heroBorderClass} border-white bg-white/20 backdrop-blur-sm`
      : isMobile
        ? 'border border-white/40 bg-gradient-to-r from-[#8a7160] to-[#75604f]'
        : isLight
          ? 'border border-white/40 bg-white/20'
          : 'border border-warmgray-200 bg-cream-50'

  const pillClass = isHeaderButton
    ? 'bg-[#d6b88a]'
    : isHero
      ? 'bg-gradient-to-r from-[#8a7160] to-[#75604f]'
      : isMobile
        ? 'bg-[#d6b88a]'
        : isLight
          ? 'bg-white/30'
          : 'bg-cream-200'

  const textClass = isHero && !isHeaderButton
    ? 'text-white font-medium'
    : isMobile
      ? 'text-warmgray-800 font-medium'
      : isLight
        ? 'text-white font-medium'
        : 'text-warmgray-700'

  const pillRadiusClass = isHeaderButton || isMobile ? 'rounded-lg' : 'rounded-full'

  const trackRadius = isHeaderButton
    ? isHeroFooter
      ? 'rounded-2xl'
      : 'rounded-xl'
    : 'rounded-xl'

  const sizeClasses =
    size === 'heroFooter'
      ? 'h-14 w-[5.5rem] sm:h-16 sm:w-[6rem] landscape:h-12 landscape:w-[5rem] text-sm'
      : size === 'header'
        ? 'h-[38px] min-w-[4.5rem] text-xs'
        : size === 'compact'
          ? 'h-9 min-w-[4.5rem] text-xs'
          : 'h-11 min-w-[5rem] text-sm'

  return (
    <div
      role="group"
      aria-label="Language"
      className={`relative flex overflow-hidden ${trackRadius} ${trackClass} ${sizeClasses}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`absolute top-0 bottom-0 w-[calc(50%-6px)] ${pillRadiusClass} ${pillClass} transition-all duration-200 ease-out z-0`}
        style={{
          left: language === 'en' ? '4px' : 'calc(50% + 2px)',
        }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-200 ${
          isHeaderButton || isMobile
            ? language === 'en'
              ? 'text-warmgray-800 font-medium'
              : 'text-white/90 font-medium'
            : `${textClass} ${language === 'en' ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`
        }`}
        aria-pressed={language === 'en'}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-200 ${
          isHeaderButton || isMobile
            ? language === 'es'
              ? 'text-warmgray-800 font-medium'
              : 'text-white/90 font-medium'
            : `${textClass} ${language === 'es' ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`
        }`}
        aria-pressed={language === 'es'}
        aria-label="Español"
      >
        ES
      </button>
    </div>
  )
}

export default function LanguageToggle({ variant = 'desktop' }: LanguageToggleProps) {
  if (variant === 'mobile') {
    return (
      <div className="mt-2 pt-3 border-t border-warmgray-200 flex justify-center">
        <SlideToggle variant="mobile" size="default" />
      </div>
    )
  }

  if (variant === 'mobileHeader') {
    return (
      <div className="hero-btn-header hero-footer-btn-taper rounded-xl">
        <SlideToggle variant="headerButton" size="header" />
      </div>
    )
  }

  if (variant === 'mobileMenu') {
    return (
      <div className="flex justify-center">
        <SlideToggle variant="light" size="default" />
      </div>
    )
  }

  if (variant === 'menuHeader') {
    return (
      <div className="hero-btn-header hero-footer-btn-taper rounded-xl">
        <SlideToggle variant="hero" size="compact" />
      </div>
    )
  }

  if (variant === 'heroFooter') {
    return (
      <div className="hero-btn-header hero-footer-btn-taper rounded-2xl">
        <SlideToggle variant="headerButton" size="heroFooter" />
      </div>
    )
  }

  if (variant === 'menu') {
    return (
      <div className="rounded-lg border border-warmgray-200 bg-cream-50/50 p-0.5">
        <SlideToggle variant="dark" size="compact" />
      </div>
    )
  }

  return (
    <div className="hero-btn-header hero-footer-btn-taper rounded-2xl">
      <SlideToggle variant="hero" size="default" />
    </div>
  )
}
