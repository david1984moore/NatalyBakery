'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, MouseEvent, startTransition, useEffect } from 'react';
import { TRANSITIONS } from '@/lib/transitions';

interface SmoothLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

export default function SmoothLink({ 
  href, 
  children, 
  className, 
  onClick,
  ...props 
}: SmoothLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    onClick?.();
    
    const isFromHero = pathname === '/';
    const isToHero = href === '/';
    const isHeroTransition = isFromHero || isToHero;
    
window.dispatchEvent(new CustomEvent('start-transition'));
    
    const heroImage = document.querySelector('[data-hero-image]') as HTMLElement;
    const wrapper = document.querySelector('[data-page-wrapper]') as HTMLElement;
    const target = heroImage || wrapper;
    
    if (!target) {
      router.push(href);
      return;
    }
    
    if (isHeroTransition) {
      const duration = TRANSITIONS.hero.fadeOut;
      target.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-out`;
      target.style.transform = `scale(${TRANSITIONS.hero.zoomAmount}) translateZ(0)`;
      target.style.opacity = '0';
      
      setTimeout(() => {
        startTransition(() => {
          router.push(href);
        });
      }, duration);
    } else {
      const duration = TRANSITIONS.standard.fadeOut;
      target.style.transition = `opacity ${duration}ms ease-out`;
      target.style.opacity = '0';
      
      setTimeout(() => {
        startTransition(() => {
          router.push(href);
        });
      }, duration);
    }
  };

  return (
    <Link 
      href={href}
      onClick={handleClick}
      className={className}
      prefetch={true}
      {...props}
    >
      {children}
    </Link>
  );
}
