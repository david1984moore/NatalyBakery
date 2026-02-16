'use client';

import { Suspense } from 'react'
import { products } from '@/data/products'
import MenuPageContent from './MenuPageContent'
import ImagePreloader from '@/components/ImagePreloader'

export default function MenuPage() {
  return (
    <>
      <ImagePreloader images={[
        '/Images/new_hero_1.jpeg',  // Hero mobile - for back navigation
        '/Images/IMG_7616.jpeg',    // Hero desktop - for back navigation
      ]} />
    <Suspense
      fallback={
        <div className="min-h-screen bg-background/30 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-warmgray-200 border-t-warmgray-800 mx-auto"></div>
            </div>
            <p className="text-warmgray-600 animate-pulse">Loading...</p>
          </div>
        </div>
      }
    >
      <main data-scrollable className="min-h-screen min-h-[100dvh] w-full max-w-full min-w-0 overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #F8ECDF 0%, #EFE2D2 100%)' }}>
        <MenuPageContent products={products} />
      </main>
    </Suspense>
    </>
  )
}
