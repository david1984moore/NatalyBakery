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
    <Link href={productUrl} className="w-full max-w-[100px] sm:max-w-[120px] md:max-w-[130px] lg:max-w-[140px]">
      <div className="group relative rounded-md overflow-hidden border border-white/60 hover:border-white/80 hover:scale-105 hover:shadow-md transition-all duration-300 shadow-sm cursor-pointer w-full">
        {/* Product Image */}
        <div className="relative aspect-[3/4] w-full bg-white/90 backdrop-blur-sm">
          <Image
            src={image}
            alt={translatedName}
            fill
            className="object-cover transition-transform duration-300"
          />
        </div>

        {/* Product Name */}
        <div className="px-1 py-1 md:px-1.5 md:py-1.5 bg-white min-h-[2.5rem] flex items-center justify-center">
          <h3 className="text-warmgray-700 text-[9px] md:text-[10px] font-light tracking-wide text-center uppercase leading-tight m-0 p-0">
            {translatedName}
          </h3>
        </div>
      </div>
    </Link>
  )
}
