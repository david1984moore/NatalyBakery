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
            />
          ))}
        </div>
      </div>
    </section>
  )
}
