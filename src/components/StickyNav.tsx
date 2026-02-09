'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

const dropdownLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { t } = useLanguage()
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
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

        {/* Desktop - Horizontal links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="font-ui min-h-[44px] px-3 py-1.5 flex items-center rounded-md border-2 border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageToggle variant="menu" />
        </div>

        {/* Mobile - Hamburger with dropdown (Contact, Menu) */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle variant="menu" />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-700"
              aria-expanded={isDropdownOpen}
              aria-label="Toggle navigation menu"
              aria-haspopup="true"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {isDropdownOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Dropdown - shaded glass effect */}
            <div
              className={`absolute top-full right-0 mt-2 w-48 z-50 rounded-xl overflow-hidden backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 ease-out ${
                isDropdownOpen ? 'opacity-100 visible bg-[#3d3429]/45' : 'opacity-0 invisible bg-[#3d3429]/30'
              }`}
            >
              <div className="py-2 px-2 flex flex-col gap-1">
                {dropdownLinks.map((link) => (
                  <Link
                    key={link.labelKey}
                    href={link.href}
                    onClick={() => setIsDropdownOpen(false)}
                    className="font-playfair font-medium min-h-[44px] px-4 py-2.5 flex items-center text-base text-white rounded-lg md:hover:bg-white/20"
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
