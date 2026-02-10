'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  const visibleLinks = navLinks.filter((link) => link.href !== pathname)

  useEffect(() => {
    const sentinel = document.getElementById('nav-sentinel')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  if (!isVisible) return null

  return (
    <nav
      className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warmgray-200 shadow-sm transition-opacity duration-300 safe-top"
      role="navigation"
    >
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-12 md:h-14 -translate-y-1.5">
        {/* Logo - links to homepage (refresh if already there) */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            if (window.location.pathname === '/') {
              window.location.reload()
            } else {
              window.location.href = '/'
            }
          }}
          className="font-nav-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 md:hover:text-gray-700 whitespace-nowrap cursor-pointer flex items-center min-h-[44px] brand-header-shadow"
        >
          Caramel & Jo
        </a>

        {/* Desktop - Horizontal links (Contact, Menu; no Order) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {visibleLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              prefetch={true}
              className="font-ui min-h-[46px] md:min-h-[52px] px-2.5 md:px-3 py-2 md:py-2.5 flex items-center rounded-xl border-2 border-warmgray-300 bg-transparent text-warmgray-700 font-medium text-xs md:text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageToggle variant="menu" />
        </div>
      </div>
    </nav>
  )
}
