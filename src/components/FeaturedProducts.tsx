import Link from 'next/link'
import ProductCard from './ProductCard'
import { products } from '@/data/products'

const FEATURED_PRODUCT_COUNT = 6

export default function FeaturedProducts() {
  return (
    <section
      className="relative py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #fffefb 30%, #fffcf5 70%, #ffffff 100%)',
        boxShadow: 'inset 0 8px 24px -8px rgba(0,0,0,0.04), inset 0 -8px 24px -8px rgba(0,0,0,0.04), 0 4px 16px -4px rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 lg:gap-4 justify-items-center items-stretch">
          {products.slice(0, FEATURED_PRODUCT_COUNT).map((product) => (
            <ProductCard
              key={product.name}
              name={product.name}
              image={product.image}
              href={`/menu?product=${encodeURIComponent(product.name)}`}
              variant="light"
            />
          ))}
        </div>
        <Link href="/menu" className="mt-8 flex justify-center">
          <span className="font-ui inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-sm font-medium tracking-wide uppercase text-black bg-white/10 backdrop-blur-sm hover:bg-tan transition-colors duration-300 rounded-md shadow-md">
            Menu
          </span>
        </Link>
      </div>
    </section>
  )
}
