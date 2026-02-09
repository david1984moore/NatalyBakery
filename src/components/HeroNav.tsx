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
          className="font-ui font-bold text-xs md:text-sm text-white tracking-wide lowercase min-h-[26px] px-3 py-1 flex items-center justify-center rounded-xl border-4 border-white/85 bg-stone-800/30 md:hover:bg-stone-700/40 md:hover:border-white transition-colors duration-200"
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
