'use client'

import ContactForm from '@/components/ContactForm'
import LanguageToggle from '@/components/LanguageToggle'
import Cart from '@/components/Cart'
import { UtensilsCrossed } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import SmoothLink from '@/components/SmoothLink'

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
    <main data-scrollable className="min-h-screen min-h-[100dvh]" style={{ background: 'linear-gradient(135deg, #FCF8F4 0%, #F6EFE6 100%)' }}>
      {/* Header - mobile: fixed; desktop: sticky, no strip, subtle shadow */}
      <div
        className="fixed top-0 left-0 right-0 z-50 safe-top w-full max-w-[100vw] overflow-visible max-md:bg-hero-footer-gradient md:sticky md:top-0 md:bg-background md:backdrop-blur-sm header-bar-shadow shadow-sm min-h-[40px] md:min-h-[80px]"
      >
        <div className="max-md:bg-hero-footer-gradient border-b-[3px] border-b-white/85 flex flex-col min-h-[40px] md:min-h-[80px] md:bg-transparent">
          {/* Mobile Layout (< 768px) - unchanged */}
          <div className="md:hidden flex flex-1 items-center justify-between gap-2 pl-2.5 pr-3 min-h-[40px] -translate-y-1.5 min-w-0">
            <SmoothLink
              href="/"
              className="flex-shrink-0 flex items-center h-full"
              aria-label="Home"
            >
              <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow">Caramel & Jo</span>
            </SmoothLink>
            <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
              <LanguageToggle variant="menuHeader" />
              {visibleNavLinks.map((link) => (
                <SmoothLink
                  key={link.labelKey}
                  href={link.href}
                  aria-label={t(link.labelKey)}
                  className="hero-btn-header hero-footer-btn-taper min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  <UtensilsCrossed className="w-6 h-6 text-white" strokeWidth={2.5} stroke="white" fill="white" />
                </SmoothLink>
              ))}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
                className="hero-btn-header hero-footer-btn-taper min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center md:hover:opacity-90 transition-colors duration-200 relative border-[3px] border-white"
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

          {/* Desktop Layout (>= 768px) - original white bar */}
          <div className="hidden md:flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8 h-14 md:h-20 -translate-y-0">
            <SmoothLink
              href="/"
              className="flex-shrink-0 flex items-center h-full"
              aria-label="Home"
            >
              <span className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap">Caramel & Jo</span>
            </SmoothLink>
            <div className="flex items-center gap-8 lg:gap-11 flex-shrink-0">
              <LanguageToggle variant="menu" />
              {visibleNavLinks.map((link) => (
                <SmoothLink
                  key={link.labelKey}
                  href={link.href}
                  prefetch={true}
                  aria-label={t(link.labelKey)}
                  className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
                >
                  <UtensilsCrossed className="w-5 h-5" strokeWidth={2} />
                </SmoothLink>
              ))}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
                className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-700 hover:bg-warmbrown-500 hover:text-white rounded-full border border-transparent hover:border-warmbrown-500 transition-colors duration-200 relative"
                aria-label="Shopping cart"
              >
                <svg
                  className="w-5 h-5"
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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer so content is not under fixed header on mobile (desktop uses sticky so no spacer needed) */}
      <div className="h-[52px] md:h-0 md:min-h-0 shrink-0" aria-hidden />

      <Cart />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-32 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="pt-10 md:pt-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-warmgray-800">
              {t('contact.getInTouch')}
            </h1>
            <p className="text-lg md:text-xl text-warmgray-700 max-w-2xl mx-auto font-light">
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
