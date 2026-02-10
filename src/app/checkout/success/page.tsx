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
      <div className="min-h-screen bg-cream-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-warmgray-200 border-t-warmgray-800 mx-auto mb-4 will-change-transform"></div>
          <p className="text-warmgray-600">{t('success.loadingOrder')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50/30">
      <Cart />
      {/* Navigation Bar - Fixed at top with uniform format */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm border-b border-warmgray-200 shadow-sm safe-top flex items-center min-h-[40px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full min-h-[40px] -translate-y-1.5">
          {/* Home Button */}
          <Link
            href="/"
            className="flex-shrink-0 px-2 sm:px-3 py-1.5 flex items-center h-full"
            aria-label="Home"
          >
            <span className="text-black font-nav-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold brand-header-shadow">Caramel & Jo</span>
          </Link>
          
          {/* Language Toggle and Cart Button */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            <Link
              href="/contact"
              className="font-ui min-h-[46px] md:min-h-[52px] px-2.5 md:px-3 py-2 md:py-2.5 flex items-center rounded-xl border-2 border-warmgray-300 bg-transparent text-warmgray-700 font-medium text-xs md:text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {t('nav.contact')}
            </Link>
            <LanguageToggle variant="menu" />
            <div className="relative ml-1 flex items-center">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('cart:toggle'))
                }}
                className="min-w-[48px] min-h-[48px] bg-white/95 backdrop-blur-sm rounded-full p-3 flex items-center justify-center shadow-md hover:bg-tan hover:border-tan transition-colors duration-200 relative border-4 border-warmgray-200 group"
                aria-label="Shopping cart"
              >
                <svg
                  className="w-6 h-6 text-warmgray-700 group-hover:text-white"
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

      <div className="pt-16 sm:pt-20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
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

            <h1 className="text-3xl font-serif text-warmgray-800 mb-4">{t('success.orderConfirmed')}</h1>
            <p className="text-warmgray-600 mb-8">
              {t('success.thankYou')}
            </p>

            {orderNumber && (
              <div className="bg-cream-50 rounded-md p-4 mb-6">
                <p className="text-sm text-warmgray-600 mb-1">{t('success.orderNumber')}</p>
                <p className="text-xl font-semibold text-warmgray-800">{orderNumber}</p>
              </div>
            )}

            <div className="bg-warmgray-50 rounded-md p-6 mb-6 text-left">
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
                className="min-h-[44px] px-6 py-2.5 flex items-center justify-center bg-warmgray-800 text-white rounded-md hover:bg-warmgray-700 transition-colors duration-200 font-medium"
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/menu"
                className="min-h-[44px] px-6 py-2.5 flex items-center justify-center bg-warmgray-800 text-white rounded-md hover:bg-warmgray-700 transition-colors duration-200 font-medium"
              >
                {t('nav.shop')}
              </Link>
              <Link
                href="/contact"
                className="min-h-[44px] px-6 py-2.5 flex items-center justify-center bg-white border border-warmgray-300 text-warmgray-700 rounded-md hover:bg-cream-50 transition-colors duration-200 font-medium"
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
        <div className="min-h-screen bg-cream-50/30 flex items-center justify-center">
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
