'use client'

import { useEffect } from 'react'

/**
 * Syncs document background for the menu page. On desktop, html and body use
 * --background. On mobile, html and body both use --overscroll-top so the
 * overscroll bounce (rubber-band) at the top shows header brown instead of
 * white; the menu content wrapper has bg-background so the page stays cream.
 */
export default function MenuBackgroundSync() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const mobileQuery = window.matchMedia('(max-width: 767px)')

    const apply = () => {
      if (mobileQuery.matches) {
        html.style.background = 'var(--overscroll-top)'
        body.style.background = 'var(--overscroll-top)'
      } else {
        html.style.background = 'var(--background)'
        body.style.background = 'var(--background)'
      }
    }

    apply()
    mobileQuery.addEventListener('change', apply)

    return () => {
      mobileQuery.removeEventListener('change', apply)
      html.style.background = ''
      body.style.background = ''
    }
  }, [])

  return null
}
