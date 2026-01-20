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
    { href: '/gallery', labelKey: 'nav.gallery' as const },
    { href: '/contact', labelKey: 'nav.contact' as const },
    { href: '/menu', labelKey: 'nav.order' as const },
  ]

  return (
    <nav className="fixed top-0 right-0 z-50 px-6 md:px-8 py-6 md:py-8">
      {/* Desktop Navigation - Vertical links on right side */}
      <div className="hidden md:flex flex-col items-end gap-4 md:gap-5">
        {navLinks.map((link) => (
          <Link
            key={link.labelKey}
            href={link.href}
            data-nav-link
            className="text-2xl md:text-3xl text-white hover:text-white hover:scale-105 transition-all duration-200 tracking-wide"
            style={{ fontFamily: 'var(--font-lora), serif', fontWeight: 400 }}
          >
            {t(link.labelKey)}
          </Link>
        ))}
        <LanguageToggle />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-white hover:text-white transition-colors duration-200 focus:outline-none"
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
              className="block px-6 py-2 text-warmgray-700 hover:bg-cream-100 hover:scale-105 transition-all duration-200 font-light text-sm"
              style={{ fontFamily: 'var(--font-lora), serif' }}
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
