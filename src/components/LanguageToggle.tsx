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
        className="px-6 py-2 text-sm text-warmgray-700 hover:bg-cream-100 transition-colors duration-200 border-t border-warmgray-200 mt-2 font-amatic"
        style={{ fontFamily: 'var(--font-amatic)' }}
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
        className="px-3 py-1.5 text-sm bg-white text-warmgray-700 border border-warmgray-300 rounded-md hover:bg-warmgray-50 transition-colors duration-200 shadow-sm"
        style={{ fontFamily: 'var(--font-amatic)' }}
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
      className="px-4 py-2 text-2xl md:text-3xl text-white hover:text-white hover:scale-105 transition-all duration-200 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/40 hover:bg-white/30 hover:border-white/60 shadow-lg hover:shadow-xl"
      style={{ fontFamily: 'var(--font-amatic)' }}
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      {language === 'en' ? 'español' : 'english'}
    </button>
  )
}
