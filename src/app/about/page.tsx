'use client'

import Navigation from '@/components/Navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream-50/30">
      <Navigation />
      
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center shadow-md"
          aria-label="Home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Professional Photo */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-lg overflow-hidden border border-white/60 shadow-lg">
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
          <div className="order-1 lg:order-2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-warmgray-800 mb-6">
              About Nataly
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-warmgray-700 text-lg md:text-xl leading-relaxed font-light">
                Nataly Hernandez, originally from Puebla, Mexico, grew up in a house of cooks. Since 2025, Nataly has been offering her homemade baked foods for the world to enjoy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
