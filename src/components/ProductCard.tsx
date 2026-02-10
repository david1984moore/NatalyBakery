'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProductTranslationKey } from '@/lib/productTranslations'
import { BLUR_DATA_URL } from '@/lib/image-utils'

interface ProductCardProps {
  name: string
  image: string
  href?: string
  variant?: 'hero' | 'light'
  /** Above-fold images: preload immediately. Use for first 4–6 in grid. */
  priority?: boolean
  /** Per-image blur placeholder. Falls back to generic blur if not provided. */
  blurDataURL?: string
}

export default function ProductCard({ name, image, href, variant = 'hero', priority = false, blurDataURL }: ProductCardProps) {
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
          <Image
            src={image}
            alt={translatedName}
            fill
            className="object-cover"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            quality={90}
            placeholder="blur"
            blurDataURL={blurDataURL || BLUR_DATA_URL}
            fetchPriority={priority ? 'high' : undefined}
            sizes="(max-width: 640px) 140px, (max-width: 768px) 120px, 140px"
          />
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
