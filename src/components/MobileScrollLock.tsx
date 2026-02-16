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

    // Prevent Safari overscroll/bounce on iOS; allow normal scrolling
    const preventOverscroll = (e: TouchEvent) => {
      // Allow scrolling within scrollable elements, prevent document-level overscroll
      const target = e.target as HTMLElement;
      if (target.closest('[data-scrollable]')) return;

      if (e.touches.length > 1) return; // Allow pinch-zoom

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const atTop = scrollY <= 0;
      const atBottom = scrollY + clientHeight >= scrollHeight;

      if (!atTop && !atBottom) return; // Middle of page: never prevent normal scroll

      const startY = touchStartY.current;
      if (startY === null) return;
      const currentY = e.touches[0].clientY;
      const movingDown = currentY > startY; // finger moving down = pull content down
      const movingUp = currentY < startY;

      // At top: only prevent when user is pulling down (overscroll), not when scrolling down
      if (atTop && movingDown) {
        e.preventDefault();
      }
      // At bottom: only prevent when user is pulling up (overscroll)
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
