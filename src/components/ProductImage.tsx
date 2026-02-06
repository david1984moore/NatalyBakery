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
}

export default function ProductImage({
  src,
  alt,
  sizes = '(max-width: 640px) 180px, (max-width: 768px) 240px, 400px',
  className = '',
  priority = true,
}: ProductImageProps) {
  const [aspectRatio, setAspectRatio] = useState(4 / 3)

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes={sizes}
        priority={priority}
        quality={75}
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
