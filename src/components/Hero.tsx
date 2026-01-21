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
      <div className="relative z-10 w-full h-full flex flex-col justify-between py-6 md:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
        {/* Top Section - Brand Name */}
        <div className="flex-shrink-0 font-brand-tangerine" id="brand-name-wrapper">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-white leading-tight mb-2 md:mb-3 text-hero-brand">
            Caramel & Jo
          </h1>
        </div>

        {/* Bottom Section - Products */}
        <div className="flex-shrink-0 w-full px-0">
          {/* Product Grid - Centered and fully visible */}
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 md:gap-3 lg:gap-4 justify-items-center items-stretch">
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
      </div>
    </section>
  )
}
