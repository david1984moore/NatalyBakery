'use client'

import Navigation from '@/components/Navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import { OptimizedImage } from '@/components/OptimizedImage'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <main className="min-h-screen bg-cream-50/30">
      <Navigation />
      
      {/* Home Button */}
      <div className="fixed top-3 sm:top-4 left-3 sm:left-4 z-50 safe-left safe-top">
        <Link
          href="/"
          className="flex-shrink-0 px-2 sm:px-3 py-1.5"
          aria-label="Home"
        >
          <span className="text-black font-nav-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold brand-header-shadow">Caramel & Jo</span>
        </Link>
      </div>
      
      <div className="h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center">
          {/* Professional Photo */}
          <div className="order-2 md:order-1 h-full flex items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-sm mx-auto aspect-[3/4] rounded-lg overflow-hidden border border-white/60 shadow-lg">
              <OptimizedImage
                src="/Images/IMG_5754.jpeg"
                alt="Nataly Hernandez"
                fill
                sizes="(max-width: 640px) 280px, 384px"
                objectFit="cover"
              />
            </div>
          </div>

          {/* Story Content */}
          <div className="order-1 lg:order-2 space-y-4 lg:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-warmgray-800">
              {t('about.title')}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-warmgray-700 text-base md:text-lg lg:text-xl leading-relaxed font-light">
                {t('about.bio')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
