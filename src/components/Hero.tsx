'use client'

import Image from 'next/image'
import Link from 'next/link'
import HeroNav from './HeroNav'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  return (
    <section className="relative h-svh w-full flex flex-col overflow-hidden">
      {/* Sentinel for sticky nav - when this scrolls out of view, show sticky bar */}
      <div id="nav-sentinel" className="absolute top-0 left-0 right-0 h-1 pointer-events-none" aria-hidden />

      {/* Photo - edge-to-edge, no borders or overlays */}
      <div className="absolute inset-0 z-[1]">
        {/* Mobile: top-down orange cake with berries */}
        <Image
          src="/Images/hero_2.jpeg"
          alt="Orange cake dessert with fresh berries"
          fill
          className="object-cover object-center block md:hidden"
          priority
          quality={70}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwA/8AAI/9k="
        />
        {/* Desktop: caramel flan with berries */}
        <Image
          src="/Images/IMG_7616.jpeg"
          alt="Caramel flan dessert with fresh berries"
          fill
          className="object-cover object-center hidden md:block"
          priority
          quality={70}
          sizes="(min-width: 1025px) 1920px, 100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwA/8AAI/9k="
        />
      </div>

      {/* Brand name - centered over photo */}
      <div id="brand-name-wrapper" className="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-brand-playfair text-center pointer-events-none">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[10rem] font-bold text-white leading-tight text-hero-brand whitespace-nowrap">
          Caramel & Jo
        </h1>
      </div>

      {/* Bottom section: order button + nav links */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-[28%] min-h-0 pb-6 pt-14 flex flex-col items-center justify-end gap-7">
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
