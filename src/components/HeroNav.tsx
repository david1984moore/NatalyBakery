'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

const dropdownLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

const navLinks = [
  { href: '/contact', labelKey: 'nav.contact' as const },
  { href: '/menu', labelKey: 'nav.order' as const },
  { href: '/menu', labelKey: 'nav.menu' as const },
]

export default function HeroNav() {
  const { t } = useLanguage()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

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

      {/* Mobile - Hamburger with dropdown (Contact, Menu) */}
      <div className="md:hidden relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-white focus:outline-none"
          aria-expanded={isDropdownOpen}
          aria-label="Toggle navigation menu"
          aria-haspopup="true"
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
            {isDropdownOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Dropdown - shaded glass effect */}
        <div
          className={`absolute top-full right-0 mt-2 w-48 z-50 rounded-xl overflow-hidden backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 ease-out ${
            isDropdownOpen ? 'opacity-100 visible bg-[#3d3429]/50' : 'opacity-0 invisible bg-[#3d3429]/30'
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
    </nav>
  )
}
