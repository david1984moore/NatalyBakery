'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { formatCurrency } from '@/lib/utils'
import CheckoutForm from '@/components/CheckoutForm'
import { CheckoutResponse } from '@/types/checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalAmount, getDepositAmount, getRemainingAmount, clearCart } = useCart()
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

  // CRITICAL: Guard against empty cart - improved version
  useEffect(() => {
    if (items.length === 0) {
      console.log('🚫 Empty cart detected, redirecting to menu')
      router.push('/menu')
    }
  }, [items.length, router])

  // Don't render anything until we confirm cart has items
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50/30">
        <div className="text-center">
          <p className="text-warmgray-600 mb-4">Loading...</p>
          <p className="text-sm text-warmgray-500">Redirecting to menu...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      })

      const data: CheckoutResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Checkout failed. Please try again.')
      }

      if (!data.clientSecret) {
        throw new Error('Payment form could not be initialized. Please try again.')
      }

      setCheckoutData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    router.push(`/checkout/success?orderId=${checkoutData?.orderId}&orderNumber=${checkoutData?.orderNumber}`)
  }

  if (checkoutData?.clientSecret) {
    return (
      <div className="min-h-screen bg-cream-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Home Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
              aria-label="Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
          <h1 className="text-3xl font-serif text-warmgray-800 mb-8 text-center">
            Complete Your Payment
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
    <div className="h-screen bg-cream-50/30 overflow-hidden flex flex-col">
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
            aria-label="Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <h1 className="text-2xl font-serif text-warmgray-800">
            Checkout
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4">
        <div className="max-w-4xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Customer Information Form */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-serif text-warmgray-800 mb-4">Customer Information</h2>
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-warmgray-700 mb-1">
                    Full Name *
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
                    Email *
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
                    Phone Number *
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
                    Special Instructions
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
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
              <h2 className="text-lg font-serif text-warmgray-800 mb-3">Order Summary</h2>
              <div className="space-y-2 mb-3">
                {items.map((item, index) => (
                  <div key={`${item.productName}-${item.variantName || ''}-${index}`} className="flex justify-between items-start pb-2 border-b border-warmgray-100">
                    <div>
                      <p className="text-xs font-medium text-warmgray-800">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-xs text-warmgray-500">{item.variantName}</p>
                      )}
                      <p className="text-xs text-warmgray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium text-warmgray-800">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-warmgray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-warmgray-700">Total:</span>
                  <span className="font-semibold text-warmgray-800">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-warmgray-600">Deposit (50%):</span>
                  <span className="font-medium text-warmgray-800">{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-warmgray-500">
                  <span>Remaining (due at pickup):</span>
                  <span>{formatCurrency(remainingAmount)}</span>
                </div>
                <div className="mt-2 p-2 bg-cream-100 rounded-md">
                  <p className="text-xs text-warmgray-600 text-center">
                    You will pay the 50% deposit now. The remaining balance is due at pickup.
                  </p>
                </div>
              </div>

              {/* Continue to Payment Button */}
              <div className="mt-3">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isLoading || !isFormValid}
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
                  {isLoading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
