'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const getAuthHeaders = (): HeadersInit | undefined => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null
    return token ? { Authorization: `Bearer ${token}` } : undefined
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
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

      if (data.success && data.orders) {
        setOrders(data.orders)
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
      }
    } catch {
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      })
      const data = await res.json()

      if (data.success && data.token) {
        sessionStorage.setItem('admin_token', data.token)
        setAuthenticated(true)
        const ordersRes = await fetch('/api/admin/orders', {
          credentials: 'include',
          headers: { Authorization: `Bearer ${data.token}` },
        })
        const ordersData = await ordersRes.json()
        if (ordersRes.status === 401) {
          setAuthenticated(false)
          sessionStorage.removeItem('admin_token')
          setLoginError('Session could not be established.')
        } else if (ordersData.success && ordersData.orders) {
          setOrders(ordersData.orders)
        }
      } else {
        setLoginError(data.error || 'Invalid password')
      }
    } catch {
      setLoginError('Login failed')
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
          <h1 className="text-xl font-serif text-warmgray-800 mb-4">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-warmgray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-warmbrown-500 text-white rounded-md hover:bg-warmbrown-600 transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif text-warmgray-800">Orders</h1>
          <Link
            href="/"
            className="text-sm text-warmgray-600 hover:text-warmgray-800"
          >
            ← Back to site
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-warmgray-200">
              <thead className="bg-warmgray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warmgray-700 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warmgray-700 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warmgray-700 uppercase">Delivery</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warmgray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warmgray-700 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-warmgray-700 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-warmgray-800">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-warmgray-600">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-warmgray-600">
                      {order.deliveryDate && order.deliveryTime
                        ? `${formatDate(order.deliveryDate)} at ${order.deliveryTime}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {order.deliveryConfirmed ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-warmgray-600">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm text-warmbrown-600 hover:text-warmbrown-700 font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="px-4 py-12 text-center text-warmgray-500">
              No orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
