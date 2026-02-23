'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatCurrency } from '@/lib/utils'
import { productNameToTranslationKey, getVariantTranslationKey } from '@/lib/productTranslations'

const cartTransition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }

export default function Cart() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalAmount, getDepositAmount, getRemainingAmount, openCartOnNextPage, setOpenCartOnNextPage } = useCart()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollPositionRef = useRef(0)
  const pathname = usePathname()
  const isMenuPage = pathname === '/menu'
  const isContactPage = pathname === '/contact'
  const isCheckoutPage = pathname === '/checkout' || pathname?.startsWith('/checkout/')
  const isModalCartPage = isMenuPage || isContactPage || isCheckoutPage

  /** Continue Shopping: close cart and go to menu. Implemented as button (not link) so
   * mobile Safari reliably receives touch — anchors in overlay often don't fire click on iOS. */
  const handleContinueShopping = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    if (pathname !== '/menu') router.push('/menu')
  }

  const totalAmount = getTotalAmount()
  const depositAmount = getDepositAmount()
  const remainingAmount = getRemainingAmount()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  /* Scroll lock when modal cart is open: prevent background scroll (critical for iOS).
   * Uses --scroll-y CSS variable so body gets correct top before class applies (avoids one-frame gap in Safari). */
  const lockScroll = () => {
    scrollPositionRef.current = window.scrollY
    document.documentElement.style.setProperty('--scroll-y', `-${scrollPositionRef.current}px`)
    document.documentElement.classList.add('cart-open')
  }
  const unlockScroll = () => {
    document.documentElement.classList.remove('cart-open')
    document.documentElement.style.removeProperty('--scroll-y')
    window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' })
  }
  useEffect(() => {
    if (!isModalCartPage || !mounted) return
    if (isOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }
    return () => unlockScroll()
  }, [isModalCartPage, isOpen, mounted])

  /* Escape key closes modal cart */
  useEffect(() => {
    if (!isOpen || !isModalCartPage) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isModalCartPage])

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

  // Open cart when navigating from another page with openCartOnNextPage flag (e.g. contact page cart button)
  useEffect(() => {
    if (isMenuPage && openCartOnNextPage) {
      setIsOpen(true)
      setOpenCartOnNextPage(false)
    }
  }, [isMenuPage, openCartOnNextPage, setOpenCartOnNextPage])

  // Don't render floating button on menu page, contact page, or checkout pages (it's in the nav bar)
  if (isModalCartPage && mounted) {
    const modalContent = (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[998] backdrop-blur-md"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={cartTransition}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none"
              aria-hidden="true"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-title"
                className="w-full max-w-md max-h-[calc(100vh-2rem)] bg-white rounded-lg shadow-2xl border-4 border-warmgray-200 overflow-hidden flex flex-col pointer-events-auto safe-top safe-bottom"
              >
          <div className="relative w-full flex flex-col overflow-hidden flex-1 min-h-0">
          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="relative px-6 py-8 flex-shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-warmgray-400 hover:text-warmgray-600 transition-colors rounded-full hover:bg-warmgray-100"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 id="cart-title" className="text-lg font-serif text-warmgray-800 text-center mb-4">{t('cart.shoppingCart')}</h2>
              <p className="text-warmgray-600 text-center">{t('cart.empty')}</p>
            </div>
          ) : (
            <>
          {/* Header with title and close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-warmgray-100 flex-shrink-0">
            <h2 id="cart-title" className="text-lg font-serif text-warmgray-800">{t('cart.shoppingCart')}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-warmgray-400 hover:text-warmgray-600 transition-colors rounded-full hover:bg-warmgray-100"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
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
                  {remainingAmount > 0 && (
                    <div className="flex justify-between text-xs text-warmgray-500">
                      <span>{t('cart.remaining')}</span>
                      <span>{formatCurrency(remainingAmount)}</span>
                    </div>
                  )}
                  </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleContinueShopping}
                    className="block w-full min-h-[44px] bg-white border-2 border-warmgray-800 text-warmgray-800 text-center py-1.5 rounded-md hover:bg-warmgray-50 transition-colors duration-200 font-semibold text-sm cursor-pointer touch-manipulation relative z-10 [-webkit-tap-highlight-color:transparent]"
                    style={{ fontFamily: 'var(--font-ui), sans-serif' }}
                  >
                    {t('cart.continueShopping')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      if (!isCheckoutPage) router.push('/checkout')
                    }}
                    className="block w-full min-h-[44px] px-4 py-2.5 sm:py-2 border rounded-md font-medium text-base sm:text-sm text-center border-transparent bg-gradient-to-r from-[#8a7160] to-[#75604f] text-white transition-colors duration-standard ease-apple md:border-2 md:border-hero-600 md:bg-headerButtonFill md:hover:bg-hero-600 relative z-10"
                    style={{ fontFamily: 'var(--font-ui), sans-serif', touchAction: 'manipulation' }}
                  >
                    {t('cart.checkout')}
                  </button>
                </div>
              </div>
            </div>
            </>
          )}
          </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
    return createPortal(modalContent, document.body)
  }

  // Render floating button for other pages
  if (items.length === 0) {
    return (
      <div className="fixed bottom-5 right-5 z-50 safe-bottom safe-right">
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-cart-toggle
          className="min-w-[48px] min-h-[48px] bg-white/95 backdrop-blur-sm rounded-full p-3 flex items-center justify-center shadow-lg border-4 border-transparent hover:bg-tan hover:border-tan transition-colors duration-200 group"
          aria-label="Shopping cart"
        >
          <svg
            className="w-7 h-7 text-warmgray-700 group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white rounded-lg shadow-xl border-4 border-warmgray-200 relative p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-warmgray-400 hover:text-warmgray-600 transition-colors rounded-full hover:bg-warmgray-100"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-warmgray-600 text-center py-8">{t('cart.empty')}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 safe-bottom safe-right">
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-cart-toggle
        className="min-w-[48px] min-h-[48px] bg-white/95 backdrop-blur-sm rounded-full p-3 flex items-center justify-center shadow-lg border-4 border-transparent hover:bg-tan hover:border-tan transition-colors duration-200 relative group"
        aria-label="Shopping cart"
      >
        <svg
          className="w-7 h-7 text-warmgray-700 group-hover:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {items.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 md:w-96 bg-white rounded-lg shadow-xl border-4 border-warmgray-200 flex flex-col" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          {/* Header with title and close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-warmgray-100 flex-shrink-0">
            <h2 className="text-lg font-serif text-warmgray-800">{t('cart.shoppingCart')}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-warmgray-400 hover:text-warmgray-600 transition-colors rounded-full hover:bg-warmgray-100"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
                  {remainingAmount > 0 && (
                    <div className="flex justify-between text-xs text-warmgray-500">
                      <span>{t('cart.remaining')}</span>
                      <span>{formatCurrency(remainingAmount)}</span>
                    </div>
                  )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleContinueShopping}
                  className="block w-full min-h-[44px] bg-white border-2 border-warmgray-800 text-warmgray-800 text-center py-1.5 rounded-md hover:bg-warmgray-50 transition-colors duration-200 font-semibold text-sm cursor-pointer touch-manipulation [-webkit-tap-highlight-color:transparent]"
                  style={{ fontFamily: 'var(--font-ui), sans-serif' }}
                >
                  {t('cart.continueShopping')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    if (!isCheckoutPage) router.push('/checkout')
                  }}
                  className="block w-full min-h-[44px] px-4 py-2.5 sm:py-2 border rounded-md font-medium text-base sm:text-sm text-center border-transparent bg-gradient-to-r from-[#8a7160] to-[#75604f] text-white transition-colors duration-standard ease-apple md:border-2 md:border-hero-600 md:bg-headerButtonFill md:hover:bg-hero-600"
                  style={{ fontFamily: 'var(--font-ui), sans-serif', touchAction: 'manipulation' }}
                >
                  {t('cart.checkout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
