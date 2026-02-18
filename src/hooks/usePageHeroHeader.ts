'use client'

import { useEffect } from 'react'

const BODY_CLASS = 'page-hero-header'

/**
 * Adds body class so mobile overscroll/body background can match the header gradient
 * (menu, contact, checkout). Ensures pull-down-to-refresh never shows a different color
 * above the header. Remove on unmount.
 */
export function usePageHeroHeader() {
  useEffect(() => {
    document.body.classList.add(BODY_CLASS)
    window.dispatchEvent(new CustomEvent('page-hero-header-change'))
    return () => {
      document.body.classList.remove(BODY_CLASS)
      window.dispatchEvent(new CustomEvent('page-hero-header-change'))
    }
  }, [])
}
