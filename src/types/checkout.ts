/**
 * Type definitions for checkout and order system
 */

export interface CheckoutItem {
  productName: string
  quantity: number
  unitPrice: number
  totalPrice?: number // Calculated on server
}

export interface CheckoutRequest {
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: CheckoutItem[]
  notes?: string
}

export interface CheckoutResponse {
  success: boolean
  orderId?: string
  orderNumber?: string
  clientSecret?: string // Stripe payment intent client secret
  depositAmount?: number
  remainingAmount?: number
  totalAmount?: number
  error?: string
  details?: any
}

export interface OrderSummary {
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  depositAmount: number
  remainingAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELLED'
  items: OrderItemSummary[]
  createdAt: Date
}

export interface OrderItemSummary {
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}
