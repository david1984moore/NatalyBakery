'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { OptimizedImage } from '@/components/OptimizedImage'

const heroFooterLinks = [{ href: '/contact', labelKey: 'nav.contact' as const }]

export default function Hero() {
  const { t } = useLanguage()
  return (
    <section className="relative h-[100svh] max-h-[100dvh] w-full flex flex-col overflow-hidden shrink-0">
      {/* Sentinel for sticky nav - when this scrolls out of view, show sticky bar */}
      <div id="nav-sentinel" className="absolute top-0 left-0 right-0 h-1 pointer-events-none" aria-hidden />

      {/* Photo - edge-to-edge, no borders or overlays */}
      <div className="absolute inset-0 z-[1]">
        {/* Mobile: top-down orange cake with berries */}
        <div className="relative block h-full w-full md:hidden">
          <OptimizedImage
            src="/Images/new_hero_1.jpeg"
            alt="Orange cake dessert with fresh berries"
            fill
            priority
            sizes="100vw"
            objectFit="cover"
          />
        </div>
        {/* Desktop: caramel flan with berries - lazy so only one hero image is priority (LCP) */}
        <div className="relative hidden h-full w-full md:block">
          <OptimizedImage
            src="/Images/IMG_7616.jpeg"
            alt="Caramel flan dessert with fresh berries"
            fill
            priority={false}
            sizes="(min-width: 1025px) 1440px, 100vw"
            objectFit="cover"
          />
        </div>
      </div>

      {/* Brand name - centered over photo. Padding gives text-shadow room so it isn't clipped. */}
      <div id="brand-name-wrapper" className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-brand-playfair text-center flex flex-col items-center gap-4 px-8 py-6 sm:px-10 sm:py-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[8rem] 2xl:text-[10rem] font-bold text-white leading-tight text-hero-brand whitespace-nowrap pointer-events-none">
          Caramel & Jo
        </h1>
        <Link
          href="/menu"
          prefetch={true}
          className="min-h-[44px] min-w-[7.5rem] py-2.5 px-3 sm:px-6 flex items-center justify-center text-white text-base font-medium lowercase border-[3.5px] border-white/85 bg-stone-800/45 backdrop-blur-sm rounded-2xl md:hover:bg-stone-700/55 md:hover:border-white transition-colors duration-200"
          style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
        >
          {t('nav.order')}
        </Link>
      </div>

      {/* Footer bar - Order, language, Contact with equal spacing; safe area as padding. */}
      <footer
        className="absolute bottom-0 left-0 right-0 z-10 bg-hero border-t border-hero-600 min-h-[36px] flex items-center justify-center px-4 sm:px-6 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        aria-label="Navigation"
      >
        <nav className="flex items-stretch justify-center gap-3 sm:gap-6 w-full max-w-2xl mx-auto px-1">
          <div className="flex-1 min-w-0 min-h-[44px] flex">
            <LanguageToggle variant="heroFooter" />
          </div>
          <div className="flex-1 min-w-0 min-h-[44px] flex">
            <Link
              href="/menu"
              prefetch={true}
              className="w-full h-full min-h-[44px] py-2.5 px-3 sm:px-6 flex items-center justify-center text-white text-base font-medium lowercase border-[3.5px] border-white/85 bg-stone-800/45 backdrop-blur-sm rounded-2xl md:hover:bg-stone-700/55 md:hover:border-white transition-colors duration-200"
              style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
            >
              {t('nav.menu')}
            </Link>
          </div>
          {heroFooterLinks.map((link) => (
            <div key={link.labelKey} className="flex-1 min-w-0 min-h-[44px] flex">
              <Link
                href={link.href}
                prefetch={true}
                className="w-full h-full min-h-[44px] py-2.5 px-3 sm:px-6 flex items-center justify-center text-white text-base font-medium border-[3.5px] border-white/85 bg-stone-800/45 backdrop-blur-sm rounded-2xl md:hover:bg-stone-700/55 md:hover:border-white transition-colors duration-200"
                style={{ fontFamily: 'var(--font-ui-active, var(--font-ui)), sans-serif' }}
              >
                {t(link.labelKey)}
              </Link>
            </div>
          ))}
        </nav>
      </footer>
    </section>
  )
}
