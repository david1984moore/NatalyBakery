'use client'

import Image from 'next/image'
import Link from 'next/link'
import HeroNav from './HeroNav'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Sentinel for sticky nav - when this scrolls out of view, show sticky bar */}
      <div id="nav-sentinel" className="absolute top-0 left-0 right-0 h-1 pointer-events-none" aria-hidden />

      {/* Background - light wood tone to match table (visible in faded areas) */}
      <div className="absolute inset-0 z-0 bg-[#d4c4a8]" aria-hidden />

      {/* Full-viewport gradient: very long fade bands, transparent only in narrow middle */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(212,196,168,0.998) 0%, rgba(212,196,168,0.99) 0.3%, rgba(212,196,168,0.98) 0.8%, rgba(212,196,168,0.95) 2%, rgba(212,196,168,0.9) 4%, rgba(212,196,168,0.82) 7%, rgba(212,196,168,0.72) 11%, rgba(212,196,168,0.58) 16%, rgba(212,196,168,0.44) 22%, rgba(212,196,168,0.3) 29%, rgba(212,196,168,0.18) 37%, rgba(212,196,168,0.08) 46%, transparent 48%, transparent 52%, rgba(212,196,168,0.08) 54%, rgba(212,196,168,0.18) 63%, rgba(212,196,168,0.3) 71%, rgba(212,196,168,0.44) 78%, rgba(212,196,168,0.58) 84%, rgba(212,196,168,0.72) 89%, rgba(212,196,168,0.82) 93%, rgba(212,196,168,0.9) 96%, rgba(212,196,168,0.95) 98%, rgba(212,196,168,0.98) 99.2%, rgba(212,196,168,0.99) 99.7%, rgba(212,196,168,0.998) 100%)',
        }}
        aria-hidden
      />

      {/* Full-viewport blur: only top/bottom edges; center (cake) stays sharp */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none backdrop-blur-xl"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 18%, rgba(0,0,0,0.95) 22%, rgba(0,0,0,0.82) 26%, rgba(0,0,0,0.55) 29%, transparent 32%, transparent 68%, rgba(0,0,0,0.55) 71%, rgba(0,0,0,0.82) 74%, rgba(0,0,0,0.95) 78%, black 82%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 18%, rgba(0,0,0,0.95) 22%, rgba(0,0,0,0.82) 26%, rgba(0,0,0,0.55) 29%, transparent 32%, transparent 68%, rgba(0,0,0,0.55) 71%, rgba(0,0,0,0.82) 74%, rgba(0,0,0,0.95) 78%, black 82%, black 100%)',
        }}
        aria-hidden
      />

      {/* Photo: extra-long fade (28% each side) so edges disappear into blur/tint */}
      <div
        className="absolute inset-0 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.015) 0.2%, rgba(0,0,0,0.05) 1%, rgba(0,0,0,0.1) 3%, rgba(0,0,0,0.18) 6%, rgba(0,0,0,0.28) 10%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.54) 20%, rgba(0,0,0,0.68) 25%, black 28%, black 72%, rgba(0,0,0,0.68) 75%, rgba(0,0,0,0.54) 80%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.28) 90%, rgba(0,0,0,0.18) 94%, rgba(0,0,0,0.1) 97%, rgba(0,0,0,0.05) 99%, rgba(0,0,0,0.015) 99.8%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.015) 0.2%, rgba(0,0,0,0.05) 1%, rgba(0,0,0,0.1) 3%, rgba(0,0,0,0.18) 6%, rgba(0,0,0,0.28) 10%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.54) 20%, rgba(0,0,0,0.68) 25%, black 28%, black 72%, rgba(0,0,0,0.68) 75%, rgba(0,0,0,0.54) 80%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.28) 90%, rgba(0,0,0,0.18) 94%, rgba(0,0,0,0.1) 97%, rgba(0,0,0,0.05) 99%, rgba(0,0,0,0.015) 99.8%, transparent 100%)',
        }}
      >
        <Image
          src="/Images/IMG_7616.jpeg"
          alt="Caramel flan dessert with fresh berries"
          fill
          className="object-contain"
          priority
          quality={70}
          sizes="(min-width: 1025px) 1920px, 100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwA/8AAI/9k="
        />
      </div>

      {/* Top section: tint only (no blur to avoid blur-edge line), fades gradually */}
      <div
        className="absolute top-0 left-0 right-0 z-10 min-h-[36%] pt-4 pb-12 flex flex-col justify-start"
        style={{
          background: 'linear-gradient(to bottom, rgba(212,196,168,0.35) 0%, rgba(212,196,168,0.12) 60%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.997) 1%, rgba(0,0,0,0.99) 3%, rgba(0,0,0,0.97) 6%, rgba(0,0,0,0.94) 10%, rgba(0,0,0,0.89) 16%, rgba(0,0,0,0.82) 24%, rgba(0,0,0,0.72) 34%, rgba(0,0,0,0.6) 46%, rgba(0,0,0,0.46) 58%, rgba(0,0,0,0.32) 70%, rgba(0,0,0,0.18) 82%, rgba(0,0,0,0.06) 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.997) 1%, rgba(0,0,0,0.99) 3%, rgba(0,0,0,0.97) 6%, rgba(0,0,0,0.94) 10%, rgba(0,0,0,0.89) 16%, rgba(0,0,0,0.82) 24%, rgba(0,0,0,0.72) 34%, rgba(0,0,0,0.6) 46%, rgba(0,0,0,0.46) 58%, rgba(0,0,0,0.32) 70%, rgba(0,0,0,0.18) 82%, rgba(0,0,0,0.06) 94%, transparent 100%)',
        }}
      >
        <div className="flex justify-center">
          <HeroNav />
        </div>
      </div>

      {/* Brand name - centered over photo */}
      <div id="brand-name-wrapper" className="absolute top-[16%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-brand-playfair text-center pointer-events-none">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[10rem] font-bold text-white leading-tight text-hero-brand">
          <span className="block">Caramel</span>
          <span className="block -mt-5">& Jo</span>
        </h1>
      </div>

      {/* Bottom section: tint only (no blur to avoid blur-edge line), fades gradually */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 min-h-[36%] pb-6 pt-14 flex flex-col items-center justify-end"
        style={{
          background: 'linear-gradient(to top, rgba(212,196,168,0.35) 0%, rgba(212,196,168,0.12) 60%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.997) 1%, rgba(0,0,0,0.99) 3%, rgba(0,0,0,0.97) 6%, rgba(0,0,0,0.94) 10%, rgba(0,0,0,0.89) 16%, rgba(0,0,0,0.82) 24%, rgba(0,0,0,0.72) 34%, rgba(0,0,0,0.6) 46%, rgba(0,0,0,0.46) 58%, rgba(0,0,0,0.32) 70%, rgba(0,0,0,0.18) 82%, rgba(0,0,0,0.06) 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.997) 1%, rgba(0,0,0,0.99) 3%, rgba(0,0,0,0.97) 6%, rgba(0,0,0,0.94) 10%, rgba(0,0,0,0.89) 16%, rgba(0,0,0,0.82) 24%, rgba(0,0,0,0.72) 34%, rgba(0,0,0,0.6) 46%, rgba(0,0,0,0.46) 58%, rgba(0,0,0,0.32) 70%, rgba(0,0,0,0.18) 82%, rgba(0,0,0,0.06) 94%, transparent 100%)',
        }}
      >
        <Link
          href="/menu"
          className="md:hidden font-brand-playfair font-bold text-2xl text-white min-h-[52px] px-10 flex items-center justify-center rounded-md border-[3px] border-white/70 bg-white/20 md:hover:bg-white/40 md:hover:border-white/90 transition-colors duration-200"
        >
          {t('nav.order')}
        </Link>
      </div>
    </section>
  )
}
