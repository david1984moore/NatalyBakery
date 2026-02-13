'use client'

import Link from 'next/link'
import { Mail, UtensilsCrossed } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMobileMenu } from '@/contexts/MobileMenuContext'
import LanguageToggle from './LanguageToggle'
import ProductCard from './ProductCard'
import { products } from '@/data/products'

const FEATURED_PRODUCT_COUNT = 6
const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function MobileMenu() {
  const { t } = useLanguage()
  const { isOpen, setIsOpen } = useMobileMenu()

  return (
    <div
      className={`md:hidden fixed inset-0 z-[100] bg-[#3d3429]/92 backdrop-blur-md transition-all duration-300 ease-in-out overflow-y-auto touch-scroll ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="min-h-full flex flex-col px-4 py-6 safe-top safe-bottom">
        {/* Top bar: Language toggle (left) + Close button (right) */}
        <div className="flex justify-between items-center mb-2">
          <LanguageToggle variant="mobileMenu" />
          <button
            onClick={() => setIsOpen(false)}
            className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-md border border-white/40 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="py-4 border-b border-white/30 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              prefetch={true}
              onClick={() => setIsOpen(false)}
              aria-label={link.href === '/contact' ? t('nav.contact') : link.href === '/menu' ? t(link.labelKey) : undefined}
              className="font-ui w-full flex items-center justify-center min-h-[44px] px-3 py-2 rounded-md border border-white/40 bg-white/20 backdrop-blur-sm text-white font-medium text-sm tracking-wide hover:bg-white/30 transition-colors duration-200"
            >
              {link.href === '/contact' ? <Mail className="w-6 h-6" strokeWidth={2} /> : link.href === '/menu' ? <UtensilsCrossed className="w-6 h-6" strokeWidth={2} /> : t(link.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Product cards grid */}
        <div className="flex-1 py-6">
          <div className="grid grid-cols-3 gap-2 justify-items-center">
            {products.slice(0, FEATURED_PRODUCT_COUNT).map((product, index) => (
              <ProductCard
                key={product.name}
                name={product.name}
                image={product.image}
                href={`/menu?product=${encodeURIComponent(product.name)}`}
                variant="light"
                priority={index < 4}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
