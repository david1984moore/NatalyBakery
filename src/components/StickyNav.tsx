'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import SmoothLink from '@/components/SmoothLink'
import { Mail, UtensilsCrossed } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import LanguageToggle from './LanguageToggle'

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function StickyNav() {
  const pathname = usePathname()
  const isTouchDevice = useIsTouchDevice()
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const sentinel = document.getElementById('nav-sentinel')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // Mobile (touch) only: never show header on hero page for a fully immersive experience.
  // Desktop keeps existing scroll-based visibility.
  if (pathname === '/' && isTouchDevice) {
    return null
  }

  if (!isVisible) return null

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[2147483647] safe-top mobile-header-hero-fill max-md:bg-hero-footer-gradient md:bg-background border-b-[3px] border-b-white/85 shadow-sm min-h-[40px] md:min-h-[80px] md:backdrop-blur-sm md:border-b md:border-warmgray-200 transition-opacity duration-300"
      role="navigation"
      style={{ width: '100%' }}
    >
      {/* Mobile: hero-style bar; inset-x-0 + no overflow clip so brand/cart never cut off in landscape */}
      <div className="md:hidden flex flex-1 items-center justify-between gap-1 min-h-[40px] -translate-y-1.5 min-w-0 max-w-full pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]">
        <SmoothLink
          href="/"
          className="flex-shrink min-w-0 max-w-[45%] flex items-center h-full overflow-visible"
          aria-label="Home"
        >
          <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow block overflow-visible">
            Caramel & Jo
          </span>
        </SmoothLink>
        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          {navLinks.map((link) => (
            <SmoothLink
              key={link.labelKey}
              href={link.href}
              prefetch={true}
              aria-label={link.href === '/contact' ? t('nav.contact') : link.href === '/menu' ? t(link.labelKey) : undefined}
              className="hero-btn-header hero-footer-btn-taper min-h-[38px] md:min-h-[44px] min-w-[38px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium flex items-center justify-center"
            >
              {link.href === '/contact' ? <Mail className="w-5 h-5 shrink-0 text-white" strokeWidth={2.5} stroke="white" /> : link.href === '/menu' ? <UtensilsCrossed className="w-6 h-6 text-white shrink-0" strokeWidth={2.5} stroke="white" fill="white" /> : t(link.labelKey)}
            </SmoothLink>
          ))}
          <LanguageToggle variant="menuHeader" />
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
            className="hero-btn-header hero-footer-btn-taper min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center md:hover:opacity-90 transition-colors duration-200 relative border-[3px] border-white"
            aria-label="Shopping cart"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop: white bar with horizontal links */}
      <div className="hidden md:flex justify-between items-center px-4 sm:px-6 lg:px-8 h-14 md:h-16">
        <SmoothLink
          href="/"
          className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap"
        >
          Caramel & Jo
        </SmoothLink>
        <div className="flex items-center gap-8 lg:gap-11">
          {navLinks.map((link) => (
            <SmoothLink
              key={link.labelKey}
              href={link.href}
              prefetch={true}
              aria-label={link.href === '/contact' ? t('nav.contact') : link.href === '/menu' ? t(link.labelKey) : undefined}
              className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
            >
              {link.href === '/contact' ? <Mail className="w-5 h-5" strokeWidth={2} /> : t(link.labelKey)}
            </SmoothLink>
          ))}
          <LanguageToggle variant="menu" />
        </div>
      </div>
    </nav>
  )
}
