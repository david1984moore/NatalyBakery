'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { products, getProductByName, getDefaultVariant, getProductPriceRange, type Product, type ProductVariant } from '@/data/products'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatCurrency } from '@/lib/utils'
import { productNameToTranslationKey, getVariantTranslationKey } from '@/lib/productTranslations'
import Cart from '@/components/Cart'
import LanguageToggle from '@/components/LanguageToggle'
import ProductImageGallery from '@/components/ProductImageGallery'
import ProductImage from '@/components/ProductImage'

function MenuPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem, items } = useCart()
  const { t } = useLanguage()
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const isManualUpdate = useRef(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Check scroll position
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 1) // Use 1px tolerance
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1) // Use 1px tolerance
    }
  }

  // Scroll functions
  const scrollLeft = () => {
    if (!canScrollLeft) return
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (!canScrollRight) return
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  // Check scroll on mount and when products/language changes
  useEffect(() => {
    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      checkScrollPosition()
    }, 100)
    
    const updateScrollRef = () => {
      // On mobile, use mobile container; on desktop, use desktop container
      const mobileContainer = document.querySelector('.mobile-scroll-container') as HTMLDivElement
      const desktopContainer = document.querySelector('.desktop-scroll-container') as HTMLDivElement
      const isMobile = window.innerWidth < 768
      const activeContainer = isMobile ? mobileContainer : desktopContainer
      
      if (activeContainer) {
        // Type assertion to allow assignment to ref
        ;(scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = activeContainer
        checkScrollPosition()
      }
    }
    
    updateScrollRef()
    window.addEventListener('resize', updateScrollRef)
    
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      return () => {
        clearTimeout(timer)
        container.removeEventListener('scroll', checkScrollPosition)
        window.removeEventListener('resize', updateScrollRef)
      }
    }
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateScrollRef)
    }
  }, [products, t])

  useEffect(() => {
    // Skip if this is a manual update (handled in handleProductChange)
    if (isManualUpdate.current) {
      isManualUpdate.current = false
      return
    }

    const productName = searchParams.get('product')
    const product = productName ? getProductByName(productName) : null
    const targetProduct = product || (products.length > 0 ? products[0] : null)
    
    if (targetProduct && (!featuredProduct || featuredProduct.name !== targetProduct.name)) {
      setFeaturedProduct(targetProduct)
      setSelectedVariant(getDefaultVariant(targetProduct))
      if (targetProduct.minQuantity) {
        setQuantity(targetProduct.minQuantity)
      } else {
        setQuantity(1)
      }
    } else if (!featuredProduct && products.length > 0) {
      // Initial load - default to first product
      setFeaturedProduct(products[0])
      setSelectedVariant(getDefaultVariant(products[0]))
      if (products[0].minQuantity) {
        setQuantity(products[0].minQuantity)
      } else {
        setQuantity(1)
      }
    }
  }, [searchParams])

  const handleAddToCart = () => {
    if (featuredProduct && selectedVariant) {
      // For Conchas, validate minimum quantity
      if (featuredProduct.minQuantity && quantity < featuredProduct.minQuantity) {
        alert(t('menu.minimumOrder', { min: featuredProduct.minQuantity }))
        setQuantity(featuredProduct.minQuantity)
        return
      }
      addItem(featuredProduct.name, selectedVariant.price, quantity, selectedVariant.name)
    }
  }

  const handleQuantityChange = (delta: number) => {
    if (featuredProduct?.minQuantity) {
      setQuantity((prev) => Math.max(featuredProduct.minQuantity!, prev + delta))
    } else {
      setQuantity((prev) => Math.max(1, prev + delta))
    }
  }

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant)
  }

  // Keep navigation bar visible even during loading
  const isLoading = !featuredProduct || !selectedVariant

  const handleProductChange = (productName: string) => {
    // Immediately update state to prevent loading state flash
    const product = getProductByName(productName)
    if (product) {
      isManualUpdate.current = true // Mark as manual update
      setFeaturedProduct(product)
      setSelectedVariant(getDefaultVariant(product))
      if (product.minQuantity) {
        setQuantity(product.minQuantity)
      } else {
        setQuantity(1)
      }
    }
    
    // Update URL using router.replace (Next.js App Router way)
    const currentPath = window.location.pathname
    router.replace(`${currentPath}?product=${encodeURIComponent(productName)}`)
  }

  return (
    <div className="h-screen bg-cream-50 flex flex-col overflow-hidden relative">
      {/* Product Navigation Bar - Fixed at top - Mobile optimized */}
      <div 
        className="fixed top-0 left-0 right-0 z-[100] bg-warmbrown-500 shadow-sm safe-top w-full max-w-[100vw] overflow-x-hidden"
        style={{ minHeight: '52px' }}
      >
        {/* Header row - tan background (mobile & desktop) */}
        <div className="bg-warmbrown-500 border-b border-warmbrown-600">
        {/* Mobile Layout (< 768px) */}
        <div className="md:hidden flex items-center justify-between px-2.5 h-full min-h-[40px]">
          {/* Home Button - Mobile */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center"
            aria-label="Home"
          >
            <span className="text-white font-nav-playfair text-lg font-extrabold brand-header-shadow">Caramel & Jo</span>
          </Link>
          
          {/* Right side buttons - Mobile */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Link
              href="/contact"
              className="min-h-[34px] px-2 py-0.5 rounded-md text-xs font-medium border border-white/50 bg-transparent text-white md:hover:bg-white/20 md:hover:border-white/30 transition-colors duration-200 whitespace-nowrap flex items-center"
            >
              {t('nav.contact')}
            </Link>
            <LanguageToggle variant="menuHeader" />
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('cart:toggle'))
              }}
              className="min-w-[34px] min-h-[34px] bg-white/20 backdrop-blur-sm rounded-full p-1 flex items-center justify-center shadow-md md:hover:bg-white/30 transition-colors duration-200 relative border border-white/50 group"
              aria-label="Shopping cart"
            >
              <svg
                className="w-3.5 h-3.5 text-white"
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
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Layout (>= 768px) */}
        <div className="hidden md:flex items-center h-full" style={{ minHeight: '52px' }}>
          {/* Home Button - Desktop */}
          <Link
            href="/"
            className="flex-shrink-0 px-4 lg:px-6 flex items-center h-full"
            aria-label="Home"
          >
            <span className="text-white font-nav-playfair text-2xl lg:text-3xl xl:text-4xl font-extrabold brand-header-shadow">Caramel & Jo</span>
          </Link>
          
          {/* Centered container for scrollable product list - Desktop */}
          <div className="flex-1 flex items-center gap-3 relative h-full min-w-0 pl-4 pr-2">
            {/* Left scroll indicator */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-warmbrown-500 via-warmbrown-500/80 to-transparent pointer-events-none z-10" />
            )}
            
            {/* Right scroll indicator */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-transparent via-warmbrown-500/80 to-warmbrown-500 pointer-events-none z-10" />
            )}
            
            <div 
              ref={scrollContainerRef}
              className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1 min-w-0 overflow-y-hidden touch-scroll desktop-scroll-container pr-6" 
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {products.map((product) => {
                const isSelected = featuredProduct?.name === product.name
                const translationKey = productNameToTranslationKey[product.name] || product.name
                const translatedName = translationKey.startsWith('product.') ? t(translationKey as any) : product.name
                
                return (
                  <button
                    key={product.name}
                    onClick={() => handleProductChange(product.name)}
                    className={`flex-shrink-0 min-h-[44px] px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap border ${
                      isSelected
                        ? 'bg-white text-warmgray-800 border-white shadow-md font-semibold'
                        : 'bg-transparent text-white border-white/50 hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    {translatedName}
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Language Toggle and Cart Button - Desktop */}
          <div className="flex items-center gap-3 flex-shrink-0 pl-4 pr-4 lg:pr-6">
            <Link
              href="/contact"
              className="flex-shrink-0 min-h-[40px] px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap border border-white/50 bg-transparent text-white hover:bg-white/20 hover:border-white/30 transition-colors duration-200 flex items-center"
            >
              {t('nav.contact')}
            </Link>
            <LanguageToggle variant="menuHeader" />
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('cart:toggle'))
              }}
              className="min-w-[40px] min-h-[40px] bg-white/20 backdrop-blur-sm rounded-full p-2 flex items-center justify-center shadow-md hover:bg-white/30 transition-colors duration-200 relative border border-white/50 group"
              aria-label="Shopping cart"
            >
              <svg
                className="w-4 h-4 text-white"
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
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        </div>

        {/* Product Category Buttons - Mobile (below brand/buttons row) */}
        <div className="md:hidden bg-cream-50 border-b border-warmgray-200">
          <div 
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pl-2.5 pr-4 py-1.5 touch-scroll mobile-scroll-container" 
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {products.map((product) => {
              const isSelected = featuredProduct?.name === product.name
              const translationKey = productNameToTranslationKey[product.name] || product.name
              const translatedName = translationKey.startsWith('product.') ? t(translationKey as any) : product.name
              
              return (
                <button
                  key={product.name}
                  onClick={() => handleProductChange(product.name)}
                  className={`flex-shrink-0 min-h-[36px] px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200 whitespace-nowrap border ${
                    isSelected
                      ? 'bg-warmbrown-500 text-white border-warmbrown-500 shadow-md font-semibold'
                      : 'bg-transparent text-warmgray-700 border-warmgray-300 md:hover:bg-warmbrown-500 md:hover:text-white md:hover:border-warmbrown-500'
                  }`}
                >
                  {translatedName}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Featured Product Section - items-start ensures image top is never hidden behind header */}
      <section className="flex-1 overflow-hidden menu-content-top flex items-start overflow-y-auto safe-bottom relative z-0 [scrollbar-gutter:stable]">
        <div className="max-w-7xl mx-auto pl-3 pr-5 sm:pl-6 sm:pr-8 lg:pl-8 lg:pr-10 w-full flex items-start md:items-center pt-2 pb-24 md:pt-6 md:pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full max-w-4xl">
                {/* Skeleton Image */}
                <div className="relative aspect-[3/4] w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto rounded-lg overflow-hidden bg-warmgray-200 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-warmgray-200 via-warmgray-100 to-warmgray-200"></div>
                </div>
                
                {/* Skeleton Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-8 bg-warmgray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-warmgray-100 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-warmgray-100 rounded animate-pulse w-5/6"></div>
                  </div>
                  <div className="h-24 bg-warmgray-100 rounded animate-pulse"></div>
                  <div className="h-12 bg-warmgray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 items-center w-full">
            {/* Product Image - mobile: spans header bottom to above product name; desktop: compact */}
            <div className="relative w-full h-[calc(100svh-132px-180px)] min-h-[200px] max-w-[100vw] md:h-auto md:min-h-0 md:max-w-md mx-auto rounded-none md:rounded-2xl overflow-hidden border-0 md:border border-white/60 shadow-lg md:mt-0">
              {featuredProduct.images && featuredProduct.images.length > 0 ? (
                <ProductImageGallery
                  images={featuredProduct.images}
                  alt={featuredProduct.name}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 240px, 400px"
                  mobileHero
                />
              ) : (
                <ProductImage
                  key={featuredProduct.name}
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 240px, 400px"
                  mobileHero
                />
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-2 md:space-y-4 flex flex-col">
              <div>
                <h1 className="text-xl md:text-3xl font-serif text-warmgray-800 mb-0.5 md:mb-1.5">
                  {(() => {
                    const translationKey = productNameToTranslationKey[featuredProduct.name] || featuredProduct.name
                    return translationKey.startsWith('product.') ? t(translationKey as any) : featuredProduct.name
                  })()}
                </h1>
                {featuredProduct.description && (
                  <p className="text-warmgray-600 text-sm md:text-base leading-snug md:leading-relaxed">
                    {featuredProduct.description}
                  </p>
                )}
              </div>

              {/* Variant Selection */}
              {featuredProduct.hasVariants && featuredProduct.variants.length > 1 && (
                <div>
                  <label className="block text-warmgray-700 font-medium mb-1 text-sm">
                    {t('menu.selectOption')}
                  </label>
                  <div className="space-y-1">
                    {featuredProduct.variants.map((variant) => (
                      <label
                        key={variant.id}
                        className={`flex items-center gap-2 min-h-[44px] p-2 sm:p-2 border rounded-md cursor-pointer transition-colors ${
                          selectedVariant.id === variant.id
                            ? 'border-warmgray-800 bg-cream-50'
                            : 'border-warmgray-300 md:hover:border-warmgray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="variant"
                          value={variant.id}
                          checked={selectedVariant.id === variant.id}
                          onChange={() => handleVariantChange(variant)}
                          className="w-3.5 h-3.5 text-warmgray-800 focus:ring-warmgray-800"
                        />
                        <div className="flex-1">
                          <span className="text-warmgray-800 font-medium text-sm">
                            {(() => {
                              const translationKey = getVariantTranslationKey(variant.name)
                              return translationKey.startsWith('variant.') || translationKey.startsWith('product.') 
                                ? t(translationKey as any) 
                                : variant.name
                            })()}
                          </span>
                        </div>
                        <span className="text-warmgray-700 font-semibold text-sm">
                          {formatCurrency(variant.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Display */}
              {!featuredProduct.hasVariants && (
                <div className="flex items-baseline gap-3">
                  <span className="text-xl md:text-2xl font-serif text-warmgray-800">
                    {formatCurrency(selectedVariant.price)}
                  </span>
                </div>
              )}

              {featuredProduct.hasVariants && selectedVariant && (
                <div className="flex items-baseline gap-3">
                  <span className="text-xl md:text-2xl font-serif text-warmgray-800">
                    {formatCurrency(selectedVariant.price)}
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
                <label htmlFor="quantity" className="text-warmgray-700 font-medium text-sm">
                  {t('menu.quantity')}
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-warmbrown-500 text-warmgray-800 border border-warmbrown-500 rounded-md md:hover:bg-warmbrown-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                    disabled={featuredProduct.minQuantity ? quantity <= featuredProduct.minQuantity : quantity <= 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min={featuredProduct.minQuantity || 1}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || (featuredProduct.minQuantity || 1)
                      setQuantity(Math.max(featuredProduct.minQuantity || 1, val))
                    }}
                    className="w-16 text-center border border-warmgray-300 rounded-md py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-warmbrown-500 text-warmgray-800 border border-warmbrown-500 rounded-md md:hover:bg-warmbrown-600 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                {featuredProduct.minQuantity && (
                  <span className="text-xs text-warmgray-500">
                    {t('menu.minimum', { min: featuredProduct.minQuantity })}
                  </span>
                )}
              </div>

              {/* Total Price Display */}
              <div className="pt-1.5 border-t border-warmgray-200">
                {selectedVariant && (
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-warmgray-700 font-medium text-sm">{t('cart.total')}</span>
                    <span className="text-lg font-serif text-warmgray-800">
                      {formatCurrency(selectedVariant.price * quantity)}
                    </span>
                  </div>
                )}
                
                {/* Add to Cart Button - Always visible */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant}
                  className="w-full min-h-[44px] px-4 py-2.5 sm:py-2 bg-warmbrown-500 text-white rounded-md md:hover:bg-warmbrown-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-base sm:text-sm"
                  style={{ fontFamily: 'var(--font-ui), sans-serif' }}
                >
                  {t('menu.addToCart')}
                </button>
                <p className="text-xs text-warmgray-500 mt-2 leading-relaxed" role="note">
                  * {t('menu.deliveryNote')}
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      <Cart />
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-50/30 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-warmgray-200 border-t-warmgray-800 mx-auto"></div>
            </div>
            <p className="text-warmgray-600 animate-pulse">Loading...</p>
          </div>
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  )
}
