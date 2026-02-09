import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm neutrals and earth tones - pastel brownish palette
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Hero and menu page fill - light wood tone (matches hero fade)
        hero: {
          DEFAULT: '#d4c4a8',
          600: '#b8a88a', /* darker for border/hover */
        },
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
    // Disable hover effects on mobile (screens < 768px) - no hover animations on touch
    function ({ addVariant }: { addVariant: (name: string, value: string) => void }) {
      addVariant('hover', '@media (min-width: 768px) { &:hover }')
      addVariant('group-hover', '@media (min-width: 768px) { .group:hover & }')
    },
  ],
}
export default config
