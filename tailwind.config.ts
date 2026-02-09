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
        // Warm neutrals and earth tones for rustic warmth
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Warm neutrals
        beige: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e4dd',
          300: '#d9d3c8',
          400: '#c7bfb0',
          500: '#b5ab97',
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
          50: '#f7f6f4',
          100: '#edeae6',
          200: '#ddd8d1',
          300: '#c9c2b8',
          400: '#b0a899',
          500: '#948a78',
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
          DEFAULT: '#c9a574', /* subtle caramel warmth - slightly more brown */
          600: '#c09d6a', /* tan hover */
        },
        warmbrown: {
          50: '#f7f4f1',
          100: '#ede6df',
          200: '#d9ccc0',
          300: '#c0ab9a',
          400: '#a38670',
          500: '#c9a574', /* subtle caramel warmth - slightly more brown */
          600: '#c09d6a', /* tan hover */
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
