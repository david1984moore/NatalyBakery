'use client'

import { useState } from 'react'
import { OptimizedImage } from '@/components/OptimizedImage'

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
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className={mobileHero ? 'object-cover object-center md:object-contain md:object-center' : 'object-contain'}
        sizes={sizes}
        priority={priority}
        objectFit={mobileHero ? 'cover' : 'contain'}
      />
    </div>
  )
}
