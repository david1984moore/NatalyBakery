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
    <nav className="relative flex items-center justify-center gap-2 md:gap-3 safe-right">
      <LanguageToggle />
      {navLinks.map((link) => (
        <Link
          key={link.labelKey}
          href={link.href}
          className="font-ui font-bold text-xs md:text-sm text-white tracking-wide lowercase min-h-[26px] px-3 py-1 flex items-center justify-center rounded-md border-2 border-white/70 bg-white/20 md:hover:bg-white/40 md:hover:border-white/90 transition-colors duration-200"
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
