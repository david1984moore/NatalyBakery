import SmoothLink from '@/components/SmoothLink'
import { OptimizedImage } from '@/components/OptimizedImage'
import { products, getProductPriceRange, PRODUCTS_WITH_REAL_PHOTOS } from '@/data/products'

const SHOWCASE_PRODUCTS = products.filter((p) =>
  PRODUCTS_WITH_REAL_PHOTOS.includes(p.name)
)

export default function MobileProductShowcase() {
  return (
    <section className="block md:hidden bg-cream-100 px-4 pt-8 pb-10">
      {/* Section header */}
      <div className="text-center mb-6">
        <h2 className="font-playfair text-2xl font-bold text-warmgray-800 mb-2">
          Our Menu
        </h2>
        <div className="w-16 border-b border-warmgray-300 mx-auto" />
      </div>

      {/* 2-column product grid */}
      <div className="grid grid-cols-2 gap-3">
        {SHOWCASE_PRODUCTS.map((product) => (
          <SmoothLink
            key={product.name}
            href={`/menu?product=${encodeURIComponent(product.name)}`}
            prefetch={true}
            className="bg-cream-50 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Product image */}
            <div className="relative aspect-[4/3] w-full">
              <OptimizedImage
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 50vw"
                objectFit="cover"
              />
            </div>

            {/* Product info */}
            <div className="px-3 py-2.5">
              <p className="font-playfair text-sm font-semibold text-warmgray-800 leading-snug">
                {product.name}
              </p>
              <p className="font-sans text-xs text-warmgray-500 mt-0.5">
                {getProductPriceRange(product)}
              </p>
            </div>
          </SmoothLink>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-7 text-center">
        <SmoothLink
          href="/menu"
          prefetch={true}
          className="inline-block py-3 px-4 font-sans text-sm text-warmgray-600 underline underline-offset-2"
        >
          See Full Menu →
        </SmoothLink>
      </div>
    </section>
  )
}
