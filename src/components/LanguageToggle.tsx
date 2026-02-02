'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface LanguageToggleProps {
  variant?: 'desktop' | 'mobile' | 'menu'
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

  if (variant === 'menu') {
    return (
      <button
        onClick={toggleLanguage}
        className="min-h-[44px] px-3 py-2 sm:py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
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
      className="px-3 py-1 text-lg md:text-xl text-white hover:text-white hover:scale-105 transition-all duration-200 bg-white/15 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/25 hover:border-white/50"
      style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif', fontWeight: 400 }}
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      {language === 'en' ? 'español' : 'english'}
    </button>
  )
}
