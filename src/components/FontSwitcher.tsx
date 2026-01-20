'use client'

import { useState, useEffect } from 'react'

type FontOption = {
  id: string
  name: string
  className: string
}

const fontOptions: FontOption[] = [
  // Original elegant fonts
  { id: 'playfair', name: 'Playfair Display', className: 'font-brand-playfair' },
  { id: 'cormorant', name: 'Cormorant Garamond', className: 'font-brand-cormorant' },
  { id: 'lora', name: 'Lora', className: 'font-brand-lora' },
  { id: 'libre', name: 'Libre Baskerville', className: 'font-brand-libre' },
  { id: 'crimson', name: 'Crimson Pro', className: 'font-brand-crimson' },
  { id: 'merriweather', name: 'Merriweather', className: 'font-brand-merriweather' },
  { id: 'alegreya', name: 'Alegreya', className: 'font-brand-alegreya' },
  { id: 'cinzel', name: 'Cinzel', className: 'font-brand-cinzel' },
  // Whimsical and flowy fonts
  { id: 'dancing', name: 'Dancing Script', className: 'font-brand-dancing' },
  { id: 'pacifico', name: 'Pacifico', className: 'font-brand-pacifico' },
  { id: 'satisfy', name: 'Satisfy', className: 'font-brand-satisfy' },
  { id: 'caveat', name: 'Caveat', className: 'font-brand-caveat' },
  { id: 'amatic', name: 'Amatic SC', className: 'font-brand-amatic' },
  { id: 'shadows', name: 'Shadows Into Light', className: 'font-brand-shadows' },
  { id: 'handlee', name: 'Handlee', className: 'font-brand-handlee' },
  { id: 'greatvibes', name: 'Great Vibes', className: 'font-brand-greatvibes' },
  { id: 'sacramento', name: 'Sacramento', className: 'font-brand-sacramento' },
  { id: 'fuzzy', name: 'Fuzzy Bubbles', className: 'font-brand-fuzzy' },
  { id: 'modak', name: 'Modak', className: 'font-brand-modak' },
  // Elegant, Royal, Cursive-like fonts
  { id: 'stylescript', name: 'Style Script', className: 'font-brand-stylescript' },
  { id: 'italianno', name: 'Italianno', className: 'font-brand-italianno' },
  { id: 'niconne', name: 'Niconne', className: 'font-brand-niconne' },
  { id: 'luxurious', name: 'Luxurious Script', className: 'font-brand-luxurious' },
  { id: 'petitformal', name: 'Petit Formal Script', className: 'font-brand-petitformal' },
  { id: 'parisienne', name: 'Parisienne', className: 'font-brand-parisienne' },
  { id: 'allura', name: 'Allura', className: 'font-brand-allura' },
  { id: 'alexbrush', name: 'Alex Brush', className: 'font-brand-alexbrush' },
  { id: 'marckscript', name: 'Marck Script', className: 'font-brand-marckscript' },
  { id: 'nothingyoucoulddo', name: 'Nothing You Could Do', className: 'font-brand-nothingyoucoulddo' },
  { id: 'tangerine', name: 'Tangerine', className: 'font-brand-tangerine' },
  { id: 'yellowtail', name: 'Yellowtail', className: 'font-brand-yellowtail' },
  { id: 'zeyada', name: 'Zeyada', className: 'font-brand-zeyada' },
  { id: 'indieflower', name: 'Indie Flower', className: 'font-brand-indieflower' },
  { id: 'architectsdaughter', name: 'Architects Daughter', className: 'font-brand-architectsdaughter' },
  { id: 'comingsoon', name: 'Coming Soon', className: 'font-brand-comingsoon' },
  { id: 'coveredbyyourgrace', name: 'Covered By Your Grace', className: 'font-brand-coveredbyyourgrace' },
  { id: 'rocksalt', name: 'Rock Salt', className: 'font-brand-rocksalt' },
  { id: 'swanky', name: 'Swanky and Moo Moo', className: 'font-brand-swanky' },
  { id: 'kalam', name: 'Kalam', className: 'font-brand-kalam' },
  { id: 'reeniebeanie', name: 'Reenie Beanie', className: 'font-brand-reeniebeanie' },
  { id: 'overtherainbow', name: 'Over the Rainbow', className: 'font-brand-overtherainbow' },
]

export default function FontSwitcher() {
  const [selectedFont, setSelectedFont] = useState<string>('tangerine')
  const [isOpen, setIsOpen] = useState(false)

  const applyFont = (fontId: string) => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    // Find the brand name wrapper element
    const brandWrapper = document.getElementById('brand-name-wrapper')
    if (!brandWrapper) return
    
    // Remove all font classes from wrapper
    fontOptions.forEach((font) => {
      brandWrapper.classList.remove(font.className)
    })
    
    // Apply selected font
    const selected = fontOptions.find((f) => f.id === fontId)
    if (selected) {
      brandWrapper.classList.add(selected.className)
    }
  }

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    // Wait for DOM to be ready, then load saved preference from localStorage
    const saved = localStorage.getItem('brand-font')
    if (saved) {
      setSelectedFont(saved)
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => applyFont(saved), 100)
    } else {
      // Default to tangerine
      setTimeout(() => applyFont('tangerine'), 100)
    }
  }, [])

  const handleFontChange = (fontId: string) => {
    setSelectedFont(fontId)
    applyFont(fontId)
    localStorage.setItem('brand-font', fontId)
    setIsOpen(false)
  }

  const currentFont = fontOptions.find((f) => f.id === selectedFont)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-warmgray-800 text-sm font-medium hover:bg-white transition-colors border border-warmgray-200"
          aria-label="Font Switcher"
        >
          Font: {currentFont?.name.split(' ')[0]}
        </button>
        
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-warmgray-200 min-w-[240px] max-h-[70vh] overflow-y-auto">
            <div className="py-2">
              {fontOptions.map((font) => (
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
