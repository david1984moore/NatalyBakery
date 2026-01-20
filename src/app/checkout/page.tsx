'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatCurrency } from '@/lib/utils'
import CheckoutForm from '@/components/CheckoutForm'
import LanguageToggle from '@/components/LanguageToggle'
import { CheckoutResponse } from '@/types/checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalAmount, getDepositAmount, getRemainingAmount, clearCart } = useCart()
  const { t } = useLanguage()
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
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

  // Validate that all required fields are filled
  const isFormValid = customerInfo.name.trim() !== '' && 
                      customerInfo.email.trim() !== '' && 
                      customerInfo.phone.trim() !== ''

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
        customerPhone: customerInfo.phone || undefined,
        items: items.map((item) => ({
          productName: item.variantName 
            ? `${item.productName} - ${item.variantName}`
            : item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        notes: customerInfo.notes || undefined,
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
        const errorMessage = data.error || data.message || 'Checkout failed. Please try again.'
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
    return (
      <div className="min-h-screen bg-cream-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Home Button and Language Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center px-3 py-1.5"
              aria-label="Home"
            >
              <span className="text-black font-nav-tangerine text-xl md:text-2xl font-bold">Caramel & Jo</span>
            </Link>
            <LanguageToggle variant="menu" />
          </div>
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
    )
  }

  console.log('🏗️ Rendering page container')
  
  return (
    <div className="h-screen bg-cream-50/30 overflow-hidden flex flex-col relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-warmgray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-warmgray-800 font-medium">{t('checkout.processing')}</span>
            </div>
          </div>
        </div>
      )}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center px-3 py-1.5"
            aria-label="Home"
          >
            <span className="text-black font-nav-tangerine text-xl md:text-2xl font-bold">Caramel & Jo</span>
          </Link>
          <h1 className="text-2xl font-serif text-warmgray-800">
            {t('checkout.title')}
          </h1>
          <div className="w-10 flex justify-end">
            <LanguageToggle variant="menu" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4">
        <div className="max-w-4xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Customer Information Form */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-serif text-warmgray-800 mb-4">{t('checkout.customerInfo')}</h2>
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-warmgray-700 mb-1">
                    {t('checkout.fullName')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-warmgray-700 mb-1">
                    {t('checkout.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-warmgray-700 mb-1">
                    {t('checkout.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs font-medium text-warmgray-700 mb-1">
                    {t('checkout.specialInstructions')}
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
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
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
              <h2 className="text-lg font-serif text-warmgray-800 mb-3">{t('checkout.orderSummary')}</h2>
              <div className="space-y-2 mb-3">
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
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
