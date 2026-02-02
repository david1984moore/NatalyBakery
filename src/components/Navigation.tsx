'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { href: '/contact', labelKey: 'nav.contact' as const },
    { href: '/menu', labelKey: 'nav.order' as const },
  ]

  return (
    <nav className="fixed top-0 right-0 z-50 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 safe-top safe-right">
      {/* Desktop Navigation - Vertical links on right side */}
      <div className="hidden md:flex flex-col items-end gap-4 md:gap-5">
        {navLinks.map((link) => (
          <Link
            key={link.labelKey}
            href={link.href}
            data-nav-link
            className="font-ui text-2xl md:text-3xl text-white hover:text-white hover:scale-105 transition-transform duration-200 tracking-wide will-change-transform"
            style={{ fontWeight: 400 }}
          >
            {t(link.labelKey)}
          </Link>
        ))}
        <LanguageToggle />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden min-w-[44px] min-h-[44px] p-3 flex items-center justify-center text-white hover:text-white transition-colors duration-200 focus:outline-none"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="py-4 min-w-[200px]">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              onClick={() => setIsOpen(false)}
              data-nav-link
              className="font-ui block px-6 py-2 text-warmgray-700 hover:bg-cream-100 hover:scale-105 transition-[transform,background-color] duration-200 font-light text-sm will-change-transform"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageToggle variant="mobile" />
        </div>
      </div>
    </nav>
  )
}
