'use client'

import { useEffect } from 'react'

/** Same as globals.css mobile: header gradient at top for cohesive header/overscroll, then page bg, hero-footer at bottom. */
const MOBILE_BG = {
  backgroundColor: 'var(--background)',
  backgroundImage:
    'linear-gradient(to bottom, #d6b88a 0%, #c49868 8%, #e5d9c8 16%, var(--background) 22%, transparent 78%), var(--hero-footer-gradient)',
  backgroundSize: '100% 100%, 100% 22%',
  backgroundPosition: '0 0, 0 100%',
  backgroundRepeat: 'no-repeat',
}

/** Menu/contact/checkout: top overscroll area uses same gradient as header bar so pull-down never shows a different color over the header. */
const MOBILE_BG_HERO_HEADER = {
  backgroundColor: 'var(--background)',
  backgroundImage:
    'linear-gradient(to bottom, #d6b88a 0%, #c49868 10%, #c49868 28%, #e5d9c8 38%, var(--background) 45%, transparent 75%), var(--hero-footer-gradient)',
  backgroundSize: '100% 100%, 100% 22%',
  backgroundPosition: '0 0, 0 100%',
  backgroundRepeat: 'no-repeat',
}

function clearBg(el: HTMLElement) {
  el.style.background = ''
  el.style.backgroundColor = ''
  el.style.backgroundImage = ''
  el.style.backgroundSize = ''
  el.style.backgroundPosition = ''
  el.style.backgroundRepeat = ''
}

/**
 * Applies mobile viewport background on all pages so overscroll never shows white.
 * On menu/contact/checkout (body.page-hero-header), uses hero gradient at top so
 * pull-down-to-refresh never overlaps the header with a different color.
 */
export default function MobileBackgroundSync() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const mobileQuery = window.matchMedia('(hover: none) and (pointer: coarse)')

    const apply = () => {
      if (!mobileQuery.matches) {
        html.style.background = 'var(--background)'
        body.style.background = 'var(--background)'
        return
      }
      const useHeroHeader =
        typeof document !== 'undefined' && body.classList.contains('page-hero-header')
      const bg = useHeroHeader ? MOBILE_BG_HERO_HEADER : MOBILE_BG
      Object.assign(html.style, bg)
      Object.assign(body.style, bg)
    }

    apply()
    mobileQuery.addEventListener('change', apply)
    window.addEventListener('page-hero-header-change', apply)

    return () => {
      mobileQuery.removeEventListener('change', apply)
      window.removeEventListener('page-hero-header-change', apply)
      clearBg(html)
      clearBg(body)
    }
  }, [])

  return null
}
