'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface LanguageToggleProps {
  variant?: 'desktop' | 'mobile' | 'menu' | 'menuHeader' | 'mobileMenu' | 'heroFooter'
}

function SlideToggle({
  variant,
  size = 'default',
}: {
  variant: 'hero' | 'light' | 'dark'
  size?: 'default' | 'compact' | 'heroFooter'
}) {
  const { language, setLanguage } = useLanguage()

  const isHero = variant === 'hero'
  const isLight = variant === 'light'

  const trackClass = isHero
    ? 'border-2 md:border-[3px] border-white bg-white/20'
    : isLight
      ? 'border border-white/40 bg-white/20'
      : 'border border-warmgray-200 bg-cream-50'

  const pillClass = isHero
    ? 'bg-gradient-to-r from-[#8a7160] to-[#75604f]'
    : isLight
      ? 'bg-white/30'
      : 'bg-cream-200'

  const textClass = isHero
    ? 'text-white font-medium'
    : isLight
      ? 'text-white font-medium'
      : 'text-warmgray-700'

  const sizeClasses =
    size === 'heroFooter'
      ? 'h-14 w-[5.5rem] sm:h-16 sm:w-[6rem] landscape:h-12 landscape:w-[5rem] text-sm'
      : size === 'compact'
        ? 'h-9 min-w-[4.5rem] text-xs'
        : 'h-11 min-w-[5rem] text-sm'

  return (
    <div
      role="group"
      aria-label="Language"
      className={`relative flex rounded-xl overflow-hidden ${trackClass} ${sizeClasses}`}
    >
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-6px)] rounded-lg ${pillClass} transition-all duration-200 ease-out z-0`}
        style={{
          left: language === 'en' ? '4px' : 'calc(50% + 2px)',
        }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-200 ${textClass} ${language === 'en' ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`}
        aria-pressed={language === 'en'}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={`relative z-10 flex-1 flex items-center justify-center transition-colors duration-200 ${textClass} ${language === 'es' ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`}
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
        <SlideToggle variant="dark" size="default" />
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
      <div className="hero-btn-header hero-footer-btn-taper">
        <SlideToggle variant="hero" size="compact" />
      </div>
    )
  }

  if (variant === 'heroFooter') {
    return (
      <div className="hero-btn-header hero-footer-btn-taper">
        <SlideToggle variant="hero" size="heroFooter" />
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
    <div className="hero-btn-header hero-footer-btn-taper">
      <SlideToggle variant="hero" size="default" />
    </div>
  )
}
