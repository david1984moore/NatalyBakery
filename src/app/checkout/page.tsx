'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SmoothLink from '@/components/SmoothLink'
import { Mail, UtensilsCrossed } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatCurrency } from '@/lib/utils'
import CheckoutForm from '@/components/CheckoutForm'
import LanguageToggle from '@/components/LanguageToggle'
import Cart from '@/components/Cart'
import { CheckoutResponse } from '@/types/checkout'
import { usePageHeroHeader } from '@/hooks/usePageHeroHeader'

export default function CheckoutPage() {
  usePageHeroHeader()
  const router = useRouter()
  const { items, getTotalAmount, getDepositAmount, getRemainingAmount, clearCart } = useCart()
  const { t } = useLanguage()
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: '',
  })
  const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // When false, bypass Stripe and use order-only flow (submit → confirmation modal → place order)
  const stripeEnabled = process.env.NEXT_PUBLIC_ENABLE_STRIPE_PAYMENT === 'true'


  const totalAmount = getTotalAmount()
  const depositAmount = getDepositAmount()
  const remainingAmount = getRemainingAmount()

  // Delivery time options: 6:30pm - 9:30pm in 30-min increments
  const deliveryTimeOptions = ['6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm', '9:00pm', '9:30pm']

  // Minimum delivery date: before 9:00am can select today; at or after 9:00am, soonest is tomorrow.
  const now = new Date()
  const cutOffHour = 9
  const isBeforeCutoff = now.getHours() < cutOffHour
  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  const todayStr = formatLocalDate(now)
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDeliveryDate = isBeforeCutoff ? todayStr : formatLocalDate(tomorrow)
  const isSameDayBlocked = !isBeforeCutoff

  // Mobile browsers (especially iOS) often ignore input[type=date] min attribute.
  // Enforce same-day cutoff in JS: if after 8:59am, today must not be selectable.
  // Dependency array size must stay constant (React requirement). Initial correction only;
  // handleDeliveryDateChange prevents user from keeping "today" when after cutoff.
  useEffect(() => {
    if (!isSameDayBlocked) return
    setCustomerInfo((prev) => {
      const current = prev.deliveryDate.trim()
      if (current === '' || current === todayStr) return { ...prev, deliveryDate: minDeliveryDate }
      return prev
    })
  }, [isSameDayBlocked, minDeliveryDate, todayStr])

  const handleDeliveryDateChange = (value: string) => {
    if (isSameDayBlocked && value === todayStr) {
      setCustomerInfo((prev) => ({ ...prev, deliveryDate: minDeliveryDate }))
      return
    }
    setCustomerInfo((prev) => ({ ...prev, deliveryDate: value }))
  }

  // Validate that all required fields are filled
  const isFormValid = customerInfo.name.trim() !== '' && 
                      customerInfo.email.trim() !== '' && 
                      customerInfo.phone.trim() !== '' &&
                      customerInfo.deliveryAddress.trim() !== '' &&
                      customerInfo.deliveryDate.trim() !== '' &&
                      customerInfo.deliveryTime.trim() !== ''

  // CRITICAL: Guard against empty cart - but don't redirect if we're completing payment
  const [isCompletingPayment, setIsCompletingPayment] = useState(false)
  
  useEffect(() => {
    if (items.length === 0 && !isCompletingPayment) {
      router.push('/menu')
    }
  }, [items.length, router, isCompletingPayment])


  // Don't render anything until we confirm cart has items
  if (items.length === 0) {
    return (
      <div className="page-content-wrapper">
        <div className="min-h-screen flex items-center justify-center bg-cream-50/30">
          <div className="text-center">
            <p className="text-warmgray-600 mb-4">{t('common.loading')}</p>
            <p className="text-sm text-warmgray-500">{t('menu.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  const buildRequestBody = () => ({
    customerName: customerInfo.name,
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
    deliveryAddress: customerInfo.deliveryAddress,
    deliveryDate: customerInfo.deliveryDate,
    deliveryTime: customerInfo.deliveryTime,
    items: items.map((item) => ({
      productName: item.variantName 
        ? `${item.productName} - ${item.variantName}`
        : item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    specialInstructions: customerInfo.specialInstructions || undefined,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!stripeEnabled) {
      setShowConfirmModal(true)
      return
    }

    setIsLoading(true)
    try {
      const requestBody = buildRequestBody()
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      const data: CheckoutResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Checkout failed. Please try again.')
      }
      if (!data.clientSecret) {
        throw new Error('Payment form could not be initialized. Please try again.')
      }
      setCheckoutData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during checkout. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmOrder = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const requestBody = buildRequestBody()
      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Order failed. Please try again.')
      }

      setShowConfirmModal(false)
      setIsCompletingPayment(true)
      router.push(`/checkout/success?orderId=${data.orderId}&orderNumber=${data.orderNumber}&pending=1`)
      clearCart()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    // Set flag to prevent cart-empty redirect
    setIsCompletingPayment(true)
    
    // Save order info before navigation
    const orderId = checkoutData?.orderId
    const orderNumber = checkoutData?.orderNumber
    
    // Navigate to success page FIRST
    router.push(`/checkout/success?orderId=${orderId}&orderNumber=${orderNumber}`)
    
    // Clear cart after navigation (this won't trigger redirect because isCompletingPayment is true)
    clearCart()
  }

  if (stripeEnabled && checkoutData?.clientSecret) {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    
    return (
      <div className="min-h-screen flex flex-col relative" style={{ background: 'linear-gradient(135deg, #FCF8F4 0%, #F6EFE6 100%)' }}>
        <Cart />
        {/* Navigation Bar - mobile: hero bar; desktop: no strip, subtle shadow */}
        <div
          className="fixed inset-x-0 top-0 z-[2147483647] safe-top mobile-header-hero-fill max-md:bg-hero-footer-gradient md:bg-background md:backdrop-blur-sm md:shadow-[0_4px_14px_0_rgba(0,0,0,0.08)] shadow-sm isolate"
          style={{ minHeight: '40px', width: '100%' }}
        >
          <div className="mobile-header-hero-fill max-md:bg-hero-footer-gradient border-b-[3px] border-b-white/85 flex flex-col min-h-[40px] overflow-visible md:bg-transparent">
            <div className="md:hidden flex flex-1 items-center justify-between gap-1 min-h-[40px] -translate-y-1.5 min-w-0 max-w-full pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]">
              <SmoothLink href="/" className="min-w-0 flex-shrink max-w-[45%] flex items-center h-full overflow-visible outline-none focus:outline-none focus-visible:ring-0" aria-label="Home">
                <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow block overflow-visible">Caramel & Jo</span>
              </SmoothLink>
              <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0 pr-3">
                <LanguageToggle variant="menuHeader" />
                <SmoothLink href="/menu" aria-label={t('nav.menu')} className="min-h-[38px] md:min-h-[44px] min-w-[38px] px-1.5 md:px-2.5 py-1.5 text-xs hero-btn-header hero-footer-btn-taper border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium flex items-center justify-center"><UtensilsCrossed className="w-6 h-6 text-white shrink-0" strokeWidth={2.5} stroke="white" fill="white" /></SmoothLink>
                <SmoothLink href="/contact" aria-label={t('nav.contact')} className="shrink-0 min-h-[38px] md:min-h-[44px] min-w-[38px] max-md:w-[38px] max-md:h-[38px] px-1.5 md:px-2.5 py-1.5 text-xs hero-btn-header hero-footer-btn-taper border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium flex items-center justify-center"><Mail className="w-6 h-6 shrink-0 text-white" strokeWidth={2.5} stroke="white" aria-hidden /></SmoothLink>
                <button onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))} className="shrink-0 min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] hero-btn-header hero-footer-btn-taper bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center md:hover:opacity-90 transition-colors duration-200 relative border-[3px] border-white" aria-label="Shopping cart">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">{itemCount}</span>}
                </button>
              </div>
            </div>
            <div className="hidden md:flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8 h-14 md:h-16 -translate-y-0">
              <SmoothLink href="/" className="flex-shrink-0 flex items-center h-full outline-none focus:outline-none focus-visible:ring-0" aria-label="Home">
                <span className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap">Caramel & Jo</span>
              </SmoothLink>
              <div className="flex items-center gap-8 lg:gap-11 flex-shrink-0">
                <SmoothLink href="/menu" aria-label={t('nav.menu')} className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200 flex items-center justify-center"><UtensilsCrossed className="w-5 h-5" strokeWidth={2} /></SmoothLink>
                <SmoothLink href="/contact" aria-label={t('nav.contact')} className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200 flex items-center justify-center"><Mail className="w-5 h-5" strokeWidth={2} /></SmoothLink>
                <LanguageToggle variant="menu" />
                <button onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))} className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-700 hover:bg-warmbrown-500 hover:text-white rounded-full border border-transparent hover:border-warmbrown-500 transition-colors duration-200 relative" aria-label="Shopping cart">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">{itemCount}</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 md:pb-12">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-serif text-warmgray-800 mb-8 text-center">
              {t('checkout.completePayment')}
            </h1>
            <CheckoutForm
              clientSecret={checkoutData.clientSecret}
              orderNumber={checkoutData.orderNumber || ''}
              depositAmount={depositAmount}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content-wrapper">
    <main data-scrollable className="min-h-screen flex flex-col relative" style={{ background: 'linear-gradient(135deg, #FCF8F4 0%, #F6EFE6 100%)' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-[calc(100vw-2rem)]">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-warmgray-800 will-change-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-warmgray-800 font-medium">{t('checkout.processing')}</span>
            </div>
          </div>
        </div>
      )}
      <Cart />
      {/* Navigation Bar - mobile: hero bar; desktop: no strip, subtle shadow */}
      <div
        className="fixed inset-x-0 top-0 z-[2147483647] safe-top mobile-header-hero-fill max-md:bg-hero-footer-gradient md:bg-background md:backdrop-blur-sm md:shadow-[0_4px_14px_0_rgba(0,0,0,0.08)] shadow-sm isolate"
        style={{ minHeight: '40px', width: '100%' }}
      >
        <div className="mobile-header-hero-fill max-md:bg-hero-footer-gradient border-b-[3px] border-b-white/85 flex flex-col min-h-[40px] overflow-visible md:bg-transparent">
          <div className="md:hidden flex items-center justify-between gap-1 min-h-[40px] -translate-y-1.5 min-w-0 max-w-full pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]">
            <SmoothLink href="/" className="min-w-0 flex-shrink max-w-[45%] flex items-center h-full overflow-visible outline-none focus:outline-none focus-visible:ring-0" aria-label="Home">
              <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow block overflow-visible">Caramel & Jo</span>
            </SmoothLink>
            <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0 pr-3">
              <LanguageToggle variant="menuHeader" />
              <SmoothLink href="/menu" aria-label={t('nav.menu')} className="min-h-[38px] md:min-h-[44px] min-w-[38px] px-1.5 md:px-2.5 py-1.5 text-xs hero-btn-header hero-footer-btn-taper border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium flex items-center justify-center"><UtensilsCrossed className="w-6 h-6 text-white shrink-0" strokeWidth={2.5} stroke="white" fill="white" /></SmoothLink>
              <SmoothLink href="/contact" aria-label={t('nav.contact')} className="shrink-0 min-h-[38px] md:min-h-[44px] min-w-[38px] max-md:w-[38px] max-md:h-[38px] px-1.5 md:px-2.5 py-1.5 text-xs hero-btn-header hero-footer-btn-taper border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium flex items-center justify-center"><Mail className="w-6 h-6 shrink-0 text-white" strokeWidth={2.5} stroke="white" aria-hidden /></SmoothLink>
              <button onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))} className="shrink-0 min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] hero-btn-header hero-footer-btn-taper bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center md:hover:opacity-90 transition-colors duration-200 relative border-[3px] border-white" aria-label="Shopping cart">
                <svg className="w-7 h-7 text-white" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {items.reduce((sum, item) => sum + item.quantity, 0) > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>}
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8 h-14 md:h-16 -translate-y-0">
            <SmoothLink href="/" className="flex-shrink-0 flex items-center h-full outline-none focus:outline-none focus-visible:ring-0">
              <span className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap">Caramel & Jo</span>
            </SmoothLink>
            <div className="flex items-center gap-8 lg:gap-11 flex-shrink-0">
              <SmoothLink href="/menu" aria-label={t('nav.menu')} className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200 flex items-center justify-center"><UtensilsCrossed className="w-5 h-5" strokeWidth={2} /></SmoothLink>
              <SmoothLink href="/contact" aria-label={t('nav.contact')} className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200 flex items-center justify-center"><Mail className="w-5 h-5" strokeWidth={2} /></SmoothLink>
              <LanguageToggle variant="menu" />
              <button onClick={() => window.dispatchEvent(new CustomEvent('cart:toggle'))} className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-700 hover:bg-warmbrown-500 hover:text-white rounded-full border border-transparent hover:border-warmbrown-500 transition-colors duration-200 relative" aria-label="Shopping cart">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {items.reduce((sum, item) => sum + item.quantity, 0) > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 pt-20 sm:pt-24 pb-8 md:pb-12 min-w-0 overflow-x-visible md:overflow-x-hidden">
        <div className="w-full max-w-4xl min-w-0">
          {/* Page Title (visible on mobile only) */}
          <div className="mb-6 md:hidden">
            <h1 className="text-xl sm:text-2xl font-serif text-warmgray-800 text-center">
              {t('checkout.title')}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch min-w-0">
            {/* Checkout form - overflow-x-clip on mobile to contain date input (WebKit bug 301648) */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col min-w-0 overflow-x-clip md:overflow-hidden">
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-3 flex-1 flex flex-col min-w-0 overflow-visible md:overflow-hidden">
                <div className="space-y-3 min-w-0 overflow-visible md:overflow-hidden">
                  <div className="min-w-0 w-full">
                    <label htmlFor="name" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.fullName')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    />
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="email" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    />
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="phone" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    />
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="deliveryAddress" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.deliveryAddress')}
                    </label>
                    <input
                      type="text"
                      id="deliveryAddress"
                      required
                      placeholder={t('checkout.placeholder.address')}
                      value={customerInfo.deliveryAddress}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryAddress: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    />
                  </div>

                  <div className="min-w-0 w-full checkout-delivery-date-wrapper">
                    <label htmlFor="deliveryDate" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.deliveryDate')}
                    </label>
                    <div className="checkout-delivery-date-inner">
                      <input
                        type="date"
                        id="deliveryDate"
                        required
                        min={minDeliveryDate}
                        value={customerInfo.deliveryDate}
                        onChange={(e) => handleDeliveryDateChange(e.target.value)}
                        className="checkout-delivery-date-input w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                      />
                    </div>
                    {isSameDayBlocked && (
                      <p className="text-xs text-warmgray-500 mt-1" role="status">
                        {t('checkout.sameDayCutoffNote')}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="deliveryTime" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.deliveryTime')}
                    </label>
                    <p className="text-xs text-warmgray-500 mb-1">{t('checkout.deliveryTimeWindow')}</p>
                    <select
                      id="deliveryTime"
                      required
                      value={customerInfo.deliveryTime}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryTime: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent box-border"
                    >
                      <option value="">{t('checkout.selectTime')}</option>
                      {deliveryTimeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-0 w-full">
                    <label htmlFor="specialInstructions" className="block text-xs font-medium text-warmgray-700 mb-1">
                      {t('checkout.specialInstructions')}
                    </label>
                    <textarea
                      id="specialInstructions"
                      rows={2}
                      placeholder={t('checkout.placeholder.specialInstructions')}
                      value={customerInfo.specialInstructions}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, specialInstructions: e.target.value })}
                      className="w-full min-w-0 max-w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border border-warmgray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none box-border"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-md text-sm font-medium">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-semibold">{t('common.error')}</p>
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col">
              <h2 className="text-lg font-serif text-warmgray-800 mb-4">{t('checkout.orderSummary')}</h2>
              <div className="space-y-2 mb-3 flex-1">
                {items.map((item, index) => (
                  <div key={`${item.productName}-${item.variantName || ''}-${index}`} className="flex justify-between items-start pb-2 border-b border-warmgray-100">
                    <div>
                      <p className="text-xs font-medium text-warmgray-800">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-xs text-warmgray-500">{item.variantName}</p>
                      )}
                      <p className="text-xs text-warmgray-600">{t('cart.qty')} {item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium text-warmgray-800">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-warmgray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-warmgray-700">{t('cart.total')}</span>
                  <span className="font-semibold text-warmgray-800">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-warmgray-600">{t('cart.deposit')}</span>
                  <span className="font-medium text-warmgray-800">{formatCurrency(depositAmount)}</span>
                </div>
                {remainingAmount > 0 && (
                  <div className="flex justify-between text-xs text-warmgray-500">
                    <span>{t('cart.remaining')}</span>
                    <span>{formatCurrency(remainingAmount)}</span>
                  </div>
                )}
                <div className="mt-2 p-2 bg-cream-100 rounded-md">
                  <p className="text-xs text-warmgray-600 text-center">
                    {stripeEnabled ? t('checkout.depositNote') : t('checkout.paymentArrangedNote')}
                  </p>
                </div>
              </div>

              {/* Submit / Continue to Payment Button */}
              <div className="mt-3">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isLoading || !isFormValid}
                  onClick={(e) => {
                    if (!isLoading && isFormValid) {
                      const form = document.getElementById('checkout-form') as HTMLFormElement
                      if (form) form.requestSubmit()
                    }
                  }}
                  className="block w-full min-h-[44px] px-4 py-2.5 border rounded-md font-medium text-base text-center border-transparent bg-gradient-to-r from-[#8a7160] to-[#75604f] text-white transition-colors duration-standard ease-apple disabled:opacity-50 disabled:cursor-not-allowed md:border-0 md:bg-[#1f2937] md:py-3 md:px-4 md:hover:bg-[#374151]"
                  style={{ fontFamily: 'var(--font-ui), sans-serif' }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white will-change-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('checkout.processing')}
                    </span>
                  ) : (
                    stripeEnabled ? t('checkout.continueToPayment') : t('checkout.submitOrder')
                  )}
                </button>
              </div>

              {/* Confirmation Modal (order-only flow) */}
              {showConfirmModal && (
                <div
                  className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
                  onClick={() => { if (!isLoading) { setShowConfirmModal(false); setError(null); } }}
                >
                  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-serif text-warmgray-800">{t('checkout.confirmOrder')}</h3>
                    <p className="text-sm text-warmgray-600">{t('checkout.confirmOrderMessage')}</p>
                    <div className="border border-warmgray-200 rounded-md p-3 bg-cream-50/50">
                      <p className="text-sm text-warmgray-700">
                        {t('checkout.confirmOrderTotal')} <span className="font-semibold">{formatCurrency(totalAmount)}</span>
                      </p>
                      <ul className="mt-2 text-xs text-warmgray-600 space-y-1">
                        {items.map((item, idx) => (
                          <li key={idx}>
                            {item.productName}{item.variantName ? ` - ${item.variantName}` : ''} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowConfirmModal(false); setError(null); }}
                        disabled={isLoading}
                        className="flex-1 min-h-[44px] px-4 py-2.5 border-2 border-warmgray-300 text-warmgray-700 rounded-md font-medium hover:bg-warmgray-50 disabled:opacity-50"
                      >
                        {t('checkout.cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmOrder}
                        disabled={isLoading}
                        className="flex-1 min-h-[44px] px-4 py-2.5 border-2 border-hero-600 bg-headerButtonFill text-white rounded-md font-medium hover:bg-hero-600 disabled:opacity-50 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('checkout.processing')}
                          </>
                        ) : (
                          t('checkout.confirmOrder')
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
  )
}
