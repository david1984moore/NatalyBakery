import type { Metadata } from 'next'
import { Inter, Roboto, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import StickyNav from '@/components/StickyNav'
import { PageHeader } from '@/components/PageHeader'
import MobileScrollLock from '@/components/MobileScrollLock'
import PageTransition from '@/components/PageTransition'
import TransitionOverlay from '@/components/TransitionOverlay'
import TransitionScreen from '@/components/TransitionScreen'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  // CRITICAL: viewport-fit=cover enables edge-to-edge rendering on iOS.
  // Without this, iOS adds default margins in landscape orientation, causing
  // visible letterbox borders on left/right. Use env(safe-area-inset-*) for notch handling.
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://caramelandjo.onrender.com'),
  title: "Caramel & Jo - Where caramel dreams become cake",
  description: 'Fresh, homemade treats crafted daily with the finest ingredients and traditional recipes. Flan, Choco-flan, Chocolate Cake, Cinnamon Rolls, and more.',
  openGraph: {
    title: 'Where caramel dreams become cake!',
    description: 'caramelandjo.onrender.com',
  },
  /** theme-color set via manual meta tags in head (with media for light/dark overscroll) */
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${playfairDisplay.variable}`}>
      <head>
        {/* Status bar + iOS overscroll: header brown so status bar and overscroll bounce match header gradient */}
        <meta name="theme-color" content="#d6b88a" />
        <meta name="theme-color" content="#d6b88a" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#d6b88a" media="(prefers-color-scheme: dark)" />
        {/* LCP: preload hero image so the browser starts fetching before parsing body (AVIF = first source in picture) */}
        <link
          rel="preload"
          as="image"
          href="/optimized/new_hero_1-sm.avif"
          media="(hover: none) and (pointer: coarse)"
        />
        <link
          rel="preload"
          as="image"
          href="/optimized/IMG_7616-xl.avif"
          media="(hover: hover) and (pointer: fine)"
        />
      </head>
      <body>
        <MobileScrollLock />
        <TransitionScreen />
        <LanguageProvider>
          <CartProvider>
            <StickyNav />
            <PageHeader />
            <TransitionOverlay />
            <PageTransition>
              {children}
            </PageTransition>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
