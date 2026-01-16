import ProductCard from './ProductCard'
import { products } from '@/data/products'

export default function ProductGrid() {
  return (
    <section className="py-16 md:py-24 bg-cream-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-warmgray-800 font-light tracking-wide mb-4">
            Our Products
          </h2>
          <div className="w-24 h-px bg-pink-200 mx-auto"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.name}
              name={product.name}
              image={product.image}
              href={`/menu?product=${encodeURIComponent(product.name)}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
