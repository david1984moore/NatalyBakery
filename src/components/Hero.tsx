import Image from 'next/image'
import Link from 'next/link'
import HeroNav from './HeroNav'

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Sentinel for sticky nav - when this scrolls out of view, show sticky bar */}
      <div id="nav-sentinel" className="absolute top-0 left-0 right-0 h-1 pointer-events-none" aria-hidden />

      {/* Background Image - mobile: berry cake; desktop: flan */}
      <div
        className="absolute inset-0 z-0 md:hidden bg-no-repeat"
        style={{
          backgroundImage: "url('/Images/choco_5.jpeg')",
          backgroundSize: '130%',
          backgroundPosition: 'center 30%',
        }}
        role="img"
        aria-label="Layered cake with fresh berries"
      />
      <div className="absolute inset-0 z-0 md:hidden bg-black/10" aria-hidden />
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/Images/IMG_7616.jpeg"
          alt="Caramel flan dessert with fresh berries"
          fill
          className="object-cover object-[center_30%]"
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
        {/* Nav - centered on top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <HeroNav />
        </div>

        {/* Brand Name + Order - centered, stacked */}
        <div id="brand-name-wrapper" className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-10 font-brand-playfair text-center">
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[9rem] xl:text-[11rem] 2xl:text-[14rem] font-bold text-white leading-tight text-hero-brand">
            <span className="block">Caramel</span>
            <span className="block">& Jo</span>
          </h1>
          {/* Mobile Order - sits under brand */}
          <Link
            href="/menu"
            className="md:hidden font-brand-playfair font-bold text-2xl text-white min-h-[52px] px-10 flex items-center justify-center rounded-full bg-[#3d3429]/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            order
          </Link>
        </div>
      </div>
    </section>
  )
}
