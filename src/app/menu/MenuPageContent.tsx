'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
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
import LanguageToggle from '@/components/LanguageToggle'
import ProductImageGallery from '@/components/ProductImageGallery'
import ProductImage from '@/components/ProductImage'

interface MenuPageContentProps {
  products: Product[]
}

export default function MenuPageContent({
  products,
}: MenuPageContentProps) {
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
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 1)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
      // Hide right fade when near the end so the last button (e.g. Conchas) isn't faded
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
    const updateScrollRef = () => {
      const mobileContainer = document.querySelector(
        '.mobile-scroll-container'
      ) as HTMLDivElement
      const desktopContainer = document.querySelector(
        '.desktop-scroll-container'
      ) as HTMLDivElement
      const isMobile = window.innerWidth < 768
      const activeContainer = isMobile ? mobileContainer : desktopContainer
      if (activeContainer) {
        ;(scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current =
          activeContainer
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
      addItem(featuredProduct.name, selectedVariant.price, quantity, selectedVariant.name)
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
    <div className="min-h-screen bg-background relative w-full max-w-full min-w-0 overflow-x-hidden">
      <div
        className="sticky top-0 left-0 right-0 z-[100] safe-top w-full max-w-full overflow-x-hidden md:overflow-visible md:bg-white/95 md:backdrop-blur-sm md:border-b md:border-warmgray-200 md:shadow-sm bg-hero shadow-none min-h-[40px] md:min-h-[80px]"
      >
        <div className="relative z-10 flex flex-col min-h-[40px] md:min-h-[80px] bg-hero border-b-[3px] border-b-white/85 md:bg-transparent md:border-b md:border-warmgray-200">
          <div className="md:hidden flex flex-1 items-center justify-between gap-2 px-3 min-h-[40px] -translate-y-1.5 min-w-0">
            <Link
              href="/"
              prefetch={true}
              className="flex-shrink-0 flex items-center h-full"
              aria-label="Home"
            >
              <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow">
                Caramel & Jo
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link
                href="/contact"
                prefetch={true}
                className="min-h-[38px] md:min-h-[44px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white/85 bg-stone-800/45 backdrop-blur-sm text-white rounded-xl hover:bg-stone-700/55 hover:border-white transition-colors duration-200 font-medium flex items-center"
              >
                {t('nav.contact')}
              </Link>
              <LanguageToggle variant="menuHeader" />
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('cart:toggle'))
                }
                className="min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] bg-stone-800/45 backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center shadow-md md:hover:bg-stone-700/55 md:hover:border-white transition-colors duration-200 relative border-[3px] border-white/85"
                aria-label="Shopping cart"
              >
                <svg
                  className="w-7 h-7 text-white"
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
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop: brand | equal space | menu buttons (centered) | equal space | contact/cart */}
          <div
            className="hidden md:flex flex-1 items-center px-4 sm:px-6 lg:px-8 h-14 md:h-20 -translate-y-0"
            style={{ minHeight: '40px' }}
          >
            <Link
              href="/"
              prefetch={true}
              className="flex-shrink-0 flex items-center h-full"
              aria-label="Home"
            >
              <span className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap">
                Caramel & Jo
              </span>
            </Link>
            <div className="flex-1 min-w-0" aria-hidden="true" />
            <div className="flex-shrink-0 flex items-center relative h-full max-w-[min(calc(100vw-20rem),56rem)] min-w-0 md:max-w-[min(calc(100vw-18rem),64rem)] md:pr-6 md:overflow-visible">
              {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
              )}
              {canScrollRight && showRightFade && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-transparent via-white/80 to-white pointer-events-none z-10" />
              )}
              <div
                ref={scrollContainerRef}
                className="flex items-center gap-3 md:gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0 overflow-y-hidden touch-scroll desktop-scroll-container pr-6 md:pr-24"
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
                      className={`flex-shrink-0 min-h-[44px] px-3 py-1.5 md:px-2.5 md:text-xs rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap border ${
                        isSelected
                          ? 'border-2 border-warmgray-800 bg-headerButtonFill text-white hover:bg-hero-600'
                          : 'border-warmgray-300 bg-transparent text-warmgray-700 hover:bg-headerButtonFill hover:border-headerButtonFill hover:text-white'
                      }`}
                    >
                      {translatedName}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex-1 min-w-0" aria-hidden="true" />
            <div className="flex-shrink-0 flex items-center gap-6 lg:gap-8">
              <Link
                href="/contact"
                prefetch={true}
                className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200"
              >
                {t('nav.contact')}
              </Link>
              <LanguageToggle variant="menu" />
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('cart:toggle'))
                }
                className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-700 hover:bg-warmbrown-500 hover:text-white rounded-full border border-transparent hover:border-warmbrown-500 transition-colors duration-200 relative"
                aria-label="Shopping cart"
              >
                <svg
                  className="w-5 h-5"
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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-0 md:hidden bg-background">
          <div
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide px-3 py-1.5 touch-scroll mobile-scroll-container"
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
                  className={`flex-shrink-0 min-h-[36px] px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200 whitespace-nowrap border ${
                    isSelected
                      ? 'border-2 border-hero-600 bg-headerButtonFill text-white hover:bg-hero-600'
                      : 'border-warmgray-400 bg-transparent text-warmgray-900 hover:border-warmgray-500'
                  }`}
                >
                  {translatedName}
                </button>
              )
            })}
          </div>
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
                    disabled={!selectedVariant}
                    className="w-full min-h-[44px] px-4 py-2.5 sm:py-2 border-2 border-hero-600 bg-headerButtonFill text-white rounded-md md:hover:bg-hero-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-base sm:text-sm"
                    style={{ fontFamily: 'var(--font-ui), sans-serif' }}
                  >
                    {t('menu.addToCart')}
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
    </div>
  )
}
