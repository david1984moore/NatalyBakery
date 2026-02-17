'use client'

import { useState, useEffect } from 'react'

/**
 * Device-based "mobile" detection: touch + coarse pointer.
 * Use for layout/UX decisions so mobile layout persists in landscape (e.g. iPhone).
 * Does not change on resize/orientation — only reflects input capability.
 */
const TOUCH_DEVICE_QUERY = '(hover: none) and (pointer: coarse)'

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(TOUCH_DEVICE_QUERY)
    const set = () => setIsTouch(mql.matches)
    set()
    mql.addEventListener('change', set)
    return () => mql.removeEventListener('change', set)
  }, [])

  return isTouch
}

export { TOUCH_DEVICE_QUERY }
