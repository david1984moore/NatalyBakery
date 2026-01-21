'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProductTranslationKey } from '@/lib/productTranslations'

interface ProductCardProps {
  name: string
  image: string
  href?: string
}

export default function ProductCard({ name, image, href }: ProductCardProps) {
  const { t } = useLanguage()
  const productUrl = href || `/menu?product=${encodeURIComponent(name)}`
  const translationKey = getProductTranslationKey(name)
  const translatedName = translationKey.startsWith('product.') ? t(translationKey as any) : name

  return (
    <Link href={productUrl} className="w-full h-full">
      <div className="group relative rounded-md overflow-hidden border border-white/60 hover:border-white/80 hover:scale-105 hover:shadow-md transition-[transform,box-shadow,border-color] duration-300 shadow-sm cursor-pointer w-full h-full flex flex-col will-change-transform">
        {/* Product Image - Fixed height */}
        <div className="relative w-full flex-shrink-0 bg-white/90 backdrop-blur-sm" style={{ aspectRatio: '3/4' }}>
          <Image
            src={image}
            alt={translatedName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 140px"
          />
        </div>

        {/* Product Name - Fixed height */}
        <div className="px-1 py-1 md:px-1.5 md:py-1.5 bg-white h-[2.5rem] flex items-center justify-center flex-shrink-0">
          <h3 className="text-warmgray-700 text-xs sm:text-sm md:text-[10px] font-light tracking-wide text-center uppercase leading-tight m-0 p-0 line-clamp-2">
            {translatedName}
          </h3>
        </div>
      </div>
    </Link>
  )
}
