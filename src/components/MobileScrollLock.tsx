'use client';

import { useEffect } from 'react';

export default function MobileScrollLock() {
  useEffect(() => {
    // Prevent Safari overscroll/bounce on iOS
    const preventOverscroll = (e: TouchEvent) => {
      // Allow scrolling within scrollable elements, prevent document-level overscroll
      const target = e.target as HTMLElement;

      // If we're in a scrollable container, allow it
      if (target.closest('[data-scrollable]')) return;

      // Prevent default document overscroll
      if (e.touches.length > 1) return; // Allow pinch-zoom

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // At top - prevent pull-down overscroll
      if (scrollY <= 0) {
        e.preventDefault();
      }
      // At bottom - prevent pull-up overscroll
      if (scrollY + clientHeight >= scrollHeight) {
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

    document.addEventListener('touchmove', preventOverscroll, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('touchmove', preventOverscroll);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return null;
}
