'use client'

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
        className="hero-btn-header hero-footer-btn-taper min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium"
        style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
        aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
        title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      >
        {language === 'en' ? 'español' : 'english'}
      </button>
    )
  }

  if (variant === 'heroFooter') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className="hero-btn-header hero-footer-btn-taper min-h-[38px] landscape:min-h-[32px] min-w-0 max-w-[5.5rem] px-2.5 py-1.5 landscape:px-2 landscape:py-1 text-xs border-[4px] landscape:border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-2xl md:hover:opacity-90 transition-colors duration-200 font-medium"
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
      className="hero-btn-header hero-footer-btn-taper font-ui font-bold text-base md:text-lg text-white tracking-wide lowercase min-h-[32px] md:min-h-[36px] px-4 py-1.5 md:px-5 md:py-2 flex items-center justify-center rounded-xl border-2 border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm md:hover:opacity-90 transition-colors duration-200"
      aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      {language === 'en' ? 'español' : 'english'}
    </button>
  )
}
