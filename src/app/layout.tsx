import type { Metadata } from 'next'
import { Inter, Roboto, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

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
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://caramelandjo.onrender.com'),
  title: "Caramel & Jo - Where caramel dreams become cake",
  description: 'Fresh, homemade treats crafted daily with the finest ingredients and traditional recipes. Flan, Choco-flan, Chocolate Cake, Cinnamon Rolls, Conchas, and more.',
  openGraph: {
    title: "Caramel & Jo - Where caramel dreams become cake",
    description: 'Fresh, homemade treats crafted daily with the finest ingredients and traditional recipes.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${playfairDisplay.variable}`}>
      <body>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
