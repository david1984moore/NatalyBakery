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
          prefetch={true}
          className="font-ui font-bold text-base md:text-lg text-white tracking-wide lowercase min-h-[32px] md:min-h-[36px] px-4 py-1.5 md:px-5 md:py-2 flex items-center justify-center rounded-xl border-2 border-white/85 bg-stone-800/45 backdrop-blur-sm md:hover:bg-stone-700/55 md:hover:border-white transition-colors duration-200"
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
