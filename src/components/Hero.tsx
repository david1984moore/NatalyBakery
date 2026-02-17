'use client'

import SmoothLink from '@/components/SmoothLink'
import { UtensilsCrossed } from 'lucide-react'
import EnvelopeIcon from '@/components/EnvelopeIcon'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { OptimizedImage } from '@/components/OptimizedImage'
import HeroNav from '@/components/HeroNav'

const heroFooterLinks = [{ href: '/contact', labelKey: 'nav.contact' as const }]

export default function Hero() {
  const { t } = useLanguage()
  return (
    <section
      className="relative h-[100svh] max-h-[100dvh] w-full min-w-0 flex flex-col overflow-hidden shrink-0"
      style={{ background: 'linear-gradient(135deg, #F8ECDF 0%, #EFE2D2 100%)' }}
    >
      {/* Sentinel for sticky nav - when this scrolls out of view, show sticky bar */}
      <div id="nav-sentinel" className="absolute top-0 left-0 right-0 h-1 pointer-events-none" aria-hidden />

      {/* ========== MOBILE: centered brand, footer bar, mobile hero image (unchanged) ========== */}
      <div className="flex md:hidden absolute inset-0 z-[1] flex-col w-full min-w-0">
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
          <div id="brand-name-wrapper" className="absolute top-[18%] landscape:top-[12%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-brand-playfair text-center flex flex-col items-center gap-4 px-8 py-6 sm:px-10 sm:py-8 landscape:px-4 landscape:py-2">
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight text-hero-brand whitespace-nowrap pointer-events-none landscape:text-4xl landscape:sm:text-5xl">
            Caramel & Jo
          </h1>
        </div>
        </div>
        <footer
          className="absolute bottom-0 left-0 right-0 z-10 min-h-[72px] landscape:min-h-[56px] flex items-center justify-center px-3 sm:px-5 landscape:px-[max(0.5rem,env(safe-area-inset-left))] landscape:pr-[max(0.5rem,env(safe-area-inset-right))] pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-gradient-to-r from-[#d6b88a] to-hero-600 hero-footer-bar-mobile shadow-[0_-16px_32px_rgba(0,0,0,0.35),0_-28px_56px_rgba(0,0,0,0.28)]"
          aria-label="Navigation"
        >
          <nav className="flex items-center w-full max-w-md landscape:max-w-none mx-auto landscape:mx-0 min-h-[56px] landscape:min-h-[48px]">
            <div className="flex items-center justify-start flex-1 min-w-0 pr-2">
              <LanguageToggle variant="heroFooter" />
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-6 landscape:gap-3 shrink-0">
              <SmoothLink
                href="/menu"
                prefetch={true}
                className="hero-btn-header hero-footer-btn-taper w-14 h-14 sm:w-16 sm:h-16 landscape:w-12 landscape:h-12 flex items-center justify-center border-[4px] landscape:border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-2xl md:hover:opacity-90 transition-colors duration-200"
              >
                <UtensilsCrossed className="w-8 h-8 sm:w-9 sm:h-9 landscape:w-6 landscape:h-6 shrink-0" strokeWidth={2.5} fill="white" stroke="white" aria-hidden />
              </SmoothLink>
              {heroFooterLinks.map((link) => (
                <SmoothLink
                  key={link.labelKey}
                  href={link.href}
                  prefetch={true}
                  className="hero-btn-header hero-footer-btn-taper w-14 h-14 sm:w-16 sm:h-16 landscape:w-12 landscape:h-12 flex items-center justify-center border-[4px] landscape:border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-2xl md:hover:opacity-90 transition-colors duration-200"
                >
                  <EnvelopeIcon className="w-8 h-8 sm:w-9 sm:h-9 landscape:w-6 landscape:h-6 shrink-0" aria-hidden />
                </SmoothLink>
              ))}
            </div>
            <div className="flex items-center justify-end flex-1 min-w-0 pl-2">
              <SmoothLink
                href="/menu"
                prefetch={true}
                className="hero-btn-header hero-footer-btn-taper h-[42px] w-[6rem] landscape:h-[36px] landscape:w-[5.5rem] flex items-center justify-center px-2.5 py-1.5 landscape:px-2 landscape:py-1 text-white text-xs font-medium border-[4px] landscape:border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm rounded-2xl md:hover:opacity-90 transition-colors duration-200"
              >
                {t('nav.order')}
              </SmoothLink>
            </div>
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
