'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
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

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
      } else {
        // Payment succeeded
        onSuccess()
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
        <h2 className="text-xl font-serif text-warmgray-800 mb-2">Payment Details</h2>
        <p className="text-sm text-warmgray-600">
          Order: <span className="font-medium">{orderNumber}</span>
        </p>
        <p className="text-sm text-warmgray-600">
          Deposit Amount: <span className="font-medium">{formatCurrency(depositAmount)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-warmgray-200 rounded-md p-4">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-warmgray-800 text-white py-3 rounded-md hover:bg-warmgray-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : !stripe ? 'Loading payment form...' : `Pay Deposit ${formatCurrency(depositAmount)}`}
        </button>
        
        {!stripe && (
          <p className="text-xs text-warmgray-500 text-center mt-2">
            Please wait while we load the secure payment form...
          </p>
        )}

        <p className="text-xs text-warmgray-500 text-center">
          Your payment is secure and encrypted. We never store your card details.
        </p>
      </form>
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
