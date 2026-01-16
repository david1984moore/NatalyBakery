'use client'

import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  name: string
  image: string
  href?: string
}

export default function ProductCard({ name, image, href }: ProductCardProps) {
  const productUrl = href || `/menu?product=${encodeURIComponent(name)}`

  return (
    <Link href={productUrl}>
      <div className="group relative rounded-md overflow-hidden border border-white/60 hover:border-white/80 transition-all duration-300 shadow-sm cursor-pointer">
        {/* Product Image */}
        <div className="relative aspect-[3/4] w-full bg-white/90 backdrop-blur-sm">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Name */}
        <div className="px-1 py-1 md:px-1.5 md:py-1.5 bg-white min-h-[2.5rem] flex items-center justify-center">
          <h3 className="text-warmgray-700 text-[9px] md:text-[10px] font-light tracking-wide text-center uppercase leading-tight m-0 p-0">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  )
}
