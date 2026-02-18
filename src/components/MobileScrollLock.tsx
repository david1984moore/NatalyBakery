'use client';

import { useEffect, useRef } from 'react';

export default function MobileScrollLock() {
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const trackTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY.current = e.touches[0].clientY;
      } else {
        touchStartY.current = null;
      }
    };

    const clearTouchStart = () => {
      touchStartY.current = null;
    };

    // Prevent bottom overscroll only; allow pull-to-refresh at top so whole page pulls as one cohesive unit
    const preventOverscroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-scrollable]')) return;

      if (e.touches.length > 1) return;

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const atBottom = scrollY + clientHeight >= scrollHeight;

      if (!atBottom) return;

      const startY = touchStartY.current;
      if (startY === null) return;
      const currentY = e.touches[0].clientY;
      const movingUp = currentY < startY;

      // Only prevent overscroll at bottom (pulling up); allow pull-down at top for pull-to-refresh
      if (atBottom && movingUp) {
        e.preventDefault();
      }
    };

    // Lock header during scroll momentum
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 150);
    };

    document.addEventListener('touchstart', trackTouchStart, { passive: true });
    document.addEventListener('touchend', clearTouchStart, { passive: true });
    document.addEventListener('touchcancel', clearTouchStart, { passive: true });
    document.addEventListener('touchmove', preventOverscroll, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('touchstart', trackTouchStart);
      document.removeEventListener('touchend', clearTouchStart);
      document.removeEventListener('touchcancel', clearTouchStart);
      document.removeEventListener('touchmove', preventOverscroll);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return null;
}
