'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TRANSITIONS } from '@/lib/transitions';

export default function TransitionOverlay() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);

    const isHero = pathname === '/';
    const hold = isHero ? TRANSITIONS.hero.overlayHold : TRANSITIONS.standard.overlayHold;

    let timer: ReturnType<typeof setTimeout>;

    const handleReady = () => {
      timer = setTimeout(() => {
        setIsTransitioning(false);
      }, hold);
    };

    // Fallback in case page-ready never fires
    const fallback = setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);

    window.addEventListener('page-ready', handleReady, { once: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
      window.removeEventListener('page-ready', handleReady);
    };
  }, [pathname]);

  if (!isTransitioning) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #FCF7F2 0%, #F6EFE8 100%)',
        zIndex: 99,
        pointerEvents: 'none',
        opacity: 1, // Always 1 now since we only render when transitioning
        transition: 'opacity 120ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  );
}
