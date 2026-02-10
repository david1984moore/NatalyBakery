'use client'

import { useState, useEffect, useRef } from 'react'
import ContactForm from '@/components/ContactForm'
import LanguageToggle from '@/components/LanguageToggle'
import Cart from '@/components/Cart'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

const navDropdownLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function ContactPage() {
  const { t } = useLanguage()
  const { items } = useCart()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const navMobileRef = useRef<HTMLDivElement>(null)
  const navDesktopRef = useRef<HTMLDivElement>(null)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const insideMobile = navMobileRef.current?.contains(target)
      const insideDesktop = navDesktopRef.current?.contains(target)
      if (!insideMobile && !insideDesktop) setIsNavOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <main className="min-h-screen bg-cream-50/30">
      {/* Header Container - Fixed at top: brand left; language, cart, hamburger right */}
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-hero shadow-sm safe-top w-full max-w-[100vw] overflow-visible"
        style={{ minHeight: '40px' }}
      >
        <div className="bg-hero border-b border-hero-600 flex flex-col min-h-[40px]">
          {/* Mobile Layout (< 768px) */}
          <div className="md:hidden flex flex-1 items-center justify-between pl-2.5 pr-3 min-h-[40px] -translate-y-1.5">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center h-full"
              aria-label="Home"
            >
              <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow">Caramel & Jo</span>
            </Link>
            <div className="flex items-center gap-3 flex-shrink-0">
              <LanguageToggle variant="menuHeader" />
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
                className="min-w-[34px] min-h-[34px] bg-stone-800/30 backdrop-blur-sm rounded-full p-1 flex items-center justify-center shadow-md md:hover:bg-stone-700/40 md:hover:border-white transition-colors duration-200 relative border-4 border-white/85"
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
                  <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </button>
              <div className="relative" ref={navMobileRef}>
                <button
                  onClick={() => setIsNavOpen(!isNavOpen)}
                  className="min-w-[34px] min-h-[34px] p-2 flex items-center justify-center text-white border-4 border-white/85 bg-stone-800/30 backdrop-blur-sm rounded-full hover:bg-stone-700/40 transition-colors duration-200"
                  aria-expanded={isNavOpen}
                  aria-label="Toggle navigation menu"
                  aria-haspopup="true"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    {isNavOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                <div
                  className={`absolute top-full right-0 mt-2 w-48 z-50 rounded-xl overflow-hidden backdrop-blur-xl border border-white/30 shadow-lg origin-top-right transition-all duration-200 ease-out ${
                    isNavOpen ? 'opacity-100 visible scale-100 translate-y-0 bg-stone-800/95' : 'opacity-0 invisible scale-95 translate-y-1 pointer-events-none'
                  }`}
                >
                  <div className="py-2 px-2 flex flex-col gap-1">
                    {navDropdownLinks.map((link) => (
                      <Link
                        key={link.labelKey}
                        href={link.href}
                        onClick={() => setIsNavOpen(false)}
                        className="font-medium min-h-[44px] px-4 py-2.5 flex items-center text-sm text-white rounded-lg hover:bg-white/20"
                      >
                        {t(link.labelKey)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout (>= 768px) */}
          <div className="hidden md:flex flex-1 items-center justify-between pl-4 pr-8 lg:pl-6 lg:pr-10 -translate-y-1.5" style={{ minHeight: '40px' }}>
            <Link
              href="/"
              className="flex-shrink-0 flex items-center h-full"
              aria-label="Home"
            >
              <span className="text-white font-nav-playfair text-3xl lg:text-4xl xl:text-5xl font-extrabold brand-header-shadow">Caramel & Jo</span>
            </Link>
            <div className="flex items-center gap-5 flex-shrink-0">
              <LanguageToggle variant="menuHeader" />
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
                className="min-w-[40px] min-h-[40px] bg-stone-800/30 backdrop-blur-sm rounded-full p-2 flex items-center justify-center shadow-md hover:bg-stone-700/40 hover:border-white transition-colors duration-200 relative border-4 border-white/85"
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
                  <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </button>
              <div className="relative" ref={navDesktopRef}>
                <button
                  onClick={() => setIsNavOpen(!isNavOpen)}
                  className="min-w-[40px] min-h-[40px] p-2 flex items-center justify-center text-white border-4 border-white/85 bg-stone-800/30 backdrop-blur-sm rounded-full hover:bg-stone-700/40 transition-colors duration-200"
                  aria-expanded={isNavOpen}
                  aria-label="Toggle navigation menu"
                  aria-haspopup="true"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    {isNavOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                <div
                  className={`absolute top-full right-0 mt-2 w-48 z-50 rounded-xl overflow-hidden backdrop-blur-xl border border-white/30 shadow-lg origin-top-right transition-all duration-200 ease-out ${
                    isNavOpen ? 'opacity-100 visible scale-100 translate-y-0 bg-stone-800/95' : 'opacity-0 invisible scale-95 translate-y-1 pointer-events-none'
                  }`}
                >
                  <div className="py-2 px-2 flex flex-col gap-1">
                    {navDropdownLinks.map((link) => (
                      <Link
                        key={link.labelKey}
                        href={link.href}
                        onClick={() => setIsNavOpen(false)}
                        className="font-medium min-h-[44px] px-4 py-2.5 flex items-center text-sm text-white rounded-lg hover:bg-white/20"
                      >
                        {t(link.labelKey)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Cart />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-warmgray-800">
              {t('contact.getInTouch')}
            </h1>
            <p className="text-lg md:text-xl text-warmgray-600 max-w-2xl mx-auto font-light">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 lg:p-10">
            <ContactForm />
          </div>

          {/* Additional Contact Information */}
          <div className="text-center space-y-2 pt-4">
            <p className="text-sm text-warmgray-500">
              {t('contact.responseTime')}
            </p>
            <p className="text-sm text-warmgray-500">
              {t('contact.urgent')}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
