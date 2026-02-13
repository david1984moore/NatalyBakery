'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface LanguageToggleProps {
  variant?: 'desktop' | 'mobile' | 'menu' | 'menuHeader' | 'mobileMenu' | 'heroFooter'
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
        className="min-h-[44px] px-3 py-2 text-sm border border-white/40 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors duration-200 font-medium"
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
        className="hero-btn-header hero-footer-btn-taper min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white bg-gradient-to-r from-[#7a6150] to-[#664f3f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium"
        style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
        aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
        title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      >
        {language === 'en' ? 'español' : 'english'}
      </button>
    )
  }

  if (variant === 'heroFooter') {
    const label = language === 'en' ? 'español' : 'english'
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className="hero-footer-btn-taper w-full h-full min-h-[32px] py-1 px-0.5 sm:px-1 flex flex-col items-center justify-center gap-0.5 text-white text-sm font-medium border-[3px] border-white bg-gradient-to-r from-[#7a6150] to-[#664f3f] backdrop-blur-sm rounded-2xl md:hover:bg-hero-600 md:hover:border-white transition-colors duration-200"
        style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
        aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
        title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      >
        <Languages className="w-4 h-4 shrink-0" strokeWidth={2.5} fill="none" stroke="white" aria-hidden />
        <span className="text-sm leading-tight">{label}</span>
      </button>
    )
  }

  if (variant === 'menu') {
    return (
      <button
        onClick={toggleLanguage}
        className="px-3 py-1.5 text-sm bg-transparent text-warmgray-700 rounded-md md:hover:bg-warmbrown-500 md:hover:text-white transition-colors duration-200 font-medium"
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
      className="hero-btn-header hero-footer-btn-taper font-ui font-bold text-base md:text-lg text-white tracking-wide lowercase min-h-[32px] md:min-h-[36px] px-4 py-1.5 md:px-5 md:py-2 flex items-center justify-center rounded-xl border-2 border-white bg-gradient-to-r from-[#7a6150] to-[#664f3f] backdrop-blur-sm md:hover:opacity-90 transition-colors duration-200"
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      {language === 'en' ? 'español' : 'english'}
    </button>
  )
}
