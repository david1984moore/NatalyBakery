'use client'

import { useEffect } from 'react'

export default function MenuBackgroundSync() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    // Use CSS variable so globals.css controls the body background
    html.style.background = 'var(--background)'
    body.style.background = 'var(--background)'

    return () => {
      html.style.background = ''
      body.style.background = ''
    }
  }, [])

  return null
}
