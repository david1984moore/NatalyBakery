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
    <nav className="relative flex items-center justify-center gap-4 md:gap-5 safe-right">
      <LanguageToggle />
      {navLinks.map((link) => (
        <Link
          key={link.labelKey}
          href={link.href}
          className="font-ui font-bold text-lg md:text-xl text-white tracking-wide lowercase min-h-[44px] md:min-h-[52px] px-5 py-2.5 md:px-6 md:py-3 flex items-center justify-center rounded-2xl border-4 border-white/85 bg-stone-800/65 md:hover:bg-stone-700/65 md:hover:border-white transition-colors duration-200"
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
