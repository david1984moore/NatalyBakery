'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface LanguageToggleProps {
  variant?: 'desktop' | 'mobile' | 'menu' | 'menuHeader' | 'mobileMenu'
}

export default function LanguageToggle({ variant = 'desktop' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en')
  }

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleLanguage}
        className="min-h-[44px] px-6 py-3 text-sm text-warmgray-700 hover:bg-cream-100 transition-colors duration-200 border-t border-warmgray-200 mt-2"
        style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
        aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
        title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      >
        {language === 'en' ? 'español' : 'english'}
      </button>
    )
  }

  if (variant === 'mobileMenu') {
    return (
      <button
        onClick={toggleLanguage}
        className="min-h-[44px] px-3 py-2 text-sm border border-white/40 bg-white/20 backdrop-blur-sm text-white rounded-md hover:bg-white/20 transition-colors duration-200 font-medium"
        style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
        aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
        title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      >
        {language === 'en' ? 'español' : 'english'}
      </button>
    )
  }

  if (variant === 'menuHeader') {
    return (
      <button
        onClick={toggleLanguage}
        className="min-h-[34px] md:min-h-[40px] px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm border-[3px] border-white/70 bg-white/20 text-white rounded-md hover:bg-white/40 hover:border-white/90 transition-colors duration-200 font-medium"
        style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
        aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
        title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      >
        {language === 'en' ? 'español' : 'english'}
      </button>
    )
  }

  if (variant === 'menu') {
    return (
      <button
        onClick={toggleLanguage}
        className="min-h-[38px] md:min-h-[44px] px-2.5 md:px-3 py-1 md:py-1.5 text-xs md:text-sm border-2 border-warmgray-300 bg-transparent text-warmgray-700 rounded-md md:hover:bg-warmbrown-500 md:hover:border-warmbrown-500 md:hover:text-white transition-colors duration-200 font-medium"
        style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
        aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
        title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      >
        {language === 'en' ? 'español' : 'english'}
      </button>
    )
  }

  return (
    <button
      onClick={toggleLanguage}
      className="font-ui font-bold text-sm md:text-base text-white tracking-wide lowercase min-h-[32px] px-4 py-1.5 flex items-center justify-center rounded-md border-[3px] border-white/70 bg-white/20 md:hover:bg-white/40 md:hover:border-white/90 transition-colors duration-200"
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      {language === 'en' ? 'español' : 'english'}
    </button>
  )
}
