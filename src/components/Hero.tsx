import Image from 'next/image'
import HeroNav from './HeroNav'

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Sentinel for sticky nav - when this scrolls out of view, show sticky bar */}
      <div id="nav-sentinel" className="absolute top-0 left-0 right-0 h-1 pointer-events-none" aria-hidden />

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
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full h-full px-4 sm:px-6 lg:px-8">
        {/* Nav - absolute right, vertically centered */}
        <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 md:right-6 lg:right-8">
          <HeroNav />
        </div>

        {/* Brand Name - vertically centered, left side */}
        <div id="brand-name-wrapper" className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 md:left-6 lg:left-8 font-brand-playfair">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white leading-tight text-hero-brand whitespace-nowrap">
            Caramel & Jo
          </h1>
        </div>
      </div>
    </section>
  )
}
