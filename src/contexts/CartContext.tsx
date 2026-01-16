'use client'

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import { CheckoutItem } from '@/types/checkout'

interface CartItem extends CheckoutItem {
  productName: string
  variantName?: string // e.g., "Small (6") - Plain" or "6 rolls/pan"
  unitPrice: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (productName: string, unitPrice: number, quantity?: number, variantName?: string) => void
  removeItem: (productName: string, variantName?: string) => void
  updateQuantity: (productName: string, quantity: number, variantName?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalAmount: () => number
  getDepositAmount: () => number
  getRemainingAmount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((productName: string, unitPrice: number, quantity: number = 1, variantName?: string) => {
    setItems((prevItems) => {
      // For products with variants, we need to match both productName and variantName
      // For products without variants, variantName will be undefined and we match by productName only
      const existingItem = prevItems.find(
        (item) => item.productName === productName && item.variantName === variantName
      )
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.productName === productName && item.variantName === variantName
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...prevItems, { productName, variantName, unitPrice, quantity }]
    })
  }, [])

  const removeItem = useCallback((productName: string, variantName?: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.productName === productName && item.variantName === variantName)
      )
    )
  }, [])

  const updateQuantity = useCallback((productName: string, quantity: number, variantName?: string) => {
    if (quantity <= 0) {
      removeItem(productName, variantName)
      return
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productName === productName && item.variantName === variantName
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const getTotalAmount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  }, [items])

  const getDepositAmount = useCallback(() => {
    const total = getTotalAmount()
    return Math.round((total * 0.5) * 100) / 100
  }, [getTotalAmount])

  const getRemainingAmount = useCallback(() => {
    const total = getTotalAmount()
    const deposit = getDepositAmount()
    return Math.round((total - deposit) * 100) / 100
  }, [getTotalAmount, getDepositAmount])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalAmount,
      getDepositAmount,
      getRemainingAmount,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, getTotalItems, getTotalAmount, getDepositAmount, getRemainingAmount]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
