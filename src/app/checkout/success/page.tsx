'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import LanguageToggle from '@/components/LanguageToggle'
import Cart from '@/components/Cart'
import Link from 'next/link'

interface OrderData {
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  depositAmount: number
  remainingAmount: number
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const { items } = useCart()
  const orderId = searchParams.get('orderId')
  const orderNumber = searchParams.get('orderNumber')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    // In a real app, you might fetch order details from an API
    // For now, we'll just display what we have from the URL params
    setIsLoading(false)
  }, [orderId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-warmgray-200 border-t-warmgray-800 mx-auto mb-4 will-change-transform"></div>
          <p className="text-warmgray-600">{t('success.loadingOrder')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Cart />
      {/* Navigation Bar - matches menu page structure */}
      <div
        className="sticky top-0 left-0 right-0 z-[100] safe-top w-full max-w-[100vw] overflow-visible md:bg-white/95 md:backdrop-blur-sm md:border-b md:border-warmgray-200 md:shadow-sm bg-hero shadow-sm"
        style={{ minHeight: '40px' }}
      >
        <div className="relative z-10 flex flex-col min-h-[40px] bg-hero border-b-[3px] border-b-white/85 md:bg-transparent md:border-b md:border-warmgray-200">
          {/* Mobile header */}
          <div className="md:hidden flex flex-1 items-center justify-between gap-2 pl-2.5 pr-3 min-h-[40px] -translate-y-1.5 min-w-0">
            <Link href="/" className="flex-shrink-0 flex items-center h-full" aria-label="Home">
              <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow">
                Caramel & Jo
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link
                href="/contact"
                className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center"
              >
                {t('nav.contact')}
              </Link>
              <LanguageToggle variant="menuHeader" />
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
                className="min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] bg-stone-800/45 backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center shadow-md md:hover:bg-stone-700/55 md:hover:border-white transition-colors duration-200 relative border-[3px] border-white/85"
                aria-label="Shopping cart"
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop header - matches menu page */}
          <div className="hidden md:flex flex-1 items-center px-4 sm:px-6 lg:px-8 h-14 md:h-16 -translate-y-0" style={{ minHeight: '40px' }}>
            <Link href="/" className="flex-shrink-0 flex items-center h-full" aria-label="Home">
              <span className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap">
                Caramel & Jo
              </span>
            </Link>
            <div className="flex-1 min-w-0" aria-hidden="true" />
            <div className="flex-shrink-0 flex items-center gap-6 lg:gap-8">
              <Link
                href="/contact"
                className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200"
              >
                {t('nav.contact')}
              </Link>
              <LanguageToggle variant="menu" />
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
                className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-700 hover:bg-warmbrown-500 hover:text-white rounded-full border border-transparent hover:border-warmbrown-500 transition-colors duration-200 relative"
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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

      <div className="menu-content-top flex items-start relative z-0 safe-bottom pt-4 md:pt-6 pb-24 md:pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-warmgray-200 shadow-sm p-6 sm:p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-xl md:text-3xl font-serif text-warmgray-800 mb-4">{t('success.orderConfirmed')}</h1>
            <p className="text-warmgray-600 text-sm md:text-base mb-8">
              {t('success.thankYou')}
            </p>

            {orderNumber && (
              <div className="border border-warmgray-300 rounded-md p-4 mb-6 bg-background">
                <p className="text-sm text-warmgray-600 mb-1">{t('success.orderNumber')}</p>
                <p className="text-xl font-semibold text-warmgray-800">{orderNumber}</p>
              </div>
            )}

            <div className="border border-warmgray-300 rounded-md p-6 mb-6 text-left bg-background">
              <h2 className="text-lg font-serif text-warmgray-800 mb-4">{t('success.whatsNext')}</h2>
              <ul className="space-y-2 text-sm text-warmgray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('success.confirmationEmail')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('success.readyForPickup')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('success.balanceDue')}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
              <Link
                href="/"
                className="min-h-[44px] px-6 py-2.5 flex items-center justify-center border-2 border-hero-600 bg-headerButtonFill text-white rounded-md md:hover:bg-hero-600 transition-colors duration-200 font-medium"
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/menu"
                className="min-h-[44px] px-6 py-2.5 flex items-center justify-center border-2 border-hero-600 bg-headerButtonFill text-white rounded-md md:hover:bg-hero-600 transition-colors duration-200 font-medium"
              >
                {t('nav.shop')}
              </Link>
              <Link
                href="/contact"
                className="min-h-[44px] px-6 py-2.5 flex items-center justify-center rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200"
              >
                {t('success.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-warmgray-200 border-t-warmgray-800 mx-auto mb-4 will-change-transform"></div>
            <p className="text-warmgray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  )
}
