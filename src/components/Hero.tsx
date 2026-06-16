'use client'

import { useEffect, useState } from 'react'
import SmoothLink from '@/components/SmoothLink'
import { Mail, UtensilsCrossed } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { OptimizedImage } from '@/components/OptimizedImage'
import HeroNav from '@/components/HeroNav'
import HeroMenuSheet from '@/components/HeroMenuSheet'

export default function Hero() {
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('hero-page')
    // Set the html background to the hero image so pull-to-refresh reveals
    // the picture instead of any background color
    const el = document.documentElement
    const prevBg = el.style.backgroundColor
    const prevBgImg = el.style.backgroundImage
    const prevBgSize = el.style.backgroundSize
    const prevBgPos = el.style.backgroundPosition
    el.style.backgroundColor = 'transparent'
    el.style.backgroundImage = "url('/Images/new_hero_1.jpeg')"
    el.style.backgroundSize = 'cover'
    el.style.backgroundPosition = 'top center'
    return () => {
      document.body.classList.remove('hero-page')
      el.style.backgroundColor = prevBg
      el.style.backgroundImage = prevBgImg
      el.style.backgroundSize = prevBgSize
      el.style.backgroundPosition = prevBgPos
    }
  }, [])

  return (
    <section
      className="relative h-[100dvh] w-full min-w-0 flex flex-col overflow-hidden md:overflow-visible shrink-0"
    >
      {/* Sentinel for sticky nav - when this scrolls out of view, show sticky bar */}
      <div id="nav-sentinel" className="absolute top-0 left-0 right-0 h-1 pointer-events-none" aria-hidden />

      {/* ========== MOBILE: full-bleed image fading to light nav bar at bottom ========== */}
      <div className="flex md:hidden absolute inset-0 z-[1] flex-col w-full min-w-0">
        {/* Image area — fills all space above the nav bar */}
        <div data-hero-content className="relative flex-1 w-full min-w-0 min-h-0">
          <div className="absolute inset-0" data-hero-image style={{ transformOrigin: 'center center' }}>
            <OptimizedImage
              src="/Images/new_hero_1.jpeg"
              alt="Orange cake dessert with fresh berries"
              fill
              priority
              sizes="100vw"
              objectFit="cover"
              markTimeline="hero"
            />
          </div>
          {/* Brand name — centered below the cake */}
          <div id="brand-name-wrapper" className="absolute top-[54%] landscape:top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-brand-playfair text-center px-8 sm:px-10 landscape:px-4 pointer-events-none">
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight text-hero-brand whitespace-nowrap landscape:text-4xl landscape:sm:text-5xl">
              Caramel &amp; Jo
            </h1>
          </div>
          {/* Bottom fade: image melts seamlessly into the nav bar background */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none"
            style={{
              height: '38%',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(250,247,242,0.55) 55%, #faf7f2 100%)',
            }}
            aria-hidden
          />
        </div>

        {/* Bottom nav bar — light background, white-bordered buttons */}
        <nav
          className="relative z-10 bg-[#faf7f2] flex items-center justify-between px-3 sm:px-5 landscape:px-[max(0.75rem,env(safe-area-inset-left))] landscape:pr-[max(0.75rem,env(safe-area-inset-right))] pt-3 landscape:pt-2"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}
          aria-label="Navigation"
        >
          <div className="flex items-center justify-start">
            <LanguageToggle variant="heroFooter" />
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 landscape:gap-3 shrink-0">
            {/* Menu icon — opens menu sheet */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="hero-btn-header hero-footer-btn-taper w-14 h-14 sm:w-16 sm:h-16 landscape:w-12 landscape:h-12 flex items-center justify-center border-[4px] landscape:border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] text-white rounded-2xl active:opacity-90 transition-opacity duration-200"
            >
              <UtensilsCrossed className="w-8 h-8 sm:w-9 sm:h-9 landscape:w-6 landscape:h-6 shrink-0" strokeWidth={2.5} fill="white" stroke="white" aria-hidden />
            </button>

            {/* Contact icon — navigates to contact page */}
            <SmoothLink
              href="/contact"
              prefetch={true}
              className="hero-btn-header hero-footer-btn-taper w-14 h-14 sm:w-16 sm:h-16 landscape:w-12 landscape:h-12 flex items-center justify-center border-[4px] landscape:border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] text-white rounded-2xl active:opacity-90 transition-opacity duration-200"
            >
              <Mail className="w-8 h-8 sm:w-9 sm:h-9 landscape:w-6 landscape:h-6 shrink-0 text-white" strokeWidth={2.5} stroke="white" aria-hidden />
            </SmoothLink>
          </div>

          <div className="flex items-center justify-end">
            {/* Order button — opens menu sheet */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Order"
              className="hero-btn-header hero-footer-btn-taper font-nav-playfair h-14 w-[6rem] sm:h-16 sm:w-[6.5rem] landscape:h-12 landscape:w-[5.5rem] flex items-center justify-center px-2.5 py-1.5 landscape:px-2 landscape:py-1 text-white text-lg landscape:text-base font-medium border-[4px] landscape:border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] rounded-2xl active:opacity-90 transition-opacity duration-200"
            >
              {t('nav.order')}
            </button>
          </div>
        </nav>
      </div>

      {/* Menu sheet — shown when menu or order button is tapped */}
      <HeroMenuSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ========== DESKTOP: original layout – brand left, HeroNav right, single image, no footer ========== */}
      <div className="hidden md:block absolute inset-0 z-[1] pointer-events-none">
        <div data-hero-content className="absolute inset-0">
          <div className="absolute inset-0" data-hero-image style={{ transformOrigin: 'center center' }}>
            <OptimizedImage
              src="/Images/IMG_7616.jpeg"
              alt="Caramel flan dessert with fresh berries"
              fill
              priority={false}
              sizes="(min-width: 1025px) 1440px, 100vw"
              objectFit="cover"
              markTimeline="hero"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="relative z-10 w-full h-full px-4 sm:px-6 lg:px-8">
          <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 md:right-6 lg:right-8 pointer-events-auto">
            <HeroNav />
          </div>
          <div id="brand-name-wrapper-desktop" className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 md:left-6 lg:left-8 font-brand-playfair">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white leading-tight text-hero-brand whitespace-nowrap">
              Caramel & Jo
            </h1>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
