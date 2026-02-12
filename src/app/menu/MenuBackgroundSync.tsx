'use client'

import { useEffect } from 'react'

/** Same as globals.css mobile: cream at top, footer-matching gradient at bottom (no brown bar at top). */
const MOBILE_BG = {
  backgroundColor: 'var(--background)',
  backgroundImage: 'linear-gradient(to bottom, var(--background) 0%, transparent 78%), linear-gradient(to right, #b89878, #8b6b4d)',
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
 * Syncs document background for the menu page. On desktop, html and body use
 * --background. On mobile, uses same gradient as globals.css: cream at top (no brown bar),
 * footer-matching gradient at bottom; overscroll behavior unchanged.
 */
export default function MenuBackgroundSync() {
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
