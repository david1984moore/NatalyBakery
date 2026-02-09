'use client'

import { useEffect } from 'react'

const HEADER_BG = '#d1b080' // warmbrown-500 - matches menu header

export default function MenuBackgroundSync() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    html.style.background = HEADER_BG
    body.style.background = HEADER_BG

    return () => {
      html.style.background = ''
      body.style.background = ''
    }
  }, [])

  return null
}
