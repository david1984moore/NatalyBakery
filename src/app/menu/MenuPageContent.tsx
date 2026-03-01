'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, Suspense } from 'react'
import {
  products,
  getProductByName,
  getDefaultVariant,
  PRODUCTS_WITH_REAL_PHOTOS,
  type Product,
  type ProductVariant,
} from '@/data/products'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatCurrency } from '@/lib/utils'
import {
  productNameToTranslationKey,
  getVariantTranslationKey,
} from '@/lib/productTranslations'
import Cart from '@/components/Cart'
import CartPreviewModal from '@/components/CartPreviewModal'
import ProductImageGallery from '@/components/ProductImageGallery'
import ProductImage from '@/components/ProductImage'
import { usePageHeroHeader } from '@/hooks/usePageHeroHeader'

interface MenuPageContentProps {
  products: Product[]
}

export default function MenuPageContent({
  products,
}: MenuPageContentProps) {
  usePageHeroHeader()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem, items } = useCart()
  const { t } = useLanguage()
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const isManualUpdate = useRef(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)
  const [addToCartSuccess, setAddToCartSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewItem, setPreviewItem] = useState<{
    name: string
    price: number
    image: string
  } | null>(null)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 1)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
      // Hide right fade when near the end so the last button isn't faded
      setShowRightFade(scrollLeft + clientWidth < scrollWidth - 120)
    }
  }

  const scrollLeft = () => {
    if (!canScrollLeft) return
    const container = scrollContainerRef.current
    if (container) container.scrollBy({ left: -200, behavior: 'smooth' })
  }

  const scrollRight = () => {
    if (!canScrollRight) return
    const container = scrollContainerRef.current
    if (container) container.scrollBy({ left: 200, behavior: 'smooth' })
  }

  useEffect(() => {
    const timer = setTimeout(() => checkScrollPosition(), 100)
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)')
    const updateScrollRef = () => {
      const mobileContainer = document.querySelector(
        '.mobile-scroll-container'
      ) as HTMLDivElement
      const desktopContainer = document.querySelector(
        '.desktop-scroll-container'
      ) as HTMLDivElement
      const isMobile = touchQuery.matches
      const activeContainer = isMobile ? mobileContainer : desktopContainer
      if (activeContainer) {
        ;(scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current =
          activeContainer
        checkScrollPosition()
      }
    }
    updateScrollRef()
    touchQuery.addEventListener('change', updateScrollRef)
    window.addEventListener('resize', updateScrollRef)

    /* iOS: orientation change can break -webkit-overflow-scrolling touch; force reflow so horizontal scroll works again */
    const handleOrientationChange = () => {
      const mobileContainer = document.querySelector('.mobile-scroll-container') as HTMLDivElement
      if (mobileContainer) {
        const prev = mobileContainer.style.display
        mobileContainer.style.display = 'none'
        mobileContainer.offsetHeight
        requestAnimationFrame(() => {
          mobileContainer.style.display = prev || ''
        })
      }
      updateScrollRef()
    }
    window.addEventListener('orientationchange', handleOrientationChange)

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      return () => {
        clearTimeout(timer)
        container.removeEventListener('scroll', checkScrollPosition)
        touchQuery.removeEventListener('change', updateScrollRef)
        window.removeEventListener('resize', updateScrollRef)
        window.removeEventListener('orientationchange', handleOrientationChange)
      }
    }
    return () => {
      clearTimeout(timer)
      touchQuery.removeEventListener('change', updateScrollRef)
      window.removeEventListener('resize', updateScrollRef)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [products, t])

  useEffect(() => {
    if (isManualUpdate.current) {
      isManualUpdate.current = false
      return
    }
    const productName = searchParams.get('product')
    const product = productName ? getProductByName(productName) : null
    const targetProduct = product || (products.length > 0 ? products[0] : null)
    if (targetProduct && (!featuredProduct || featuredProduct.name !== targetProduct.name)) {
      setFeaturedProduct(targetProduct)
      setQuantity(targetProduct.minQuantity ? targetProduct.minQuantity : 1)
      // When coming from URL, preselect variant; on first load with no URL param, leave no variant selected
      const hasMultipleVariants = targetProduct.hasVariants && targetProduct.variants.length > 1
      if (product || !hasMultipleVariants) {
        setSelectedVariant(getDefaultVariant(targetProduct))
      } else {
        setSelectedVariant(null)
      }
    } else if (!featuredProduct && products.length > 0) {
      setFeaturedProduct(products[0])
      setQuantity(products[0].minQuantity ? products[0].minQuantity : 1)
      const hasMultipleVariants = products[0].hasVariants && products[0].variants.length > 1
      if (!hasMultipleVariants) {
        setSelectedVariant(getDefaultVariant(products[0]))
      } else {
        setSelectedVariant(null)
      }
    }
  }, [searchParams])

  const addToCartSuccessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleAddToCart = () => {
    if (featuredProduct && selectedVariant) {
      if (
        featuredProduct.minQuantity &&
        quantity < featuredProduct.minQuantity
      ) {
        alert(t('menu.minimumOrder', { min: featuredProduct.minQuantity }))
        setQuantity(featuredProduct.minQuantity)
        return
      }
      if (addToCartSuccessTimeoutRef.current) clearTimeout(addToCartSuccessTimeoutRef.current)
      addItem(featuredProduct.name, selectedVariant.price, quantity, selectedVariant.name)
      setAddToCartSuccess(true)
      setPreviewItem({
        name: featuredProduct.name,
        price: selectedVariant.price,
        image: featuredProduct.images?.[0] ?? featuredProduct.image,
      })
      setShowPreview(true)
      addToCartSuccessTimeoutRef.current = setTimeout(() => {
        setAddToCartSuccess(false)
        addToCartSuccessTimeoutRef.current = null
      }, 2000)
    }
  }

  const handleQuantityChange = (delta: number) => {
    if (featuredProduct?.minQuantity) {
      setQuantity((prev) =>
        Math.max(featuredProduct.minQuantity!, prev + delta)
      )
    } else {
      setQuantity((prev) => Math.max(1, prev + delta))
    }
  }

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant)
  }

  const isLoading = !featuredProduct

  const handleProductChange = (productName: string) => {
    const product = getProductByName(productName)
    if (product) {
      isManualUpdate.current = true
      setFeaturedProduct(product)
      setSelectedVariant(getDefaultVariant(product))
      setQuantity(product.minQuantity ? product.minQuantity : 1)
    }
    router.replace(
      `${window.location.pathname}?product=${encodeURIComponent(productName)}`
    )
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Spacer so content is not under fixed PageHeader */}
      <div className="h-[calc(52px+env(safe-area-inset-top,0px))] md:h-0 md:min-h-0 shrink-0 bg-background" aria-hidden />

      {/* Mobile: sticky category row so product tabs stay visible when scrolling */}
      <div className="md:hidden sticky top-[calc(52px+env(safe-area-inset-top,0px))] z-10 flex-shrink-0 bg-background">
        <div
          className="flex items-center gap-2.5 overflow-x-auto overflow-y-hidden scrollbar-hide px-3 py-1.5 touch-scroll mobile-scroll-container touch-pan-x"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product) => {
            const isSelected = featuredProduct?.name === product.name
            const translationKey =
              productNameToTranslationKey[product.name] || product.name
            const translatedName =
              translationKey.startsWith('product.')
                ? t(translationKey as any)
                : product.name
            return (
              <button
                key={product.name}
                onClick={() => handleProductChange(product.name)}
                className={`flex-shrink-0 min-h-[36px] px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200 whitespace-nowrap border border-transparent ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#8a7160] to-[#75604f] text-white'
                    : 'bg-transparent text-warmgray-900'
                }`}
              >
                {translatedName}
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop: in-flow category row (scrollable with content) */}
      <div className="hidden md:flex flex-shrink-0 items-center gap-4 md:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 py-2 bg-background">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 md:gap-3 overflow-x-auto scrollbar-hide flex-1 min-w-0 overflow-y-hidden touch-scroll desktop-scroll-container"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product) => {
            const isSelected = featuredProduct?.name === product.name
            const translationKey =
              productNameToTranslationKey[product.name] || product.name
            const translatedName =
              translationKey.startsWith('product.')
                ? t(translationKey as any)
                : product.name
            return (
              <button
                key={product.name}
                onClick={() => handleProductChange(product.name)}
                className={`flex-shrink-0 min-h-[44px] px-3 py-1.5 md:px-2.5 md:text-xs rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap border border-transparent ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#8a7160] to-[#75604f] text-white md:hover:opacity-90'
                    : 'bg-transparent text-warmgray-700 hover:bg-[#8a7160] hover:text-white'
                }`}
              >
                {translatedName}
              </button>
            )
          })}
        </div>
      </div>

      <section className="menu-content-top flex items-start relative z-0 safe-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-start md:items-center pt-4 md:pt-6 pb-24 md:pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full max-w-4xl">
                <div className="relative aspect-[3/4] w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto rounded-lg overflow-hidden bg-warmgray-200 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-warmgray-200 via-warmgray-100 to-warmgray-200"></div>
                </div>
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
              <div className="relative w-full h-[calc(100svh-132px-180px)] min-h-[200px] max-w-full md:aspect-[3/4] md:h-auto md:min-h-[280px] md:max-w-md mx-auto rounded-none md:rounded-2xl overflow-hidden border-0 md:border border-white/60 shadow-lg md:mt-0">
                {PRODUCTS_WITH_REAL_PHOTOS.includes(featuredProduct.name) ? (
                  featuredProduct.images && featuredProduct.images.length > 0 ? (
                    <ProductImageGallery
                      images={featuredProduct.images}
                      alt={featuredProduct.name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 240px, 400px"
                      mobileHero
                    />
                  ) : (
                    <ProductImage
                      key={featuredProduct.name}
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 240px, 400px"
                      mobileHero
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-warmgray-100 text-warmgray-600 font-medium text-center px-6 py-8 text-base sm:text-lg md:text-xl">
                    Pics coming soon!
                  </div>
                )}
              </div>

              <div className="space-y-2 md:space-y-4 flex flex-col">
                <div>
                  <h1 className="text-xl md:text-3xl font-serif text-warmgray-800 mb-0.5 md:mb-1.5">
                    {(() => {
                      const translationKey =
                        productNameToTranslationKey[featuredProduct.name] ||
                        featuredProduct.name
                      return translationKey.startsWith('product.')
                        ? t(translationKey as any)
                        : featuredProduct.name
                    })()}
                  </h1>
                  {featuredProduct.description && (
                    <p className="text-warmgray-600 text-sm md:text-base leading-snug md:leading-relaxed">
                      {featuredProduct.description}
                    </p>
                  )}
                </div>

                {featuredProduct.hasVariants &&
                  featuredProduct.variants.length > 1 && (
                    <div>
                      <label className="block text-warmgray-700 font-medium mb-1 text-sm">
                        {t('menu.selectOption')}
                      </label>
                      <div className="space-y-1">
                        {featuredProduct.variants.map((variant) => (
                          <label
                            key={variant.id}
                            className={`flex items-center gap-2 md:gap-3 min-h-[44px] p-2 sm:p-2 md:p-3 border md:border md:border-transparent rounded-md cursor-pointer transition-colors ${
                              selectedVariant?.id === variant.id
                                ? 'border-warmgray-800 bg-background md:bg-cream-100 md:border-warmgray-300'
                                : 'border-warmgray-300 md:hover:bg-cream-100 md:hover:border-warmgray-400 md:hover:shadow-sm'
                            }`}
                          >
                            <input
                              type="radio"
                              name="variant"
                              value={variant.id}
                              checked={selectedVariant?.id === variant.id}
                              onChange={() => handleVariantChange(variant)}
                              className="w-3.5 h-3.5 md:w-5 md:h-5 text-warmgray-800 focus:ring-warmgray-800 cursor-pointer"
                            />
                            <div className="flex-1">
                              <span className="text-warmgray-800 font-medium text-sm md:text-base">
                                {(() => {
                                  const translationKey =
                                    getVariantTranslationKey(variant.name)
                                  return translationKey.startsWith('variant.') ||
                                    translationKey.startsWith('product.')
                                    ? t(translationKey as any)
                                    : variant.name
                                })()}
                              </span>
                            </div>
                            <span className="text-warmgray-700 font-semibold text-sm md:text-base">
                              {formatCurrency(variant.price)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {!featuredProduct.hasVariants && selectedVariant && (
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

                <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
                  <label
                    htmlFor="quantity"
                    className="text-warmgray-700 font-medium text-sm"
                  >
                    {t('menu.quantity')}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-warmbrown-500 text-warmgray-800 border border-warmbrown-500 rounded-md md:hover:bg-warmbrown-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                      disabled={
                        featuredProduct.minQuantity
                          ? quantity <= featuredProduct.minQuantity
                          : quantity <= 1
                      }
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min={featuredProduct.minQuantity || 1}
                      value={quantity}
                      onChange={(e) => {
                        const val =
                          parseInt(e.target.value) ||
                          (featuredProduct.minQuantity || 1)
                        setQuantity(
                          Math.max(
                            featuredProduct.minQuantity || 1,
                            val
                          )
                        )
                      }}
                      className="w-16 text-center border border-warmgray-300 rounded-md py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-warmbrown-500 text-warmgray-800 border border-warmbrown-500 rounded-md md:hover:bg-warmbrown-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                  {featuredProduct.minQuantity && (
                    <span className="text-xs text-warmgray-500">
                      {t('menu.minimum', {
                        min: featuredProduct.minQuantity,
                      })}
                    </span>
                  )}
                </div>

                <div className="pt-1.5 border-t border-warmgray-200">
                  {selectedVariant && (
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-warmgray-700 font-medium text-sm">
                        {t('cart.total')}
                      </span>
                      <span className="text-lg font-serif text-warmgray-800">
                        {formatCurrency(selectedVariant.price * quantity)}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || addToCartSuccess}
                    className={`w-full min-h-[44px] px-4 py-2.5 sm:py-2 border rounded-md font-medium text-base sm:text-sm disabled:cursor-not-allowed transition-colors duration-standard ease-apple ${
                      addToCartSuccess
                        ? 'border-sage-500 bg-sage-500 text-white'
                        : 'border-transparent bg-gradient-to-r from-[#8a7160] to-[#75604f] text-white md:hover:opacity-90 disabled:opacity-50'
                    }`}
                    style={{ fontFamily: 'var(--font-ui), sans-serif' }}
                  >
                    {addToCartSuccess ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t('menu.addedToCart')}
                      </span>
                    ) : (
                      t('menu.addToCart')
                    )}
                  </button>
                  <p
                    className="text-xs text-warmgray-500 mt-2 leading-relaxed"
                    role="note"
                  >
                    * {t('menu.deliveryNote')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Cart />
      <CartPreviewModal
        show={showPreview}
        item={previewItem}
        onClose={() => setShowPreview(false)}
      />
    </div>
  )
}
