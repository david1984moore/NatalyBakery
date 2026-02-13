'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import PageTransition from '@/components/transitions/PageTransition'

/**
 * Re-renders on route change so we can run exit → swap → enter.
 * Exit phase: 150ms opacity 0, then swap children and enter (300ms opacity 1).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 150)
    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <PageTransition isTransitioning={isTransitioning}>
      {displayChildren}
    </PageTransition>
  )
}
