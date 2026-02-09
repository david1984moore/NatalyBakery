'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function HeroNav() {
  const { t } = useLanguage()

  return (
    <nav className="relative flex items-center justify-center gap-4 md:gap-6 safe-right">
      <LanguageToggle />
      {navLinks.map((link) => (
        <Link
          key={link.labelKey}
          href={link.href}
          className="font-brand-playfair font-bold text-lg md:text-xl text-white tracking-wide lowercase px-3 py-2 rounded-full border border-transparent bg-transparent hover:border-white/50 hover:bg-tan transition-all duration-300"
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
