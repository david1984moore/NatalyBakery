'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryLocation: string
  deliveryDate: string | null
  deliveryTime: string | null
  deliveryConfirmed: boolean
  deliveryConfirmedAt: string | null
  status: string
  totalAmount: number
  depositAmount: number
  remainingAmount: number
  depositPaid: boolean
  notes: string | null
  createdAt: string
  items: OrderItem[]
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const getAuthHeaders = (): HeadersInit | undefined => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null
    return token ? { Authorization: `Bearer ${token}` } : undefined
  }

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      })
      const data = await res.json()

      if (res.status === 401) {
        sessionStorage.removeItem('admin_token')
        setAuthenticated(false)
        setLoading(false)
        return
      }

      if (data.success && data.order) {
        setOrder(data.order)
        setAuthenticated(true)
      } else {
        setOrder(null)
        setAuthenticated(true)
      }
    } catch {
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelivery = async () => {
    setConfirming(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}/confirm`, {
        method: 'PATCH',
        credentials: 'include',
        headers: getAuthHeaders(),
      })
      const data = await res.json()

      if (data.success && data.order) {
        setOrder(data.order)
      }
    } catch {
      console.error('Failed to confirm delivery')
    } finally {
      setConfirming(false)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <p className="text-warmgray-600">Loading...</p>
      </div>
    )
  }

  if (authenticated === false) {
    router.push('/admin')
    return null
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <p className="text-warmgray-600 mb-4">Order not found</p>
          <Link href="/admin" className="text-warmbrown-600 hover:underline">
            ← Back to orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/admin"
          className="text-sm text-warmgray-600 hover:text-warmgray-800 mb-6 inline-block"
        >
          ← Back to orders
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-serif text-warmgray-800">
              Order {order.orderNumber}
            </h1>
            {order.deliveryConfirmed ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Delivery Confirmed
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                Pending Confirmation
              </span>
            )}
          </div>

          <div>
            <h2 className="text-sm font-medium text-warmgray-500 uppercase mb-2">Customer</h2>
            <p className="font-medium text-warmgray-800">{order.customerName}</p>
            <p className="text-sm text-warmgray-600">{order.customerEmail}</p>
            <p className="text-sm text-warmgray-600">{order.customerPhone}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-warmgray-500 uppercase mb-2">Delivery</h2>
            <p className="text-warmgray-800">{order.deliveryLocation}</p>
            {order.deliveryDate && order.deliveryTime && (
              <p className="mt-2 text-warmgray-700 font-medium">
                Requested: {formatDate(order.deliveryDate)} at {order.deliveryTime}
              </p>
            )}
            {order.deliveryConfirmedAt && (
              <p className="mt-1 text-sm text-green-700">
                Confirmed on {formatDateTime(order.deliveryConfirmedAt)}
              </p>
            )}
          </div>

          {order.notes && (
            <div>
              <h2 className="text-sm font-medium text-warmgray-500 uppercase mb-2">Special Instructions</h2>
              <p className="text-warmgray-700 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}

          <div>
            <h2 className="text-sm font-medium text-warmgray-500 uppercase mb-2">Items</h2>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.totalPrice)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-warmgray-200">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-warmgray-600">Total</span>
              <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-warmgray-600">Deposit (50%)</span>
              <span>{formatCurrency(order.depositAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-warmgray-600">Remaining</span>
              <span>{formatCurrency(order.remainingAmount)}</span>
            </div>
          </div>

          {!order.deliveryConfirmed && (
            <div className="pt-4 border-t border-warmgray-200">
              <button
                onClick={handleConfirmDelivery}
                disabled={confirming}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {confirming ? 'Confirming...' : 'Confirm Delivery Time & Date'}
              </button>
              <p className="mt-2 text-xs text-warmgray-500 text-center">
                Click to confirm the customer&apos;s requested delivery date and time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
