'use client'

import ContactForm from '@/components/ContactForm'
import LanguageToggle from '@/components/LanguageToggle'
import Cart from '@/components/Cart'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

export default function ContactPage() {
  const { t } = useLanguage()
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  return (
    <main className="min-h-screen bg-cream-50/30">
      {/* Header Container - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warmgray-200 shadow-sm safe-top" style={{ minHeight: '64px' }}>
        {/* Home Button - Vertically centered */}
        <div className="fixed left-3 sm:left-4 md:left-6 lg:left-8 safe-left" style={{ top: '50%', transform: 'translateY(-50%)' }}>
          <Link
            href="/"
            className="flex-shrink-0 px-2 sm:px-3 py-1.5 flex items-center"
            aria-label="Home"
          >
            <span className="text-black font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold">Caramel & Jo</span>
          </Link>
        </div>
        
        {/* Nav links, Language Toggle and Cart - Vertically centered */}
        <div className="fixed right-3 sm:right-4 md:right-6 lg:right-8 safe-right flex items-center gap-3 sm:gap-6 flex-shrink-0" style={{ top: '50%', transform: 'translateY(-50%)' }}>
        <Link
          href="/menu"
          className="min-h-[44px] px-3 py-2 sm:py-1.5 flex items-center text-sm border border-warmgray-300 bg-transparent text-warmgray-700 rounded-md hover:bg-tan hover:border-tan hover:text-white transition-colors duration-200 font-medium whitespace-nowrap"
        >
          {t('nav.menu')}
        </Link>
        <Link
          href="/menu"
          className="min-h-[44px] px-3 py-2 sm:py-1.5 flex items-center text-sm border border-warmgray-300 bg-transparent text-warmgray-700 rounded-md hover:bg-tan hover:border-tan hover:text-white transition-colors duration-200 font-medium whitespace-nowrap"
        >
          {t('nav.order')}
        </Link>
        <LanguageToggle variant="menu" />
        <div className="relative">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
            className="group min-w-[44px] min-h-[44px] px-3 py-2 sm:py-1.5 flex items-center justify-center text-sm border border-warmgray-300 bg-transparent text-warmgray-700 rounded-md hover:bg-tan hover:border-tan hover:text-white transition-colors duration-200 font-medium"
            aria-label="Shopping cart"
          >
            <svg
              className="w-5 h-5 text-warmgray-700 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
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
      
      <Cart />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
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
