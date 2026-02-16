'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { TRANSITIONS } from '@/lib/transitions';

export default function TransitionScreen() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    const handleStartTransition = () => {
      setIsTransitioning(true);
      setShouldFadeOut(false);
    };

    const handlePageReady = () => {
      // Don't hide immediately - wait for page to fully settle
      setTimeout(() => {
        setShouldFadeOut(true);
        // Then actually remove after fade completes
        setTimeout(() => {
          setIsTransitioning(false);
          setShouldFadeOut(false);
        }, TRANSITIONS.overlay.fadeSpeed);
      }, 200); // Wait 200ms after page says it's ready
    };

    window.addEventListener('start-transition', handleStartTransition);
    window.addEventListener('page-ready', handlePageReady);
    
    return () => {
      window.removeEventListener('start-transition', handleStartTransition);
      window.removeEventListener('page-ready', handlePageReady);
    };
  }, []);

  const isFromHero = previousPathRef.current === '/';
  const isToHero = pathname === '/';
  const isHeroTransition = isFromHero || isToHero;
  
  useEffect(() => {
    previousPathRef.current = pathname;
  }, [pathname]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isHeroTransition 
          ? 'rgba(252, 247, 242, 0.98)'  // Nearly opaque, lighter
          : 'rgba(252, 247, 242, 0.95)',  // Nearly opaque for standard too
        backdropFilter: isHeroTransition ? 'blur(40px)' : 'blur(30px)',
        WebkitBackdropFilter: isHeroTransition ? 'blur(40px)' : 'blur(30px)',
        zIndex: 10001,
        opacity: (isTransitioning && !shouldFadeOut) ? 1 : 0,
        transition: shouldFadeOut 
          ? `opacity ${TRANSITIONS.overlay.fadeSpeed}ms ease-out` 
          : 'opacity 150ms ease-in',
        pointerEvents: 'none',
      }}
    />
  );
}
