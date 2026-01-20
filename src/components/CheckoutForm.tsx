'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatCurrency } from '@/lib/utils'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

interface CheckoutFormProps {
  clientSecret: string
  orderNumber: string
  depositAmount: number
  onSuccess: () => void
}

function PaymentForm({ clientSecret, orderNumber, depositAmount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Payment form validation failed')
        setIsProcessing(false)
        return
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      console.log('💳 Payment confirmation result:', {
        hasError: !!confirmError,
        error: confirmError?.message,
        paymentIntentStatus: paymentIntent?.status,
      })

      if (confirmError) {
        console.error('❌ Payment confirmation error:', confirmError)
        setError(confirmError.message || 'Payment failed')
        setIsProcessing(false)
        return
      }

      // Check payment intent status
      if (paymentIntent?.status === 'succeeded') {
        console.log('✅ Payment succeeded, calling onSuccess')
        onSuccess()
      } else if (paymentIntent?.status === 'requires_action') {
        // Payment requires additional action (like 3D Secure)
        console.log('⚠️ Payment requires action')
        setError('Payment requires additional authentication. Please complete the verification.')
      } else {
        console.log('⚠️ Payment status:', paymentIntent?.status)
        setError(`Payment status: ${paymentIntent?.status}. Please check your payment method.`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-serif text-warmgray-800 mb-2">{t('checkout.paymentDetails')}</h2>
        <p className="text-sm text-warmgray-600">
          {t('nav.order')}: <span className="font-medium">{orderNumber}</span>
        </p>
        <p className="text-sm text-warmgray-600">
          {t('checkout.depositAmount')} <span className="font-medium">{formatCurrency(depositAmount)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" id="payment-form">
        <div className="border border-warmgray-200 rounded-md p-4" style={{ minHeight: '200px' }}>
          <PaymentElement
            options={{
              layout: 'tabs',
              fields: {
                billingDetails: 'auto',
              },
            }}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {!stripe && (
          <p className="text-xs text-warmgray-500 text-center mt-2">
            {t('checkout.loadingPaymentForm')}
          </p>
        )}

        <p className="text-xs text-warmgray-500 text-center mt-4">
          {t('checkout.securePayment')}
        </p>
      </form>

      {/* Payment button OUTSIDE the form to avoid Stripe interference */}
      <div 
        className="mt-8 pt-6 border-t border-warmgray-300"
      >
        <button
          type="button"
          onClick={async (e) => {
            e.preventDefault()
            if (!stripe || !elements) {
              setError('Payment form is not ready. Please wait a moment and try again.')
              return
            }
            const form = document.getElementById('payment-form') as HTMLFormElement
            if (form) {
              form.requestSubmit()
            }
          }}
          id="submit-payment-button"
          disabled={!stripe || isProcessing}
          style={{
            width: '100%',
            minHeight: '56px',
            padding: '16px 24px',
            backgroundColor: !stripe || isProcessing ? '#9ca3af' : '#1f2937',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: !stripe || isProcessing ? 'not-allowed' : 'pointer',
            display: 'block',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (stripe && !isProcessing) {
              e.currentTarget.style.backgroundColor = '#374151'
            }
          }}
          onMouseLeave={(e) => {
            if (stripe && !isProcessing) {
              e.currentTarget.style.backgroundColor = '#1f2937'
            }
          }}
        >
          {isProcessing ? (
            t('checkout.processingPayment')
          ) : !stripe ? (
            t('checkout.loadingPaymentForm')
          ) : (
            `${t('checkout.payDeposit')} ${formatCurrency(depositAmount)}`
          )}
        </button>
      </div>
    </div>
  )
}

export default function CheckoutForm(props: CheckoutFormProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-warmgray-200 rounded mb-4"></div>
          <div className="h-32 bg-warmgray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#856650',
            colorBackground: '#ffffff',
            colorText: '#171717',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '6px',
          },
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  )
}
