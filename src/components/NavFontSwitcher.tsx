'use client'

import { useState, useEffect } from 'react'

type FontOption = {
  id: string
  name: string
  className: string
}

const navFontOptions: FontOption[] = [
  // Elegant serif fonts
  { id: 'playfair', name: 'Playfair Display', className: 'font-nav-playfair' },
  { id: 'cormorant', name: 'Cormorant Garamond', className: 'font-nav-cormorant' },
  { id: 'lora', name: 'Lora', className: 'font-nav-lora' },
  { id: 'cinzel', name: 'Cinzel', className: 'font-nav-cinzel' },
  // Elegant script fonts that match brand
  { id: 'tangerine', name: 'Tangerine', className: 'font-nav-tangerine' },
  { id: 'sacramento', name: 'Sacramento', className: 'font-nav-sacramento' },
  { id: 'greatvibes', name: 'Great Vibes', className: 'font-nav-greatvibes' },
  { id: 'allura', name: 'Allura', className: 'font-nav-allura' },
  { id: 'dancing', name: 'Dancing Script', className: 'font-nav-dancing' },
  { id: 'satisfy', name: 'Satisfy', className: 'font-nav-satisfy' },
  { id: 'caveat', name: 'Caveat', className: 'font-nav-caveat' },
  { id: 'stylescript', name: 'Style Script', className: 'font-nav-stylescript' },
  { id: 'italianno', name: 'Italianno', className: 'font-nav-italianno' },
  { id: 'niconne', name: 'Niconne', className: 'font-nav-niconne' },
  { id: 'luxurious', name: 'Luxurious Script', className: 'font-nav-luxurious' },
  { id: 'petitformal', name: 'Petit Formal Script', className: 'font-nav-petitformal' },
  { id: 'parisienne', name: 'Parisienne', className: 'font-nav-parisienne' },
  { id: 'alexbrush', name: 'Alex Brush', className: 'font-nav-alexbrush' },
  { id: 'marckscript', name: 'Marck Script', className: 'font-nav-marckscript' },
  { id: 'yellowtail', name: 'Yellowtail', className: 'font-nav-yellowtail' },
]

export default function NavFontSwitcher() {
  const [selectedFont, setSelectedFont] = useState<string>('sacramento')
  const [isOpen, setIsOpen] = useState(false)

  const applyFont = (fontId: string) => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    // Find all nav link elements
    const navLinks = document.querySelectorAll('[data-nav-link]')
    if (navLinks.length === 0) return
    
    // Remove all nav font classes from links
    navFontOptions.forEach((font) => {
      navLinks.forEach((link) => {
        link.classList.remove(font.className)
      })
    })
    
    // Apply selected font
    const selected = navFontOptions.find((f) => f.id === fontId)
    if (selected) {
      navLinks.forEach((link) => {
        link.classList.add(selected.className)
      })
    }
  }

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    // Wait for DOM to be ready, then load saved preference from localStorage
    const saved = localStorage.getItem('nav-font')
    if (saved) {
      setSelectedFont(saved)
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => applyFont(saved), 100)
    } else {
      // Default to sacramento
      setTimeout(() => applyFont('sacramento'), 100)
    }
  }, [])

  const handleFontChange = (fontId: string) => {
    setSelectedFont(fontId)
    applyFont(fontId)
    localStorage.setItem('nav-font', fontId)
    setIsOpen(false)
  }

  const currentFont = navFontOptions.find((f) => f.id === selectedFont)

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-warmgray-800 text-sm font-medium hover:bg-white transition-colors border border-warmgray-200"
          aria-label="Navigation Font Switcher"
        >
          Nav: {currentFont?.name.split(' ')[0]}
        </button>
        
        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl border border-warmgray-200 min-w-[240px] max-h-[70vh] overflow-y-auto">
            <div className="py-2">
              {navFontOptions.map((font) => (
                <button
                  key={font.id}
                  onClick={() => handleFontChange(font.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-cream-100 transition-colors ${
                    selectedFont === font.id
                      ? 'bg-cream-200 text-warmgray-900 font-medium'
                      : 'text-warmgray-700'
                  }`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
