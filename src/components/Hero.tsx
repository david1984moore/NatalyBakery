'use client'

import SmoothLink from '@/components/SmoothLink'
import { UtensilsCrossed, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { OptimizedImage } from '@/components/OptimizedImage'
import HeroNav from '@/components/HeroNav'

const heroFooterLinks = [{ href: '/contact', labelKey: 'nav.contact' as const }]

export default function Hero() {
  const { t } = useLanguage()
  return (
    <section
      className="relative h-[100svh] max-h-[100dvh] w-full flex flex-col overflow-hidden shrink-0"
      style={{ background: 'linear-gradient(135deg, #F8ECDF 0%, #EFE2D2 100%)' }}
    >
      {/* Sentinel for sticky nav - when this scrolls out of view, show sticky bar */}
      <div id="nav-sentinel" className="absolute top-0 left-0 right-0 h-1 pointer-events-none" aria-hidden />

      {/* ========== MOBILE: centered brand, footer bar, mobile hero image (unchanged) ========== */}
      <div className="flex md:hidden absolute inset-0 z-[1] flex-col">
        <div data-hero-content className="relative flex-1 w-full">
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
          <div id="brand-name-wrapper" className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-brand-playfair text-center flex flex-col items-center gap-4 px-8 py-6 sm:px-10 sm:py-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight text-hero-brand whitespace-nowrap pointer-events-none">
            Caramel & Jo
          </h1>
          <SmoothLink
            href="/menu"
            prefetch={true}
            className="hero-order-btn hero-footer-btn-taper min-h-[42px] min-w-[7.5rem] py-2 px-3 sm:px-6 flex items-center justify-center text-white text-base font-extrabold leading-tight border-[5px] border-white/85 bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm rounded-2xl"
          >
            {t('nav.order')}
          </SmoothLink>
        </div>
        </div>
        <footer
          className="absolute bottom-0 left-0 right-0 z-10 min-h-[52px] flex items-center justify-center px-3 sm:px-5 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-r from-[#d6b88a] to-hero-600 hero-footer-bar-mobile shadow-[0_-16px_32px_rgba(0,0,0,0.35),0_-28px_56px_rgba(0,0,0,0.28)]"
          aria-label="Navigation"
        >
          <nav className="flex items-stretch justify-center gap-4 sm:gap-6 w-full max-w-sm mx-auto px-1">
            <div className="flex-1 min-w-0 min-h-[32px] flex">
              <LanguageToggle variant="heroFooter" />
            </div>
            <div className="flex-1 min-w-0 min-h-[32px] flex">
              <SmoothLink
                href="/menu"
                prefetch={true}
                className="hero-footer-btn-taper w-full h-full min-h-[32px] py-1 px-0.5 sm:px-1 flex flex-col items-center justify-center gap-0.5 text-white text-sm font-medium lowercase border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm rounded-2xl"
              >
                <UtensilsCrossed className="w-4 h-4 shrink-0" strokeWidth={2.5} fill="white" stroke="white" aria-hidden />
                <span className="text-sm leading-tight">{t('nav.menu')}</span>
              </SmoothLink>
            </div>
            {heroFooterLinks.map((link) => (
              <div key={link.labelKey} className="flex-1 min-w-0 min-h-[32px] flex">
                <SmoothLink
                  href={link.href}
                  prefetch={true}
                  className="hero-footer-btn-taper w-full h-full min-h-[32px] py-1 px-0.5 sm:px-1 flex flex-col items-center justify-center gap-0.5 text-white text-sm font-medium border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm rounded-2xl"
                >
                  <Mail className="w-4 h-4 shrink-0" strokeWidth={2.5} fill="none" stroke="white" aria-hidden />
                  <span className="text-sm leading-tight">{t(link.labelKey)}</span>
                </SmoothLink>
              </div>
            ))}
          </nav>
        </footer>
      </div>

      {/* ========== DESKTOP: original layout – brand left, HeroNav right, single image, no footer ========== */}
      <div className="hidden md:block absolute inset-0 z-[1]">
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
          <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 md:right-6 lg:right-8">
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
