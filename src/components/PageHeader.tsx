'use client';

import { usePathname } from 'next/navigation';
import SmoothLink from '@/components/SmoothLink';
import LanguageToggle from '@/components/LanguageToggle';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, UtensilsCrossed } from 'lucide-react';

const NON_HERO_PATHS = ['/menu', '/contact', '/checkout'];

export function PageHeader() {
  const pathname = usePathname();
  const isNonHeroPage = NON_HERO_PATHS.some((p) => pathname.startsWith(p));
  const { t } = useLanguage();
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isNonHeroPage) return null;

  const showMenuLink = pathname !== '/menu';
  const showContactLink = pathname !== '/contact';

  return (
    <div
      className="fixed inset-x-0 top-0 mobile-header-hero-fill max-md:bg-hero-footer-gradient md:bg-background md:backdrop-blur-sm md:shadow-[0_4px_14px_0_rgba(0,0,0,0.08)] shadow-sm isolate"
      style={{ zIndex: 2147483647, width: '100%' }}
    >
      <div className="mobile-header-hero-fill max-md:bg-hero-footer-gradient border-b-[3px] border-b-white/85 flex flex-col min-h-[40px] md:min-h-[80px] md:bg-transparent md:border-b-0">
        {/* Mobile */}
        <div
          className="md:hidden flex flex-1 items-center justify-between gap-1 min-h-[40px] min-w-0 max-w-full pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <SmoothLink
            href="/"
            className="flex-shrink min-w-0 max-w-[45%] flex items-center h-full overflow-visible"
            aria-label="Home"
          >
            <span className="text-white font-nav-playfair text-xl font-extrabold brand-header-shadow block overflow-visible">
              Caramel & Jo
            </span>
          </SmoothLink>
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <LanguageToggle variant="menuHeader" />
            {showMenuLink && (
              <SmoothLink
                href="/menu"
                aria-label={t('nav.menu')}
                className="hero-btn-header hero-footer-btn-taper min-h-[38px] md:min-h-[44px] min-w-[38px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <UtensilsCrossed
                  className="w-6 h-6 text-white shrink-0"
                  strokeWidth={2.5}
                  stroke="white"
                  fill="white"
                />
              </SmoothLink>
            )}
            {showContactLink && (
              <SmoothLink
                href="/contact"
                aria-label={t('nav.contact')}
                className="hero-btn-header hero-footer-btn-taper min-h-[38px] md:min-h-[44px] min-w-[38px] max-md:w-[38px] max-md:h-[38px] px-1.5 md:px-2.5 py-1.5 text-xs border-[3px] border-white bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm text-white rounded-xl md:hover:opacity-90 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <Mail
                  className="w-6 h-6 shrink-0 text-white"
                  strokeWidth={2.5}
                  stroke="white"
                  aria-hidden
                />
              </SmoothLink>
            )}
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent('cart:toggle'))
              }
              className="hero-btn-header hero-footer-btn-taper min-w-[38px] min-h-[38px] md:min-w-[44px] md:min-h-[44px] bg-gradient-to-r from-[#8a7160] to-[#75604f] backdrop-blur-sm rounded-full p-1.5 md:p-2 flex items-center justify-center md:hover:opacity-90 transition-colors duration-200 relative border-[3px] border-white"
              aria-label="Shopping cart"
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop */}
        <div
          className="hidden md:flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8 h-14 md:h-20"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <SmoothLink
            href="/"
            className="flex-shrink-0 flex items-center h-full"
            aria-label="Home"
          >
            <span className="font-nav-playfair text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap">
              Caramel & Jo
            </span>
          </SmoothLink>
          <div className="flex items-center gap-8 lg:gap-11 flex-shrink-0">
            {showMenuLink && (
              <SmoothLink
                href="/menu"
                aria-label={t('nav.menu')}
                className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
              >
                <UtensilsCrossed className="w-5 h-5" strokeWidth={2} />
              </SmoothLink>
            )}
            {showContactLink && (
              <SmoothLink
                href="/contact"
                aria-label={t('nav.contact')}
                className="font-ui px-3 py-1.5 rounded-md border border-transparent bg-transparent text-warmgray-700 font-medium text-sm tracking-wide hover:bg-warmbrown-500 hover:border-warmbrown-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
              >
                <Mail className="w-5 h-5" strokeWidth={2} />
              </SmoothLink>
            )}
            <LanguageToggle variant="menu" />
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent('cart:toggle'))
              }
              className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-warmgray-700 hover:bg-warmbrown-500 hover:text-white rounded-full border border-transparent hover:border-warmbrown-500 transition-colors duration-200 relative"
              aria-label="Shopping cart"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
