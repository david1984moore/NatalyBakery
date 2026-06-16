'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import SmoothLink from '@/components/SmoothLink'
import { products, getProductPriceRange } from '@/data/products'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeroMenuSheetProps {
  isOpen: boolean
  onClose: () => void
}

export default function HeroMenuSheet({ isOpen, onClose }: HeroMenuSheetProps) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (isOpen) setMounted(true)
  }, [isOpen])

  const handleTransitionEnd = () => {
    if (!isOpen) setMounted(false)
  }

  // Close on backdrop click; prevent scroll on body while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!mounted && !isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/50 transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
        aria-hidden
      />

      {/* Bottom sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-[201] bg-[#faf7f2] rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out flex flex-col"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          maxHeight: '78dvh',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
        }}
        onTransitionEnd={handleTransitionEnd}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-warmgray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
          <h2 className="font-playfair text-xl font-bold text-warmgray-800">
            Our Menu
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-warmgray-100 text-warmgray-500 active:bg-warmgray-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-warmgray-200 flex-shrink-0" />

        {/* Product list */}
        <div className="overflow-y-auto flex-1 px-5 pt-1">
          {products.map((product) => (
            <SmoothLink
              key={product.name}
              href={`/menu?product=${encodeURIComponent(product.name)}`}
              prefetch={true}
              onClick={onClose}
              className="flex items-center justify-between py-4 border-b border-warmgray-100 last:border-0 active:bg-warmgray-50 -mx-2 px-2 rounded-xl transition-colors"
            >
              <span className="font-playfair text-base font-semibold text-warmgray-800">
                {product.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-warmgray-400">
                  {getProductPriceRange(product)}
                </span>
                <span className="text-warmgray-300 text-sm">›</span>
              </div>
            </SmoothLink>
          ))}
        </div>

        {/* Order CTA */}
        <div className="px-5 pt-4 flex-shrink-0">
          <SmoothLink
            href="/menu"
            prefetch={true}
            onClick={onClose}
            className="block w-full text-center py-3.5 font-nav-playfair text-base font-bold text-white bg-gradient-to-r from-[#8a7160] to-[#75604f] rounded-2xl border-2 border-white shadow-md active:opacity-90 transition-opacity"
          >
            {t('nav.order') || 'Order Now'}
          </SmoothLink>
        </div>
      </div>
    </>
  )
}
