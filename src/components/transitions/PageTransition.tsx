'use client'

import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  isTransitioning: boolean
}

/**
 * Wraps page content for Apple-quality cross-fade on route change.
 * Used by app/template.tsx. GPU-accelerated opacity transition.
 */
export default function PageTransition({ children, isTransitioning }: PageTransitionProps) {
  return (
    <div
      className={`transition-opacity duration-page ease-apple ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </div>
  )
}
