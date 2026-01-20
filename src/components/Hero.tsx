import Image from 'next/image'
import ProductCard from './ProductCard'
import { products } from '@/data/products'

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Images/IMG_7616.jpeg"
          alt="Caramel flan dessert with fresh berries"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Light overlay - minimal for visibility */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Hero Content - All visible in viewport */}
      <div className="relative z-10 max-w-7xl mx-auto pl-0 pr-4 sm:pr-6 lg:pr-8 w-full h-full flex flex-col justify-between py-6 md:py-8 lg:py-10">
        {/* Top Section - Brand Name */}
        <div className="flex-shrink-0 font-brand-tangerine -translate-x-8 md:-translate-x-12 lg:-translate-x-16" id="brand-name-wrapper">
          <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-bold text-white leading-tight mb-2 md:mb-3 text-hero-brand">
            Caramel & Jo
          </h1>
        </div>

        {/* Bottom Section - Products */}
        <div className="flex-shrink-0">
          {/* Product Grid - Compact to fit in viewport */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-1.5 lg:gap-2">
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
      </div>
    </section>
  )
}
