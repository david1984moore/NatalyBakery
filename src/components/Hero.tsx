import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20 bg-gradient-to-b from-cream-50 via-cream-100 to-beige-50">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8 md:space-y-12">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-warmbrown-600 leading-tight">
            Artisan Baked Goods
            <br />
            <span className="text-terracotta-500">Made with Love</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-warmgray-600 max-w-2xl mx-auto leading-relaxed">
            Fresh, homemade treats crafted daily with the finest ingredients
            and traditional recipes passed down through generations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4">
            <Link
              href="/menu"
              className="w-full sm:w-auto px-8 py-4 bg-terracotta-500 text-white font-semibold rounded-lg hover:bg-terracotta-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-terracotta-300"
            >
              View Menu
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-warmbrown-500 text-warmbrown-600 font-semibold rounded-lg hover:bg-warmbrown-50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-warmbrown-300"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-warmgray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
