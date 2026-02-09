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

      {/* Full-viewport gradient: fade bands only at top/bottom; center (cake) stays clear */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(212,196,168,0.998) 0%, rgba(212,196,168,0.95) 8%, rgba(212,196,168,0.82) 18%, rgba(212,196,168,0.5) 24%, transparent 28%, transparent 72%, rgba(212,196,168,0.5) 76%, rgba(212,196,168,0.82) 82%, rgba(212,196,168,0.95) 92%, rgba(212,196,168,0.998) 100%)',
        }}
        aria-hidden
      />

      {/* Full-viewport blur: only top/bottom edges; center (cake) stays sharp */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none backdrop-blur-xl"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 14%, rgba(0,0,0,0.9) 18%, rgba(0,0,0,0.6) 22%, transparent 26%, transparent 74%, rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.9) 82%, black 86%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 14%, rgba(0,0,0,0.9) 18%, rgba(0,0,0,0.6) 22%, transparent 26%, transparent 74%, rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.9) 82%, black 86%, black 100%)',
        }}
        aria-hidden
      />

      {/* Photo: fade only at very top/bottom so cake stays fully visible */}
      <div
        className="absolute inset-0 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,0.6) 18%, black 24%, black 76%, rgba(0,0,0,0.6) 82%, rgba(0,0,0,0.2) 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,0.6) 18%, black 24%, black 76%, rgba(0,0,0,0.6) 82%, rgba(0,0,0,0.2) 92%, transparent 100%)',
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

      {/* Top section: tint only above cake (no overlap with cake) */}
      <div
        className="absolute top-0 left-0 right-0 z-10 h-[24%] min-h-0 pt-4 pb-12 flex flex-col justify-start pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(212,196,168,0.35) 0%, rgba(212,196,168,0.12) 60%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.6) 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.6) 70%, transparent 100%)',
        }}
      />

      {/* Brand name - centered over photo */}
      <div id="brand-name-wrapper" className="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-brand-playfair text-center pointer-events-none">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[10rem] font-bold text-white leading-tight text-hero-brand">
          <span className="block">Caramel</span>
          <span className="block -mt-5">& Jo</span>
        </h1>
      </div>

      {/* Bottom section: order button + nav links, tint only below cake (no overlap with cake) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 h-[28%] min-h-0 pb-6 pt-14 flex flex-col items-center justify-end gap-7"
        style={{
          background: 'linear-gradient(to top, rgba(212,196,168,0.35) 0%, rgba(212,196,168,0.12) 60%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.6) 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.6) 70%, transparent 100%)',
        }}
      >
        <Link
          href="/menu"
          className="font-brand-playfair font-bold text-2xl text-white min-h-[52px] px-10 flex items-center justify-center rounded-xl border-4 border-white/85 bg-stone-800/30 md:hover:bg-stone-700/40 md:hover:border-white transition-colors duration-200"
        >
          {t('nav.order')}
        </Link>
        <div className="flex justify-center">
          <HeroNav />
        </div>
      </div>
    </section>
  )
}
