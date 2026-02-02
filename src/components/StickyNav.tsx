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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
        {/* Logo - links to top */}
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 leading-tight inline-block"
        >
          <span className="block">Caramel</span>
          <span className="block text-center">& Jo</span>
        </Link>

        {/* Desktop - Horizontal links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="font-ui text-warmgray-700 hover:text-warmgray-900 font-medium text-sm tracking-wide"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageToggle variant="menu" />
        </div>

        {/* Mobile - Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle variant="menu" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-700"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-warmgray-200 bg-white py-4 px-4 safe-x safe-bottom">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-ui min-h-[44px] py-3 flex items-center text-warmgray-700 hover:text-warmgray-900"
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
