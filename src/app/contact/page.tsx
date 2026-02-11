'use client'

import ContactForm from '@/components/ContactForm'
import LanguageToggle from '@/components/LanguageToggle'
import Cart from '@/components/Cart'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

const navLinks = [
  { href: '/menu', labelKey: 'nav.menu' as const },
  { href: '/contact', labelKey: 'nav.contact' as const },
]

export default function ContactPage() {
  const visibleNavLinks = navLinks.filter((link) => link.href !== '/contact')
  const { t } = useLanguage()
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <main className="min-h-screen bg-cream-50/30">
      {/* Header - brand left; nav links, language, cart right */}
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-hero shadow-sm safe-top w-full max-w-[100vw] overflow-visible"
        style={{ minHeight: '40px' }}
      >
        <div className="bg-hero border-b border-hero-600 flex flex-col min-h-[40px]">
          {/* Mobile Layout (< 768px) */}
          <div className="md:hidden flex flex-1 items-center justify-between gap-2 pl-2.5 pr-3 min-h-[40px] -translate-y-1.5 min-w-0">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center h-full"
              aria-label="Home"
            >
              <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow">Caramel & Jo</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
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
                  <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Layout (>= 768px) */}
          <div className="hidden md:flex flex-1 items-center justify-between pl-4 pr-8 lg:pl-6 lg:pr-10 min-h-[40px] -translate-y-1.5" style={{ minHeight: '40px' }}>
            <Link
              href="/"
              className="flex-shrink-0 flex items-center h-full"
              aria-label="Home"
            >
              <span className="text-white font-nav-playfair text-3xl lg:text-4xl xl:text-5xl font-extrabold brand-header-shadow">Caramel & Jo</span>
            </Link>
            <div className="flex items-center gap-5 flex-shrink-0">
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.labelKey}
                  href={link.href}
                  className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <LanguageToggle variant="menuHeader" />
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
                className="min-w-[44px] min-h-[44px] bg-stone-800/45 backdrop-blur-sm rounded-full p-2 flex items-center justify-center shadow-md hover:bg-stone-700/55 hover:border-white transition-colors duration-200 relative border-[3px] border-white/85"
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
