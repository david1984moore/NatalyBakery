'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatCurrency } from '@/lib/utils'
import { productNameToTranslationKey, getVariantTranslationKey } from '@/lib/productTranslations'
import Link from 'next/link'

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalAmount, getDepositAmount, getRemainingAmount } = useCart()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMenuPage = pathname === '/menu'
  const isContactPage = pathname === '/contact'
  const isCheckoutPage = pathname === '/checkout' || pathname?.startsWith('/checkout/')

  const totalAmount = getTotalAmount()
  const depositAmount = getDepositAmount()
  const remainingAmount = getRemainingAmount()

  // Diagnostic logging
  if (typeof window !== 'undefined' && isMenuPage && isOpen) {
    console.log('=== CART RENDER ===', {
      itemsLength: items.length,
      hasItems: items.length > 0,
      isOpen,
      items: items,
      timestamp: Date.now()
    })
  }

  // Listen for cart toggle from menu page, contact page, or checkout pages navigation bar
  useEffect(() => {
    if (isMenuPage || isContactPage || isCheckoutPage) {
      const handleCartToggle = () => {
        setIsOpen((prev) => !prev)
      }
      
      // Listen for custom event from menu page, contact page, or checkout pages
      window.addEventListener('cart:toggle', handleCartToggle)
      
      return () => {
        window.removeEventListener('cart:toggle', handleCartToggle)
      }
    }
  }, [isMenuPage, isContactPage, isCheckoutPage])

  // Don't render floating button on menu page, contact page, or checkout pages (it's in the nav bar)
  if (isMenuPage || isContactPage || isCheckoutPage) {
    // Render only the dropdown positioned from top-right
    if (!isOpen) return null
    
    return (
      <div className="fixed top-16 right-2 sm:right-4 z-[99] safe-right">
        <div className="w-[calc(100vw-1rem)] max-w-sm sm:w-80 md:w-96 bg-white rounded-lg shadow-xl border border-warmgray-200 flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 5rem)' }}>
          {/* Cart Header */}
          <div className="px-6 py-4 border-b border-warmgray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif text-warmgray-800">{t('cart.shoppingCart')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-warmgray-400 hover:text-warmgray-600 transition-colors"
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
            <div className="px-6 py-8 flex-shrink-0">
              <p className="text-warmgray-600 text-center">{t('cart.empty')}</p>
            </div>
          ) : (
            <div className="flex flex-col" style={{ flex: '1 1 auto', minHeight: 0 }}>
              <div className="overflow-y-auto px-6 py-4" style={{ flex: '1 1 0%', minHeight: 0, maxHeight: 'calc(100vh - 5rem - 220px)' }}>
                <div className="space-y-4">
                  {items.map((item, index) => (
                <div key={`${item.productName}-${item.variantName || ''}-${index}`} className="flex items-start gap-4 pb-4 border-b border-warmgray-100 last:border-0">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-warmgray-800 mb-1">
                      {(() => {
                        const translationKey = productNameToTranslationKey[item.productName] || item.productName
                        return translationKey.startsWith('product.') ? t(translationKey as any) : item.productName
                      })()}
                    </h3>
                    {item.variantName && (
                      <p className="text-xs text-warmgray-500 mb-1">
                        {(() => {
                          const translationKey = getVariantTranslationKey(item.variantName)
                          return translationKey.startsWith('variant.') || translationKey.startsWith('product.') 
                            ? t(translationKey as any) 
                            : item.variantName
                        })()}
                      </p>
                    )}
                    <p className="text-xs text-warmgray-600 mb-2">
                      {formatCurrency(item.unitPrice)} {t('cart.each')}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productName, item.quantity - 1, item.variantName)}
                        className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center border border-warmgray-300 rounded hover:bg-warmgray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-sm text-warmgray-700 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productName, item.quantity + 1, item.variantName)}
                        className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center border border-warmgray-300 rounded hover:bg-warmgray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="min-h-[44px] flex items-center gap-1 px-2 py-2 text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
                      aria-label="Remove item"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {t('cart.remove')}
                    </button>
                  </div>
                </div>
                  ))}
                </div>
              </div>
                {/* Cart Summary - Always visible when items exist */}
                <div className="px-6 py-4 border-t border-warmgray-200 bg-cream-50/50 flex-shrink-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-warmgray-600">{t('cart.total')}</span>
                    <span className="font-medium text-warmgray-800">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-warmgray-600">{t('cart.deposit')}</span>
                    <span className="font-medium text-warmgray-800">{formatCurrency(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-warmgray-500">
                    <span>{t('cart.remaining')}</span>
                    <span>{formatCurrency(remainingAmount)}</span>
                  </div>
                  </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/menu"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-white border-2 border-warmgray-800 text-warmgray-800 text-center py-2.5 rounded-md hover:bg-warmgray-50 transition-colors duration-200 font-semibold text-sm"
                  >
                    {t('cart.continueShopping')}
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-warmgray-800 text-white text-center py-3 rounded-md hover:bg-warmgray-700 transition-colors duration-200 font-semibold text-sm shadow-md hover:shadow-lg relative z-10"
                    style={{ 
                      display: 'block !important',
                      width: '100%',
                      minHeight: '44px',
                      height: 'auto',
                      padding: '12px',
                      backgroundColor: '#1f2937',
                      color: '#ffffff',
                      textDecoration: 'none',
                      visibility: 'visible',
                      opacity: '1'
                    }}
                  >
                    {t('cart.checkout')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render floating button for other pages
  if (items.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50 safe-bottom safe-right">
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-cart-toggle
          className="min-w-[44px] min-h-[44px] bg-white/95 backdrop-blur-sm rounded-full p-3 flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200"
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
          <div className="absolute bottom-full right-0 mb-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white rounded-lg shadow-xl p-6">
            <p className="text-warmgray-600 text-center py-8">{t('cart.empty')}</p>
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
        className="min-w-[44px] min-h-[44px] bg-white/95 backdrop-blur-sm rounded-full p-3 flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200 relative"
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
        <div className="absolute bottom-full right-0 mb-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 md:w-96 bg-white rounded-lg shadow-xl flex flex-col" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          {/* Cart Header */}
          <div className="px-6 py-4 border-b border-warmgray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif text-warmgray-800">{t('cart.shoppingCart')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-warmgray-400 hover:text-warmgray-600 transition-colors"
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
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.productName}-${item.variantName || ''}-${index}`} className="flex items-start gap-4 pb-4 border-b border-warmgray-100 last:border-0">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-warmgray-800 mb-1">
                        {(() => {
                          const translationKey = productNameToTranslationKey[item.productName] || item.productName
                          return translationKey.startsWith('product.') ? t(translationKey as any) : item.productName
                        })()}
                      </h3>
                      {item.variantName && (
                        <p className="text-xs text-warmgray-500 mb-1">
                          {(() => {
                            // If variant name matches a product translation key, translate it
                            const variantTranslationKey = productNameToTranslationKey[item.variantName] || item.variantName
                            return variantTranslationKey.startsWith('product.') ? t(variantTranslationKey as any) : item.variantName
                          })()}
                        </p>
                      )}
                      <p className="text-xs text-warmgray-600 mb-2">
                        {formatCurrency(item.unitPrice)} {t('cart.each')}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productName, item.quantity - 1, item.variantName)}
                          className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center border border-warmgray-300 rounded hover:bg-warmgray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-sm text-warmgray-700 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productName, item.quantity + 1, item.variantName)}
                          className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center border border-warmgray-300 rounded hover:bg-warmgray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
                        aria-label="Remove item"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Cart Summary - Always visible */}
            <div className="px-6 py-4 border-t border-warmgray-200 bg-cream-50/50 flex-shrink-0">
              <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-warmgray-600">{t('cart.total')}</span>
                    <span className="font-medium text-warmgray-800">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-warmgray-600">{t('cart.deposit')}</span>
                    <span className="font-medium text-warmgray-800">{formatCurrency(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-warmgray-500">
                    <span>{t('cart.remaining')}</span>
                    <span>{formatCurrency(remainingAmount)}</span>
                  </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/menu"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-white border-2 border-warmgray-800 text-warmgray-800 text-center py-2.5 rounded-md hover:bg-warmgray-50 transition-colors duration-200 font-semibold text-sm"
                >
                  {t('cart.continueShopping')}
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-warmgray-800 text-white text-center py-3 rounded-md hover:bg-warmgray-700 transition-colors duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
                  style={{ 
                    display: 'block',
                    width: '100%',
                    minHeight: '44px',
                    lineHeight: '44px'
                  }}
                >
                  {t('cart.checkout')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
