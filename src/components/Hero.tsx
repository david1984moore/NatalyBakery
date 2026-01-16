import Link from 'next/link'
import Image from 'next/image'
import ProductCard from './ProductCard'

const products = [
  {
    name: 'Flan',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Choco-flan',
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Cinnamon Rolls',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Brownies',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Chocolate Matilda Cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Chocolate Cheesecake',
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Lemon Charlotte',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=1000&fit=crop&q=80',
  },
  {
    name: 'Conchas',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=1000&fit=crop&q=80',
  },
]

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-between py-6 md:py-8 lg:py-10">
        {/* Top Section - Brand Name and CTA */}
        <div className="flex-shrink-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-white leading-tight mb-2 md:mb-3 drop-shadow-md">
            Caramel & Jo
          </h1>
          <Link
            href="/menu"
            className="inline-block px-5 py-2 md:px-6 md:py-2 bg-terracotta-500/90 border border-white/60 text-white font-light text-xs md:text-sm tracking-wide rounded-sm hover:bg-terracotta-500 transition-colors duration-200"
          >
            SHOP NOW
          </Link>
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
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
