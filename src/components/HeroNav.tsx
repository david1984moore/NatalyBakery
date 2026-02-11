'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function HeroNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <nav className="relative px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-3 md:py-4 lg:py-5 safe-top safe-right">
      {/* Desktop - Vertical links on right (original layout) */}
      <div className="hidden md:flex flex-col items-center gap-3 md:gap-3.5">
        <LanguageToggle />
        {navLinks.map((link) => (
          <Link
            key={link.labelKey}
            href={link.href}
            prefetch={true}
            className="font-ui text-xl md:text-2xl text-white hover:text-white transition-all duration-300 tracking-wide lowercase relative group px-4 py-1.5 rounded-full border border-transparent bg-transparent hover:border-white/50 hover:bg-tan"
            style={{ fontWeight: 500 }}
          >
            {t(link.labelKey)}
          </Link>
        ))}
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
            <Link
              key={link.labelKey}
              href={link.href}
              prefetch={true}
              onClick={() => setIsOpen(false)}
              className="font-ui px-6 min-h-[44px] py-3 flex items-center text-warmgray-700 hover:bg-cream-100 font-light text-sm lowercase"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageToggle variant="mobile" />
        </div>
      </div>
    </nav>
  )
}
