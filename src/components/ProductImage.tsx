'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BLUR_DATA_URL } from '@/lib/image-utils'

interface ProductImageProps {
  src: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
  /** Mobile only: fill hero area with object-cover */
  mobileHero?: boolean
}

export default function ProductImage({
  src,
  alt,
  sizes = '(max-width: 640px) 180px, (max-width: 768px) 240px, 400px',
  className = '',
  priority = true,
  mobileHero = false,
}: ProductImageProps) {
  const [aspectRatio, setAspectRatio] = useState(4 / 3)

  return (
    <div
      className={`relative w-full overflow-hidden ${className} ${mobileHero ? 'h-full min-h-0 md:h-auto md:min-h-0 md:rounded-2xl rounded-none' : 'rounded-2xl'}`}
      style={mobileHero ? undefined : { aspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={mobileHero ? 'object-cover object-center md:object-contain md:object-center' : 'object-contain'}
        sizes={sizes}
        priority={priority}
        quality={mobileHero ? 70 : 75}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        fetchPriority={priority ? 'high' : undefined}
        onLoad={(e) => {
          const img = e.target as HTMLImageElement
          if (img?.naturalWidth && img?.naturalHeight) {
            setAspectRatio(img.naturalWidth / img.naturalHeight)
          }
        }}
      />
    </div>
  )
}
