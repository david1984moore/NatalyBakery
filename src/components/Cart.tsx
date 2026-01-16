'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalAmount, getDepositAmount, getRemainingAmount } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMenuPage = pathname === '/menu'

  const totalAmount = getTotalAmount()
  const depositAmount = getDepositAmount()
  const remainingAmount = getRemainingAmount()

  // Listen for cart toggle from menu page navigation bar
  useEffect(() => {
    if (isMenuPage) {
      const handleCartToggle = () => {
        setIsOpen((prev) => !prev)
      }
      
      // Listen for custom event from menu page
      window.addEventListener('cart:toggle', handleCartToggle)
      
      return () => {
        window.removeEventListener('cart:toggle', handleCartToggle)
      }
    }
  }, [isMenuPage])

  // Don't render floating button on menu page (it's in the nav bar)
  if (isMenuPage) {
    // Render only the dropdown positioned from top-right
    if (!isOpen) return null
    
    return (
      <div className="fixed top-16 right-4 z-[99]">
        <div className="w-80 md:w-96 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-hidden flex flex-col border border-warmgray-200">
          {/* Cart Header */}
          <div className="px-6 py-4 border-b border-warmgray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif text-warmgray-800">Shopping Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-warmgray-400 hover:text-warmgray-600 transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="px-6 py-8">
              <p className="text-warmgray-600 text-center">Your cart is empty</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {items.map((item, index) => (
                <div key={`${item.productName}-${item.variantName || ''}-${index}`} className="flex items-start gap-4 pb-4 border-b border-warmgray-100 last:border-0">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-warmgray-800 mb-1">
                      {item.productName}
                    </h3>
                    {item.variantName && (
                      <p className="text-xs text-warmgray-500 mb-1">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-xs text-warmgray-600 mb-2">
                      {formatCurrency(item.unitPrice)} each
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productName, item.quantity - 1, item.variantName)}
                        className="w-6 h-6 flex items-center justify-center border border-warmgray-300 rounded hover:bg-warmgray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-sm text-warmgray-700 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productName, item.quantity + 1, item.variantName)}
                        className="w-6 h-6 flex items-center justify-center border border-warmgray-300 rounded hover:bg-warmgray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-warmgray-800 mb-2">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productName, item.variantName)}
                      className="text-xs text-warmgray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-warmgray-200 bg-cream-50/50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-warmgray-600">Total:</span>
                  <span className="font-medium text-warmgray-800">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warmgray-600">Deposit (50%):</span>
                  <span className="font-medium text-warmgray-800">{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-warmgray-500">
                  <span>Remaining (due at pickup):</span>
                  <span>{formatCurrency(remainingAmount)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-warmgray-800 text-white text-center py-2.5 rounded-md hover:bg-warmgray-700 transition-colors duration-200 font-medium text-sm"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render floating button for other pages
  if (items.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-cart-toggle
          className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors duration-200"
          aria-label="Shopping cart"
        >
          <svg
            className="w-6 h-6 text-warmgray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl p-6">
            <p className="text-warmgray-600 text-center py-8">Your cart is empty</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-cart-toggle
        className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors duration-200 relative"
        aria-label="Shopping cart"
      >
        <svg
          className="w-6 h-6 text-warmgray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {items.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 md:w-96 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
          {/* Cart Header */}
          <div className="px-6 py-4 border-b border-warmgray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif text-warmgray-800">Shopping Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-warmgray-400 hover:text-warmgray-600 transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={`${item.productName}-${item.variantName || ''}-${index}`} className="flex items-start gap-4 pb-4 border-b border-warmgray-100 last:border-0">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-warmgray-800 mb-1">
                      {item.productName}
                    </h3>
                    {item.variantName && (
                      <p className="text-xs text-warmgray-500 mb-1">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-xs text-warmgray-600 mb-2">
                      {formatCurrency(item.unitPrice)} each
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productName, item.quantity - 1, item.variantName)}
                        className="w-6 h-6 flex items-center justify-center border border-warmgray-300 rounded hover:bg-warmgray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-sm text-warmgray-700 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productName, item.quantity + 1, item.variantName)}
                        className="w-6 h-6 flex items-center justify-center border border-warmgray-300 rounded hover:bg-warmgray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-warmgray-800 mb-2">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productName, item.variantName)}
                      className="text-xs text-warmgray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="px-6 py-4 border-t border-warmgray-200 bg-cream-50/50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-warmgray-600">Total:</span>
                <span className="font-medium text-warmgray-800">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warmgray-600">Deposit (50%):</span>
                <span className="font-medium text-warmgray-800">{formatCurrency(depositAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-warmgray-500">
                <span>Remaining (due at pickup):</span>
                <span>{formatCurrency(remainingAmount)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-warmgray-800 text-white text-center py-2.5 rounded-md hover:bg-warmgray-700 transition-colors duration-200 font-medium text-sm"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
