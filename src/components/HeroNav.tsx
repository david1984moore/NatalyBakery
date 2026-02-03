'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMobileMenu } from '@/contexts/MobileMenuContext'
import LanguageToggle from './LanguageToggle'

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function HeroNav() {
  const { t } = useLanguage()
  const { isOpen, toggleMenu } = useMobileMenu()

  return (
    <nav className="relative px-0 md:px-4 lg:px-5 py-0 md:py-4 lg:py-5 safe-right">
      {/* Desktop - Vertical links on right */}
      <div className="hidden md:flex flex-col items-center gap-3 md:gap-3.5">
        <LanguageToggle />
        {navLinks.map((link) => (
          <Link
            key={link.labelKey}
            href={link.href}
            className="font-ui text-xl md:text-2xl text-white hover:text-white transition-all duration-300 tracking-wide lowercase relative group px-4 py-1.5 rounded-full border border-transparent bg-transparent hover:border-white/50 hover:bg-tan"
            style={{ fontWeight: 500 }}
          >
            {t(link.labelKey)}
          </Link>
        ))}
      </div>

      {/* Mobile - Hamburger (triggers sticky nav menu) */}
      <button
        onClick={toggleMenu}
        className="md:hidden min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-white focus:outline-none"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          }}
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </nav>
  )
}
