'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Cart from '@/components/Cart'
import SmoothLink from '@/components/SmoothLink'
import { usePageHeroHeader } from '@/hooks/usePageHeroHeader'

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
  usePageHeroHeader()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const orderId = searchParams.get('orderId')
  const orderNumber = searchParams.get('orderNumber')
  const isPendingOrder = searchParams.get('pending') === '1'
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      <div className="page-content-wrapper">
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F8ECDF 0%, #EFE2D2 100%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-warmgray-200 border-t-warmgray-800 mx-auto mb-4 will-change-transform"></div>
          <p className="text-warmgray-600">{t('success.loadingOrder')}</p>
        </div>
      </div>
      </div>
    )
  }

  return (
    <div className="page-content-wrapper">
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #F8ECDF 0%, #EFE2D2 100%)' }}>
      <Cart />
      {/* Spacer so content starts below fixed PageHeader (matches checkout/menu pages) */}
      <div className="h-[calc(52px+env(safe-area-inset-top,0px))] md:h-0 md:min-h-0 shrink-0" aria-hidden />

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
              {isPendingOrder ? t('success.thankYouPending') : t('success.thankYou')}
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
                {isPendingOrder ? (
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t('success.paymentArranged')}</span>
                  </li>
                ) : (
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t('success.balanceDue')}</span>
                  </li>
                )}
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('success.readyForPickup')}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
              <SmoothLink
                href="/"
                className="min-h-[44px] px-6 py-2.5 flex items-center justify-center border-2 border-hero-600 bg-headerButtonFill text-white rounded-md md:hover:bg-hero-600 transition-colors duration-200 font-medium"
              >
                {t('nav.home')}
              </SmoothLink>
              <SmoothLink
                href="/menu"
                className="min-h-[44px] px-6 py-2.5 flex items-center justify-center border-2 border-hero-600 bg-headerButtonFill text-white rounded-md md:hover:bg-hero-600 transition-colors duration-200 font-medium"
              >
                {t('nav.shop')}
              </SmoothLink>
              <SmoothLink
                href="/contact"
                className="min-h-[44px] px-6 py-2.5 flex items-center justify-center rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200"
              >
                {t('success.contactUs')}
              </SmoothLink>
            </div>
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
        <div className="page-content-wrapper">
          <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F8ECDF 0%, #EFE2D2 100%)' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-warmgray-200 border-t-warmgray-800 mx-auto mb-4 will-change-transform"></div>
              <p className="text-warmgray-600">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  )
}
