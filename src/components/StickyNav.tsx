'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

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
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warmgray-200 shadow-sm transition-opacity duration-300 safe-top"
      role="navigation"
    >
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-14 md:h-16">
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
          className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap cursor-pointer flex items-center min-h-[44px]"
        >
          Caramel & Jo
        </a>

        {/* Desktop - Horizontal links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="font-ui min-h-[44px] px-3 py-1.5 flex items-center rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageToggle variant="menu" />
        </div>

        {/* Mobile - Hamburger (navigates directly to menu page) */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle variant="menu" />
          <Link
            href="/menu"
            className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-700"
            aria-label="Go to menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  )
}
