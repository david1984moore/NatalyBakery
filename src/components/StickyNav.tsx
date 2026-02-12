'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import LanguageToggle from './LanguageToggle'

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function StickyNav() {
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

  if (!isVisible) return null

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] safe-top bg-hero border-b-[3px] border-b-white/85 shadow-sm min-h-[40px] md:min-h-[80px] md:bg-white/95 md:backdrop-blur-sm md:border-b md:border-warmgray-200 transition-opacity duration-300"
      role="navigation"
    >
      {/* Mobile: hero-style bar (matches menu/contact mobile header) */}
      <div className="md:hidden flex flex-1 items-center justify-between gap-2 pl-2.5 pr-3 min-h-[40px] -translate-y-1.5 min-w-0">
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="flex-shrink-0 flex items-center h-full"
          aria-label="Home"
        >
          <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow">
            Caramel & Jo
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              prefetch={true}
              className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageToggle variant="menuHeader" />
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
            className="min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] bg-stone-800/45 backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center shadow-md md:hover:bg-stone-700/55 md:hover:border-white transition-colors duration-200 relative border-[3px] border-white/85"
            aria-label="Shopping cart"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
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
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap"
        >
          Caramel & Jo
        </Link>
        <div className="flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              prefetch={true}
              className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageToggle variant="menu" />
        </div>
      </div>
    </nav>
  )
}
