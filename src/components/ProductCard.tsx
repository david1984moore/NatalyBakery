'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProductTranslationKey } from '@/lib/productTranslations'
import { OptimizedImage } from '@/components/OptimizedImage'

interface ProductCardProps {
  name: string
  image: string
  href?: string
  variant?: 'hero' | 'light'
  /** Above-fold images: preload immediately. Use for first 4–6 in grid. */
  priority?: boolean
  /** When true, show "Pics coming soon!" placeholder instead of image (desktop home grid). */
  showPlaceholder?: boolean
}

export default function ProductCard({ name, image, href, variant = 'hero', priority = false, showPlaceholder = false }: ProductCardProps) {
  const { t } = useLanguage()
  const productUrl = href || `/menu?product=${encodeURIComponent(name)}`
  const translationKey = getProductTranslationKey(name)
  const translatedName = translationKey.startsWith('product.') ? t(translationKey as any) : name
  const borderClass = variant === 'light' ? 'border-warmgray-300/50 hover:border-warmgray-400/60' : 'border-white/80 hover:border-white'

  return (
    <Link href={productUrl} className="w-full h-full">
      <div className={`group relative rounded-2xl overflow-hidden border-4 ${borderClass} shadow-sm hover:shadow-xl cursor-pointer w-full h-full flex flex-col product-card-smooth`}>
        {/* Product Image - fills container with rounded corners, name overlaid to avoid visible strip */}
        <div className="relative w-full flex-shrink-0 overflow-hidden rounded-t-2xl" style={{ aspectRatio: '3/4' }}>
          {showPlaceholder ? (
            <div className="absolute inset-0 flex items-center justify-center bg-warmgray-100 text-warmgray-600 font-medium text-center px-3 py-6 text-base">
              Pics coming soon!
            </div>
          ) : (
            <OptimizedImage
              src={image}
              alt={translatedName}
              fill
              priority={priority}
              sizes="(max-width: 640px) 140px, (max-width: 1024px) 120px, 140px"
              objectFit="cover"
            />
          )}
          {/* Product name overlay - gradient from transparent to dark for readability, no visible strip */}
          <div className="absolute inset-x-0 bottom-0 pt-12 pb-1.5 px-1.5 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center">
            <h3 className="font-ui text-white text-xs sm:text-sm font-light tracking-wide text-center uppercase leading-tight m-0 p-0 line-clamp-2 drop-shadow-md">
              {translatedName}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  )
}
