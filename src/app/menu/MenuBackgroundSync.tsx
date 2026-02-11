'use client'

import { useEffect } from 'react'

/**
 * Syncs document background for the menu page. On desktop, html and body use
 * --background. On mobile, html keeps --overscroll-top so the overscroll bounce
 * (rubber-band) at the top shows the header brown instead of a white strip;
 * body still uses --background for the page content.
 */
export default function MenuBackgroundSync() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const mobileQuery = window.matchMedia('(max-width: 767px)')

    const apply = () => {
      if (mobileQuery.matches) {
        html.style.background = 'var(--overscroll-top)'
        body.style.background = 'var(--background)'
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
