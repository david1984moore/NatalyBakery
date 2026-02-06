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
          quality={70}
          sizes="(min-width: 1025px) 1920px, 100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwA/8AAI/9k="
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full h-full px-4 sm:px-6 lg:px-8 safe-top">
        {/* Nav - top-right on mobile (aligned with brand), vertically centered on desktop */}
        <div className="absolute top-4 right-4 md:top-1/2 md:-translate-y-1/2 md:right-6 lg:right-8">
          <HeroNav />
        </div>

        {/* Brand Name - top-left on mobile, vertically centered on desktop */}
        <div id="brand-name-wrapper" className="absolute top-4 left-4 md:top-1/2 md:-translate-y-1/2 md:left-6 lg:left-8 font-brand-playfair">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white leading-tight text-hero-brand whitespace-nowrap">
            Caramel & Jo
          </h1>
        </div>
      </div>
    </section>
  )
}
