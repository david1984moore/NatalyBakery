'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'
import ProductCard from './ProductCard'
import { products } from '@/data/products'

const FEATURED_PRODUCT_COUNT = 6
const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function HeroNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <nav className="relative px-0 md:px-4 lg:px-5 py-0 md:py-4 lg:py-5 safe-top safe-right">
      {/* Desktop - Vertical links on right */}
      <div className="hidden md:flex flex-col items-center gap-3 md:gap-3.5">
        <LanguageToggle />
        {navLinks.map((link) => (
          <Link
            key={link.labelKey}
            href={link.href}
            className="font-ui text-xl md:text-2xl text-white hover:text-white transition-all duration-300 tracking-wide lowercase relative group px-4 py-1.5 rounded-full border border-transparent bg-transparent hover:border-white/50 hover:bg-tan"
            style={{ fontWeight: 500 }}
          >
            {t(link.labelKey)}
          </Link>
        ))}
      </div>

      {/* Mobile - Hamburger (clean, no background) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden min-w-[44px] min-h-[44px] pt-0 pb-2 px-2 flex items-start justify-center text-white focus:outline-none"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          }}
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Full-Screen Overlay - Nav links + Product cards */}
      <div
        className={`md:hidden fixed inset-0 z-[100] bg-white/98 backdrop-blur-md transition-all duration-300 ease-in-out overflow-y-auto touch-scroll ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="min-h-full flex flex-col px-4 py-6 safe-top safe-bottom">
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsOpen(false)}
              className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-600 hover:text-warmgray-800"
              aria-label="Close menu"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="py-4 border-b border-warmgray-200">
            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-ui w-full flex items-center px-4 min-h-[44px] py-3 text-warmgray-800 hover:bg-cream-100 font-semibold text-lg lowercase rounded-md"
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <div className="px-4 py-2">
              <LanguageToggle variant="mobile" />
            </div>
          </nav>

          {/* Product cards grid */}
          <div className="flex-1 py-6">
            <h2 className="font-ui text-sm font-medium tracking-wide uppercase text-warmgray-500 mb-4 px-1">
              {t('nav.menu')}
            </h2>
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              {products.slice(0, FEATURED_PRODUCT_COUNT).map((product) => (
                <ProductCard
                  key={product.name}
                  name={product.name}
                  image={product.image}
                  href={`/menu?product=${encodeURIComponent(product.name)}`}
                  variant="light"
                />
              ))}
            </div>
            <Link
              href="/menu"
              onClick={() => setIsOpen(false)}
              className="mt-6 flex justify-center"
            >
              <span className="font-ui inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-sm font-medium tracking-wide uppercase text-black bg-white/10 backdrop-blur-sm hover:bg-tan transition-colors duration-300 rounded-md shadow-md">
                Menu
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
