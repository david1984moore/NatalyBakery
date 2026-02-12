'use client'

import { useEffect } from 'react'

/** Same as globals.css mobile: cream at top, hero-footer gradient at bottom (single source of truth via --hero-footer-gradient). */
const MOBILE_BG = {
  backgroundColor: 'var(--background)',
  backgroundImage:
    'linear-gradient(to bottom, var(--background) 0%, transparent 78%), var(--hero-footer-gradient)',
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
 * Applies mobile viewport background on all pages so overscroll never shows white:
 * cream at top, hero-footer-matching gradient at bottom. Runs in root layout.
 */
export default function MobileBackgroundSync() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const mobileQuery = window.matchMedia('(max-width: 767px)')

    const apply = () => {
      if (mobileQuery.matches) {
        Object.assign(html.style, MOBILE_BG)
        Object.assign(body.style, MOBILE_BG)
      } else {
        html.style.background = 'var(--background)'
        body.style.background = 'var(--background)'
      }
    }

    apply()
    mobileQuery.addEventListener('change', apply)

    return () => {
      mobileQuery.removeEventListener('change', apply)
      clearBg(html)
      clearBg(body)
    }
  }, [])

  return null
}
