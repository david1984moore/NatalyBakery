'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  products,
  getProductByName,
  getDefaultVariant,
  getProductPriceRange,
  PRODUCTS_WITH_REAL_PHOTOS,
  type Product,
  type ProductVariant,
} from '@/data/products'

/** Splits variants into two independent dimensions when ALL names follow "X - Y" format. */
function parseVariantDimensions(variants: ProductVariant[]) {
  const parts = variants.map((v) => v.name.split(' - '))
  if (!parts.every((p) => p.length === 2)) return null
  const sizes = [...new Set(parts.map((p) => p[0]))]
  const options = [...new Set(parts.map((p) => p[1]))]
  const find = (size: string, option: string) =>
    variants.find((v) => v.name === `${size} - ${option}`) ?? null
  return { sizes, options, find }
}

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
import { OptimizedImage } from '@/components/OptimizedImage'
import { usePageHeroHeader } from '@/hooks/usePageHeroHeader'
import SmoothLink from '@/components/SmoothLink'
import { ChevronLeft } from 'lucide-react'

interface MenuPageContentProps {
  products: Product[]
}

// ─── Product card grid ────────────────────────────────────────────────────────

function ProductGrid({
  products,
  onSelect,
}: {
  products: Product[]
  onSelect: (name: string) => void
}) {
  const { t } = useLanguage()

  return (
    <div className="flex-1 min-h-0 overflow-y-auto safe-bottom">
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {products.map((product) => {
            const translationKey =
              productNameToTranslationKey[product.name] || product.name
            const translatedName = translationKey.startsWith('product.')
              ? t(translationKey as any)
              : product.name
            const hasPhoto = PRODUCTS_WITH_REAL_PHOTOS.includes(product.name)

            return (
              <button
                key={product.name}
                onClick={() => onSelect(product.name)}
                className="group text-left bg-cream-50 rounded-2xl overflow-hidden flex flex-col shadow-sm active:scale-[0.98] transition-transform duration-150"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full bg-warmgray-100">
                  {hasPhoto ? (
                    <OptimizedImage
                      src={product.image}
                      alt={translatedName}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-warmgray-400 text-xs text-center px-2">
                      Coming soon
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="px-3 py-2.5">
                  <p className="font-playfair text-sm font-semibold text-warmgray-800 leading-snug">
                    {translatedName}
                  </p>
                  <p className="font-sans text-xs text-warmgray-500 mt-0.5">
                    {getProductPriceRange(product)}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Product detail view ──────────────────────────────────────────────────────

function ProductDetail({
  product,
  onBack,
}: {
  product: Product
  onBack: () => void
}) {
  const { addItem, items } = useCart()
  const { t } = useLanguage()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    () => {
      const hasMultiple = product.hasVariants && product.variants.length > 1
      return hasMultiple ? null : getDefaultVariant(product)
    }
  )
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(product.minQuantity ?? 1)
  const [addToCartSuccess, setAddToCartSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewItem, setPreviewItem] = useState<{
    name: string
    price: number
    image: string
  } | null>(null)
  const addToCartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const translationKey =
    productNameToTranslationKey[product.name] || product.name
  const translatedName = translationKey.startsWith('product.')
    ? t(translationKey as any)
    : product.name

  const dims =
    product.hasVariants && product.variants.length > 1
      ? parseVariantDimensions(product.variants)
      : null

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) =>
      Math.max(product.minQuantity ?? 1, prev + delta)
    )
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return
    if (product.minQuantity && quantity < product.minQuantity) {
      alert(t('menu.minimumOrder', { min: product.minQuantity }))
      setQuantity(product.minQuantity)
      return
    }
    if (addToCartTimeoutRef.current) clearTimeout(addToCartTimeoutRef.current)
    addItem(product.name, selectedVariant.price, quantity, selectedVariant.name)
    setAddToCartSuccess(true)
    setPreviewItem({
      name: product.name,
      price: selectedVariant.price,
      image: product.images?.[0] ?? product.image,
    })
    setShowPreview(true)
    addToCartTimeoutRef.current = setTimeout(() => {
      setAddToCartSuccess(false)
      addToCartTimeoutRef.current = null
    }, 2000)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Back button row */}
      <div className="shrink-0 px-3 pt-2 pb-1 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-warmgray-600 text-sm font-medium min-h-[44px] px-1 -ml-1"
          aria-label="Back to menu"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" strokeWidth={2} />
          <span>{t('nav.menu') ?? 'Menu'}</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto safe-bottom">
        <div className="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 items-start w-full">

            {/* Image */}
            <div className="relative w-full h-[55vw] min-h-[240px] max-h-[420px] md:h-auto md:aspect-[3/4] md:max-h-none md:max-w-md mx-auto md:rounded-2xl overflow-hidden border-0 md:border border-white/60 shadow-lg flex-shrink-0">
              {PRODUCTS_WITH_REAL_PHOTOS.includes(product.name) ? (
                product.images && product.images.length > 0 ? (
                  <ProductImageGallery
                    images={product.images}
                    alt={product.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 240px, 400px"
                    mobileHero
                  />
                ) : (
                  <ProductImage
                    key={product.name}
                    src={product.image}
                    alt={product.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 240px, 400px"
                    mobileHero
                  />
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-warmgray-100 text-warmgray-600 font-medium text-center px-4 py-6 text-sm md:text-base">
                  Pics coming soon!
                </div>
              )}
            </div>

            {/* Options + cart */}
            <div className="space-y-3 flex flex-col min-h-0 min-w-0 px-4 md:px-0 pb-6 pt-3 md:pt-0">

              {/* Variant selectors */}
              {product.hasVariants && product.variants.length > 1 && (() => {
                /* ── MOBILE: pill selectors ── */
                const MobilePills = dims ? (
                  <div className="md:hidden space-y-3">
                    <div>
                      <p className="text-xs text-warmgray-500 mb-1.5 font-medium uppercase tracking-wide">
                        Size
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dims.sizes.map((size) => {
                          const isActive = selectedSize === size
                          const tk = getVariantTranslationKey(size)
                          const label =
                            tk.startsWith('variant.') || tk.startsWith('product.')
                              ? t(tk as any)
                              : size
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => {
                                setSelectedSize(size)
                                const found = dims.find(size, selectedOption ?? '')
                                if (found) handleVariantChange(found)
                              }}
                              className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors duration-150 ${
                                isActive
                                  ? 'bg-gradient-to-r from-[#8a7160] to-[#75604f] border-transparent text-white'
                                  : 'bg-background border-warmgray-300 text-warmgray-700'
                              }`}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-warmgray-500 mb-1.5 font-medium uppercase tracking-wide">
                        Garnish
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dims.options.map((opt) => {
                          const isActive = selectedOption === opt
                          const tk = getVariantTranslationKey(opt)
                          const label =
                            tk.startsWith('variant.') || tk.startsWith('product.')
                              ? t(tk as any)
                              : opt
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setSelectedOption(opt)
                                const found = dims.find(selectedSize ?? '', opt)
                                if (found) handleVariantChange(found)
                              }}
                              className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors duration-150 ${
                                isActive
                                  ? 'bg-gradient-to-r from-[#8a7160] to-[#75604f] border-transparent text-white'
                                  : 'bg-background border-warmgray-300 text-warmgray-700'
                              }`}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="md:hidden">
                    <p className="text-xs text-warmgray-500 mb-1.5 font-medium uppercase tracking-wide">
                      {t('menu.selectOption')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => {
                        const isActive = selectedVariant?.id === variant.id
                        const tk = getVariantTranslationKey(variant.name)
                        const label =
                          tk.startsWith('variant.') || tk.startsWith('product.')
                            ? t(tk as any)
                            : variant.name
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => handleVariantChange(variant)}
                            className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors duration-150 ${
                              isActive
                                ? 'bg-gradient-to-r from-[#8a7160] to-[#75604f] border-transparent text-white'
                                : 'bg-background border-warmgray-300 text-warmgray-700'
                            }`}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )

                /* ── DESKTOP: radio list ── */
                const DesktopRadios = (
                  <div className="hidden md:block">
                    <label className="block text-warmgray-700 font-medium mb-1 text-sm">
                      {t('menu.selectOption')}
                    </label>
                    <div className="space-y-1">
                      {product.variants.map((variant) => (
                        <label
                          key={variant.id}
                          className={`flex items-center gap-3 min-h-[36px] p-2 border border-transparent rounded-md cursor-pointer transition-colors ${
                            selectedVariant?.id === variant.id
                              ? 'bg-cream-100 border-warmgray-300'
                              : 'hover:bg-cream-100 hover:border-warmgray-400 hover:shadow-sm'
                          }`}
                        >
                          <input
                            type="radio"
                            name="variant"
                            value={variant.id}
                            checked={selectedVariant?.id === variant.id}
                            onChange={() => handleVariantChange(variant)}
                            className="w-5 h-5 text-warmgray-800 focus:ring-warmgray-800 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="text-warmgray-800 font-medium text-base">
                              {(() => {
                                const tk = getVariantTranslationKey(variant.name)
                                return tk.startsWith('variant.') || tk.startsWith('product.')
                                  ? t(tk as any)
                                  : variant.name
                              })()}
                            </span>
                          </div>
                          <span className="text-warmgray-700 font-semibold text-base">
                            {formatCurrency(variant.price)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )

                return <>{MobilePills}{DesktopRadios}</>
              })()}

              {/* Price display for single-variant products */}
              {!product.hasVariants && selectedVariant && (
                <div className="flex items-baseline gap-3">
                  <span className="text-xl md:text-2xl font-serif text-warmgray-800">
                    {formatCurrency(selectedVariant.price)}
                  </span>
                </div>
              )}

              {product.hasVariants && selectedVariant && (
                <div className="flex items-baseline gap-3">
                  <span className="text-xl md:text-2xl font-serif text-warmgray-800">
                    {formatCurrency(selectedVariant.price)}
                  </span>
                </div>
              )}

              {/* Quantity */}
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
                    className="min-w-[36px] min-h-[36px] w-9 h-9 flex items-center justify-center bg-warmbrown-500 text-warmgray-800 border border-warmbrown-500 rounded-md md:hover:bg-warmbrown-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                    disabled={quantity <= (product.minQuantity ?? 1)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min={product.minQuantity ?? 1}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || (product.minQuantity ?? 1)
                      setQuantity(Math.max(product.minQuantity ?? 1, val))
                    }}
                    className="w-16 text-center border border-warmgray-300 rounded-md py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="min-w-[36px] min-h-[36px] w-9 h-9 flex items-center justify-center bg-warmbrown-500 text-warmgray-800 border border-warmbrown-500 rounded-md md:hover:bg-warmbrown-600 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                {product.minQuantity && (
                  <span className="text-xs text-warmgray-500">
                    {t('menu.minimum', { min: product.minQuantity })}
                  </span>
                )}
              </div>

              {/* Total + Add to cart */}
              <div className="pt-1 border-t border-warmgray-200 flex-shrink-0">
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
                  className={`w-full min-h-[40px] px-4 py-2 border rounded-md font-medium text-sm disabled:cursor-not-allowed transition-colors duration-standard ease-apple ${
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
                <p className="text-[10px] md:text-xs text-warmgray-500 mt-1 leading-tight" role="note">
                  * {t('menu.deliveryNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartPreviewModal
        show={showPreview}
        item={previewItem}
        onClose={() => setShowPreview(false)}
      />
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function MenuPageContent({ products }: MenuPageContentProps) {
  usePageHeroHeader()
  useEffect(() => {
    document.body.classList.add('menu-page')
    return () => {
      document.body.classList.remove('menu-page')
    }
  }, [])

  const searchParams = useSearchParams()
  const router = useRouter()

  const productName = searchParams.get('product')
  const activeProduct = productName ? getProductByName(productName) ?? null : null

  const handleSelect = (name: string) => {
    router.push(`${window.location.pathname}?product=${encodeURIComponent(name)}`)
  }

  const handleBack = () => {
    router.push(window.location.pathname)
  }

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden bg-background relative w-full max-w-full min-w-0">
      {/* Spacer so content is not under fixed PageHeader */}
      <div
        className="h-[calc(52px+env(safe-area-inset-top,0px))] md:h-[calc(5rem+env(safe-area-inset-top,0px))] shrink-0 bg-background"
        aria-hidden
      />

      {activeProduct ? (
        <ProductDetail product={activeProduct} onBack={handleBack} />
      ) : (
        <ProductGrid products={products} onSelect={handleSelect} />
      )}

      <Cart />
    </div>
  )
}
