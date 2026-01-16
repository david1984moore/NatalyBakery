'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

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

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const orderNumber = searchParams.get('orderNumber')
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
      <div className="min-h-screen bg-cream-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warmgray-800 mx-auto mb-4"></div>
          <p className="text-warmgray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
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

          <h1 className="text-3xl font-serif text-warmgray-800 mb-4">Order Confirmed!</h1>
          <p className="text-warmgray-600 mb-8">
            Thank you for your order. We've received your deposit payment and will begin preparing your order.
          </p>

          {orderNumber && (
            <div className="bg-cream-50 rounded-md p-4 mb-6">
              <p className="text-sm text-warmgray-600 mb-1">Order Number</p>
              <p className="text-xl font-semibold text-warmgray-800">{orderNumber}</p>
            </div>
          )}

          <div className="bg-warmgray-50 rounded-md p-6 mb-6 text-left">
            <h2 className="text-lg font-serif text-warmgray-800 mb-4">What's Next?</h2>
            <ul className="space-y-2 text-sm text-warmgray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>You'll receive a confirmation email shortly with your order details.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>We'll contact you when your order is ready for pickup.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>The remaining balance will be due at pickup (cash or card accepted).</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-2.5 bg-warmgray-800 text-white rounded-md hover:bg-warmgray-700 transition-colors duration-200 font-medium"
            >
              Return to Home
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-white border border-warmgray-300 text-warmgray-700 rounded-md hover:bg-cream-50 transition-colors duration-200 font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
