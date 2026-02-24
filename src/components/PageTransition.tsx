'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { TRANSITIONS } from '@/lib/transitions';

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(true);
  const isInitialMount = useRef(true);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Skip animation on initial mount (no transform so sticky/fixed headers work)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      wrapper.style.opacity = '1';
      wrapper.style.transform = '';
      wrapper.style.willChange = '';
      previousPathRef.current = pathname;
      return;
    }

    // Determine transition type based on current and previous paths
    const isFromHero = previousPathRef.current === '/';
    const isToHero = pathname === '/';
    const isHeroTransition = isFromHero || isToHero;
    
    // Update previous path for next transition
    previousPathRef.current = pathname;

    const heroImage = wrapper.querySelector('[data-hero-image]') as HTMLElement;

    if (isHeroTransition) {
      const duration = TRANSITIONS.hero.fadeIn;
      const inverseZoom = 2 - TRANSITIONS.hero.zoomAmount;
      
      if (heroImage) {
        wrapper.style.opacity = '0';
        wrapper.style.transition = 'none';
        
        // Zoom the hero image
        heroImage.style.transform = `scale(${inverseZoom}) translateZ(0)`;
        heroImage.style.opacity = '0';
        heroImage.style.transition = 'none';
        
        let clearTimer: ReturnType<typeof setTimeout> | null = null;
        const timer = setTimeout(() => {
          heroImage.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-in`;
          heroImage.style.transform = 'scale(1) translateZ(0)';
          heroImage.style.opacity = '1';
          
          wrapper.style.transition = `opacity ${duration}ms ease-in`;
          wrapper.style.opacity = '1';
          
          // Clear wrapper transform so sticky/fixed headers work (transform creates a containing block)
          clearTimer = setTimeout(() => {
            wrapper.style.transform = '';
            wrapper.style.willChange = '';
          }, duration + 150);
          setIsReady(true);
          window.dispatchEvent(new CustomEvent('page-ready'));
        }, 100);

        return () => {
          clearTimeout(timer);
          if (clearTimer) clearTimeout(clearTimer);
        };
      } else {
        // No hero image, zoom the whole wrapper
        wrapper.style.transform = `scale(${inverseZoom}) translateZ(0)`;
        wrapper.style.opacity = '0';
        wrapper.style.transition = 'none';
        
        let clearTimer: ReturnType<typeof setTimeout> | null = null;
        const timer = setTimeout(() => {
          wrapper.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-in`;
          wrapper.style.transform = 'scale(1) translateZ(0)';
          wrapper.style.opacity = '1';
          // Clear transform after animation so sticky/fixed headers work
          clearTimer = setTimeout(() => {
            wrapper.style.transform = '';
            wrapper.style.willChange = '';
          }, duration + 150);
          setIsReady(true);
          window.dispatchEvent(new CustomEvent('page-ready'));
        }, 100);

        return () => {
          clearTimeout(timer);
          if (clearTimer) clearTimeout(clearTimer);
        };
      }
    } else {
      // STANDARD TRANSITION
      wrapper.style.opacity = '0';
      wrapper.style.visibility = 'hidden';
      wrapper.style.transition = 'none';
      
      const images = wrapper.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      const clearWrapperTransform = () => {
        wrapper.style.transform = '';
        wrapper.style.willChange = '';
      };

      let hasRun = false;
      
      Promise.all(imagePromises).then(() => {
        if (hasRun) return;
        hasRun = true;
        
        // Wait extra time for React to finish hydrating
        setTimeout(() => {
          wrapper.style.visibility = 'visible';
          wrapper.style.transition = 'none'; // NO FADE - instant reveal
          wrapper.style.opacity = '1';
          clearWrapperTransform();
          
          // Fire page-ready immediately so overlay can start fading
          setIsReady(true);
          window.dispatchEvent(new CustomEvent('page-ready'));
        }, 100); // Wait 100ms after images load
      });

      const fallbackTimer = setTimeout(() => {
        if (hasRun) return;
        hasRun = true;
        
        wrapper.style.visibility = 'visible';
        wrapper.style.transition = 'none';
        wrapper.style.opacity = '1';
        clearWrapperTransform();
        setIsReady(true);
        window.dispatchEvent(new CustomEvent('page-ready'));
      }, TRANSITIONS.standard.maxWait);

      return () => {
        clearTimeout(fallbackTimer);
      };
    }
  }, [pathname]);

  return (
    <div 
      ref={wrapperRef}
      data-page-wrapper
      style={{ 
        minHeight: '100vh',
        willChange: 'opacity, transform',
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
}
