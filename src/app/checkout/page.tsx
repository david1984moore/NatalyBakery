'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatCurrency } from '@/lib/utils'
import CheckoutForm from '@/components/CheckoutForm'
import LanguageToggle from '@/components/LanguageToggle'
import Cart from '@/components/Cart'
import { CheckoutResponse } from '@/types/checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalAmount, getDepositAmount, getRemainingAmount, clearCart } = useCart()
  const { t } = useLanguage()
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: '',
  })
  const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // DEBUG: Track items array stability
  const itemsRef = useRef(items)
  if (itemsRef.current !== items) {
    console.log('⚠️ ITEMS ARRAY CHANGED REFERENCE', {
      oldLength: itemsRef.current.length,
      newLength: items.length,
      timestamp: Date.now()
    })
    itemsRef.current = items
  }

  // DEBUG: Comprehensive render logging
  console.log('=== CHECKOUT RENDER ===', {
    itemsCount: items.length,
    hasItems: items.length > 0,
    isLoading,
    customerInfoKeys: Object.keys(customerInfo),
    hasError: !!error,
    hasCheckoutData: !!checkoutData,
    timestamp: Date.now()
  })

  const totalAmount = getTotalAmount()
  const depositAmount = getDepositAmount()
  const remainingAmount = getRemainingAmount()

  // Delivery time options: 6:30pm - 9:30pm in 30-min increments
  const deliveryTimeOptions = ['6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm', '9:00pm', '9:30pm']

  // Minimum delivery date: before 9:00am can select today; at or after 9:00am, soonest is tomorrow.
  const now = new Date()
  const cutOffHour = 9
  const isBeforeCutoff = now.getHours() < cutOffHour
  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDeliveryDate = isBeforeCutoff ? formatLocalDate(now) : formatLocalDate(tomorrow)
  const isSameDayBlocked = !isBeforeCutoff

  // Validate that all required fields are filled
  const isFormValid = customerInfo.name.trim() !== '' && 
                      customerInfo.email.trim() !== '' && 
                      customerInfo.phone.trim() !== '' &&
                      customerInfo.deliveryAddress.trim() !== '' &&
                      customerInfo.deliveryDate.trim() !== '' &&
                      customerInfo.deliveryTime.trim() !== ''

  // CRITICAL: Guard against empty cart - but don't redirect if we're completing payment
  const [isCompletingPayment, setIsCompletingPayment] = useState(false)
  
  useEffect(() => {
    if (items.length === 0 && !isCompletingPayment) {
      console.log('🚫 Empty cart detected, redirecting to menu')
      router.push('/menu')
    }
  }, [items.length, router, isCompletingPayment])


  // Don't render anything until we confirm cart has items
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50/30">
        <div className="text-center">
          <p className="text-warmgray-600 mb-4">{t('common.loading')}</p>
          <p className="text-sm text-warmgray-500">{t('menu.loading')}</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    console.log('🚀 Starting checkout submission...', {
      itemsCount: items.length,
      customerInfo,
      timestamp: new Date().toISOString()
    })

    try {
      const requestBody = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        deliveryAddress: customerInfo.deliveryAddress,
        deliveryDate: customerInfo.deliveryDate,
        deliveryTime: customerInfo.deliveryTime,
        items: items.map((item) => ({
          productName: item.variantName 
            ? `${item.productName} - ${item.variantName}`
            : item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        specialInstructions: customerInfo.specialInstructions || undefined,
      }

      console.log('📤 Sending request to /api/checkout', requestBody)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📥 Received response', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      const data: CheckoutResponse = await response.json()

      console.log('📦 Response data', data)

      if (!response.ok || !data.success) {
        const errorMessage = data.error || 'Checkout failed. Please try again.'
        console.error('❌ Checkout failed', errorMessage, data)
        throw new Error(errorMessage)
      }

      if (!data.clientSecret) {
        console.error('❌ Missing clientSecret in response', data)
        throw new Error('Payment form could not be initialized. Please try again.')
      }

      console.log('✅ Checkout successful, setting checkout data')
      setCheckoutData(data)
    } catch (err) {
      console.error('💥 Checkout error caught', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during checkout. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    // Set flag to prevent cart-empty redirect
    setIsCompletingPayment(true)
    
    // Save order info before navigation
    const orderId = checkoutData?.orderId
    const orderNumber = checkoutData?.orderNumber
    
    // Navigate to success page FIRST
    router.push(`/checkout/success?orderId=${orderId}&orderNumber=${orderNumber}`)
    
    // Clear cart after navigation (this won't trigger redirect because isCompletingPayment is true)
    clearCart()
  }

  if (checkoutData?.clientSecret) {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    
    return (
      <div className="min-h-screen bg-cream-50/30 flex flex-col relative">
        <Cart />
        {/* Navigation Bar - Updated header (matches menu/contact pages) */}
        <div
          className="fixed top-0 left-0 right-0 z-[100] bg-hero shadow-sm safe-top w-full max-w-[100vw] overflow-visible"
          style={{ minHeight: '40px' }}
        >
          <div className="bg-hero border-b border-hero-600 flex flex-col min-h-[40px] overflow-visible">
            {/* Mobile Layout (< 768px) - brand left; nav links, language, cart right */}
            <div className="md:hidden flex flex-1 items-center justify-between gap-2 pl-2.5 pr-3 min-h-[40px] -translate-y-1.5 min-w-0">
              <Link
                href="/"
                className="min-w-0 flex-shrink flex items-center h-full outline-none focus:outline-none focus-visible:ring-0"
                aria-label="Home"
              >
                <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow">Caramel & Jo</span>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Link href="/menu" className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center">
                  {t('nav.menu')}
                </Link>
                <Link href="/contact" className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center">
                  {t('nav.contact')}
                </Link>
                <LanguageToggle variant="menuHeader" />
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
                  className="shrink-0 min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] bg-stone-800/45 backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center shadow-md md:hover:bg-stone-700/55 md:hover:border-white transition-colors duration-200 relative border-[3px] border-white/85"
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

            {/* Desktop Layout (>= 768px) - brand left; nav links, language, cart right */}
            <div className="hidden md:flex flex-1 items-center justify-between pl-4 pr-8 lg:pl-6 lg:pr-10 min-h-[40px] -translate-y-1.5">
              <Link
                href="/"
                className="flex-shrink-0 flex items-center h-full outline-none focus:outline-none focus-visible:ring-0"
                aria-label="Home"
              >
                <span className="text-white font-nav-playfair text-3xl lg:text-4xl xl:text-5xl font-extrabold brand-header-shadow">Caramel & Jo</span>
              </Link>
              <div className="flex items-center gap-5 flex-shrink-0">
                <Link href="/menu" className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center">
                  {t('nav.menu')}
                </Link>
                <Link href="/contact" className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center">
                  {t('nav.contact')}
                </Link>
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
        
        {/* Main Content - Centered in viewport */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 md:pb-12">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-serif text-warmgray-800 mb-8 text-center">
              {t('checkout.completePayment')}
            </h1>
            <CheckoutForm
              clientSecret={checkoutData.clientSecret}
              orderNumber={checkoutData.orderNumber || ''}
              depositAmount={depositAmount}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </div>
    )
  }

  console.log('🏗️ Rendering page container')
  
  return (
    <div className="min-h-screen bg-cream-50/30 flex flex-col relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-[calc(100vw-2rem)]">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-warmgray-800 will-change-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-warmgray-800 font-medium">{t('checkout.processing')}</span>
            </div>
          </div>
        </div>
      )}
      <Cart />
      {/* Navigation Bar - Updated header (matches menu/contact pages) */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] bg-hero shadow-sm safe-top w-full max-w-[100vw] overflow-visible"
        style={{ minHeight: '40px' }}
      >
        <div className="bg-hero border-b border-hero-600 flex flex-col min-h-[40px] overflow-visible">
          {/* Mobile Layout (< 768px) - brand left; nav links, language, cart right */}
          <div className="md:hidden flex items-center justify-between gap-2 pl-2.5 pr-3 min-h-[40px] -translate-y-1.5 min-w-0">
            <Link
              href="/"
              className="min-w-0 flex-shrink flex items-center h-full outline-none focus:outline-none focus-visible:ring-0"
              aria-label="Home"
            >
              <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow">Caramel & Jo</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link href="/menu" className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center">
                {t('nav.menu')}
              </Link>
              <Link href="/contact" className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center">
                {t('nav.contact')}
              </Link>
              <LanguageToggle variant="menuHeader" />
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))}
                className="shrink-0 min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] bg-stone-800/45 backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center shadow-md md:hover:bg-stone-700/55 md:hover:border-white transition-colors duration-200 relative border-[3px] border-white/85"
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
                {items.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Layout (>= 768px) - brand left; nav links, language, cart right */}
          <div className="hidden md:flex flex-1 items-center justify-between pl-4 pr-8 lg:pl-6 lg:pr-10 min-h-[40px] -translate-y-1.5">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center h-full outline-none focus:outline-none focus-visible:ring-0"
              aria-label="Home"
            >
              <span className="text-white font-nav-playfair text-3xl lg:text-4xl xl:text-5xl font-extrabold brand-header-shadow">Caramel & Jo</span>
            </Link>
            <div className="flex items-center gap-5 flex-shrink-0">
              <Link href="/menu" className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center">
                {t('nav.menu')}
              </Link>
              <Link href="/contact" className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center">
                {t('nav.contact')}
              </Link>
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
                {items.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content - Centered in viewport */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 sm:pt-24 pb-8 md:pb-12 min-w-0 overflow-x-hidden">
        <div className="w-full max-w-4xl min-w-0">
          {/* Page Title (visible on mobile only) */}
          <div className="mb-6 md:hidden">
            <h1 className="text-xl sm:text-2xl font-serif text-warmgray-800 text-center">
              {t('checkout.title')}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch min-w-0">
            {/* Checkout form */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-w-0 overflow-hidden">
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-3 flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="space-y-3 min-w-0 overflow-hidden">
                  <div className="min-w-0 w-full">
                    <label htmlFor="name" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.fullName')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    />
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="email" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    />
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="phone" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    />
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="deliveryAddress" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.deliveryAddress')}
                    </label>
                    <input
                      type="text"
                      id="deliveryAddress"
                      required
                      placeholder={t('checkout.placeholder.address')}
                      value={customerInfo.deliveryAddress}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryAddress: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    />
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="deliveryDate" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.deliveryDate')}
                    </label>
                    <input
                      type="date"
                      id="deliveryDate"
                      required
                      min={minDeliveryDate}
                      value={customerInfo.deliveryDate}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryDate: e.target.value })}
                      className="checkout-delivery-date-input w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    />
                    {isSameDayBlocked && (
                      <p className="text-xs text-warmgray-500 mt-1" role="status">
                        {t('checkout.sameDayCutoffNote')}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="deliveryTime" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.deliveryTime')}
                    </label>
                    <p className="text-xs text-warmgray-500 mb-1">{t('checkout.deliveryTimeWindow')}</p>
                    <select
                      id="deliveryTime"
                      required
                      value={customerInfo.deliveryTime}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryTime: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    >
                      <option value="">{t('checkout.selectTime')}</option>
                      {deliveryTimeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="specialInstructions" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.specialInstructions')}
                    </label>
                    <textarea
                      id="specialInstructions"
                      rows={2}
                      placeholder={t('checkout.placeholder.specialInstructions')}
                      value={customerInfo.specialInstructions}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, specialInstructions: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none box-border"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-md text-sm font-medium">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-semibold">{t('common.error')}</p>
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col">
              <h2 className="text-lg font-serif text-warmgray-800 mb-4">{t('checkout.orderSummary')}</h2>
              <div className="space-y-2 mb-3 flex-1">
                {items.map((item, index) => (
                  <div key={`${item.productName}-${item.variantName || ''}-${index}`} className="flex justify-between items-start pb-2 border-b border-warmgray-100">
                    <div>
                      <p className="text-xs font-medium text-warmgray-800">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-xs text-warmgray-500">{item.variantName}</p>
                      )}
                      <p className="text-xs text-warmgray-600">{t('cart.qty')} {item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium text-warmgray-800">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-warmgray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-warmgray-700">{t('cart.total')}</span>
                  <span className="font-semibold text-warmgray-800">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-warmgray-600">{t('cart.deposit')}</span>
                  <span className="font-medium text-warmgray-800">{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-warmgray-500">
                  <span>{t('cart.remaining')}</span>
                  <span>{formatCurrency(remainingAmount)}</span>
                </div>
                <div className="mt-2 p-2 bg-cream-100 rounded-md">
                  <p className="text-xs text-warmgray-600 text-center">
                    {t('checkout.depositNote')}
                  </p>
                </div>
              </div>

              {/* Continue to Payment Button */}
              <div className="mt-3">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isLoading || !isFormValid}
                  onClick={(e) => {
                    console.log('🔘 Button clicked', {
                      isLoading,
                      isFormValid,
                      itemsCount: items.length,
                      customerInfo
                    })
                    // Ensure form submission happens
                    if (!isLoading && isFormValid) {
                      const form = document.getElementById('checkout-form') as HTMLFormElement
                      if (form) {
                        console.log('📝 Triggering form submit')
                        form.requestSubmit()
                      }
                    }
                  }}
                  style={{
                    display: 'block',
                    visibility: 'visible',
                    opacity: (isLoading || !isFormValid) ? 0.5 : 1,
                    width: '100%',
                    minHeight: '44px',
                    padding: '12px 16px',
                    backgroundColor: '#1f2937', // warmgray-800 equivalent
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: (isLoading || !isFormValid) ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && isFormValid) {
                      e.currentTarget.style.backgroundColor = '#374151' // warmgray-700
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && isFormValid) {
                      e.currentTarget.style.backgroundColor = '#1f2937' // warmgray-800
                    }
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white will-change-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('checkout.processing')}
                    </span>
                  ) : (
                    t('checkout.continueToPayment')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
