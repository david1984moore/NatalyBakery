'use client'

import Navigation from '@/components/Navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <main className="h-screen overflow-hidden bg-cream-50/30">
      <Navigation />
      
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex-shrink-0 px-3 py-1.5"
          aria-label="Home"
        >
          <span className="text-black font-nav-tangerine text-xl md:text-2xl font-bold">Caramel & Jo</span>
        </Link>
      </div>
      
      <div className="h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Professional Photo */}
          <div className="order-2 lg:order-1 h-full flex items-center justify-center">
            <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-lg overflow-hidden border border-white/60 shadow-lg">
              <Image
                src="/Images/IMG_5754.jpeg"
                alt="Nataly Hernandez"
                fill
                className="object-cover"
                priority
                quality={90}
              />
            </div>
          </div>

          {/* Story Content */}
          <div className="order-1 lg:order-2 space-y-4 lg:space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-warmgray-800">
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
