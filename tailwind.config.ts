import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Device-based breakpoints: layout follows input method (touch vs pointer), not viewport width.
      // Mobile in landscape (e.g. iPhone) keeps mobile layout; desktop requires hover/pointer.
      screens: {
        // Touch devices regardless of orientation (mobile layout)
        mobile: { raw: '(hover: none) and (pointer: coarse)' },
        // Larger touch devices (tablet)
        tablet: { raw: '(hover: none) and (pointer: coarse) and (min-width: 768px)' },
        // Devices with hover (desktop layout) – use for desktop-only styling
        desktop: { raw: '(hover: hover) and (pointer: fine)' },
        // md = same as desktop so existing md: classes stay mobile-safe in landscape
        md: { raw: '(hover: hover) and (pointer: fine)' },
        // Width-based fallbacks for when layout is intentionally width-dependent
        sm: '640px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      // Apple-quality animation design system
      transitionDuration: {
        micro: '150ms', // micro-interactions (hover, small changes)
        standard: '250ms', // component transitions (modals, cards)
        page: '300ms', // page transitions (route changes)
        complex: '500ms', // complex orchestrations
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'apple-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'apple-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'apple-inout': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      colors: {
        // Warm neutrals and earth tones - pastel brownish palette
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Hero and menu page fill - light brown, two shades darker and more brown
        hero: {
          DEFAULT: '#cba878',
          600: '#c49868', /* darker for border/hover */
        },
        // Solid equivalent of header buttons (stone-800/45 on hero) - use for selected menu tab so it matches on any background
        headerButtonFill: '#a07e68',
        // Mobile only: light tan fill for header bar (matches header button area)
        headerMobileTan: '#ddd8cd',
        // Warm neutrals - soft caramel undertones
        beige: {
          50: '#faf7f1',
          100: '#f5f0e7',
          200: '#e8e0d3',
          300: '#d9cdba',
          400: '#c7b79c',
          500: '#b5a084',
        },
        cream: {
          50: '#fcf9f5',
          100: '#f8f4ee',
          200: '#f5efe5',
          300: '#f0e8dc',
          400: '#e8dfd0',
          500: '#e0d4c4',
        },
        warmgray: {
          50: '#f7f5f1',
          100: '#edebe4',
          200: '#ddd8cd',
          300: '#c9c2b3',
          400: '#b0a694',
          500: '#948a74',
          600: '#7a6f5a',
          700: '#5f5645',
          800: '#4a4336',
          900: '#352f26',
        },
        // Earth tones
        terracotta: {
          50: '#fdf5f2',
          100: '#fae8e0',
          200: '#f4d1c1',
          300: '#ecb59d',
          400: '#e29475',
          500: '#d8774f',
        },
        sage: {
          50: '#f4f6f4',
          100: '#e8ede8',
          200: '#d1dbd1',
          300: '#b4c4b4',
          400: '#92a892',
          500: '#6e866e',
        },
        tan: {
          DEFAULT: '#c9b08a', /* subtle caramel */
          600: '#c0a67e', /* tan hover */
        },
        warmbrown: {
          50: '#f7f4ef',
          100: '#edebe3',
          200: '#ddd6c6',
          300: '#c9bda8',
          400: '#b5a486',
          500: '#c9b08a', /* subtle caramel */
          600: '#c0a67e', /* warmbrown hover */
        },
        // Pastel colors for minimalist aesthetic
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    // Hover variants only when device supports hover (touch devices keep no-hover in any orientation)
    function ({ addVariant }: { addVariant: (name: string, value: string) => void }) {
      addVariant('hover', '@media (hover: hover) and (pointer: fine) { &:hover }')
      addVariant('group-hover', '@media (hover: hover) and (pointer: fine) { .group:hover & }')
    },
  ],
}
export default config
