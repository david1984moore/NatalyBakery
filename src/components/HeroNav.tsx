'use client'

import { useState } from 'react'
import SmoothLink from '@/components/SmoothLink'
import { Mail, UtensilsCrossed } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

/**
 * Desktop landing hero only — frosted glass over the photo.
 * Same footprint/structure as site buttons; lighter treatment so it sits on the caramel image.
 */
const DESKTOP_HERO_BTN =
  'font-ui w-[6.75rem] h-11 rounded-xl border border-white/85 bg-white/20 backdrop-blur-md text-white text-sm font-medium tracking-wide lowercase shadow-[0_2px_14px_rgba(0,0,0,0.2)] hover:bg-white/35 transition-colors duration-200 flex items-center justify-center gap-1.5'

export default function HeroNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <nav className="relative mt-5 lg:mt-6">
      {/* Desktop — centered horizontal row under brand */}
      <div className="hidden md:flex flex-row items-center justify-center gap-2.5 lg:gap-3">
        <LanguageToggle variant="desktopHero" />
        {navLinks.map((link) => {
          const isContact = link.href === '/contact'
          const isMenu = link.labelKey === 'nav.menu'
          return (
            <SmoothLink
              key={link.labelKey}
              href={link.href}
              prefetch={true}
              aria-label={isContact ? t('nav.contact') : t(link.labelKey)}
              className={DESKTOP_HERO_BTN}
            >
              {isContact && (
                <Mail className="w-4 h-4 shrink-0 text-white" strokeWidth={2.25} stroke="white" aria-hidden />
              )}
              {isMenu && (
                <UtensilsCrossed className="w-4 h-4 shrink-0 text-white" strokeWidth={2.25} stroke="white" fill="white" aria-hidden />
              )}
              <span className="leading-none">{t(link.labelKey)}</span>
            </SmoothLink>
          )
        })}
      </div>

      {/* Mobile - Hamburger (only visible if HeroNav ever used on mobile; desktop Hero block is hidden on mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden min-w-[44px] min-h-[44px] p-3 flex items-center justify-center text-white focus:outline-none"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="py-4 min-w-[min(200px,calc(100vw-2rem))]">
          {navLinks.map((link) => (
            <SmoothLink
              key={link.labelKey}
              href={link.href}
              prefetch={true}
              onClick={() => setIsOpen(false)}
              aria-label={link.href === '/contact' ? t('nav.contact') : link.href === '/menu' ? t(link.labelKey) : undefined}
              className="font-ui px-6 min-h-[44px] py-3 flex items-center justify-center text-warmgray-700 hover:bg-cream-100 font-light text-sm lowercase"
            >
              {link.href === '/contact' ? <Mail className="w-6 h-6" strokeWidth={2} /> : link.href === '/menu' ? <UtensilsCrossed className="w-6 h-6" strokeWidth={2} /> : t(link.labelKey)}
            </SmoothLink>
          ))}
          <LanguageToggle variant="mobile" />
        </div>
      </div>
    </nav>
  )
}
