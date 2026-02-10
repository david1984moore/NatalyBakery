import { Suspense } from 'react'
import { products } from '@/data/products'
import { addBlurPlaceholders } from '@/lib/image-utils.server'
import MenuPageContent from './MenuPageContent'

export type ProductWithBlur = (typeof products)[number] & { blurDataURL?: string }

export default async function MenuPage() {
  const productsWithBlur = await addBlurPlaceholders(products)

  return (
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
      <MenuPageContent productsWithBlur={productsWithBlur} />
    </Suspense>
  )
}
