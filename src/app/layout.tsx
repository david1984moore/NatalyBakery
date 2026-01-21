import type { Metadata } from 'next'
import { 
  Inter, 
  Playfair_Display,
  Cormorant_Garamond,
  Lora,
  Libre_Baskerville,
  Crimson_Pro,
  Merriweather,
  Alegreya,
  Cinzel,
  Dancing_Script,
  Pacifico,
  Satisfy,
  Caveat,
  Amatic_SC,
  Shadows_Into_Light,
  Handlee,
  Great_Vibes,
  Sacramento,
  Fuzzy_Bubbles,
  Modak,
  Style_Script,
  Italianno,
  Niconne,
  Luxurious_Script,
  Petit_Formal_Script,
  Parisienne,
  Allura,
  Alex_Brush,
  Marck_Script,
  Nothing_You_Could_Do,
  Tangerine,
  Yellowtail,
  Zeyada,
  Indie_Flower,
  Architects_Daughter,
  Coming_Soon,
  Covered_By_Your_Grace,
  Rock_Salt,
  Kalam,
  Reenie_Beanie
} from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-libre',
  weight: ['400', '700'],
  display: 'swap',
})

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  weight: ['400', '700', '900'],
  display: 'swap',
})

const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-alegreya',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const pacifico = Pacifico({
  subsets: ['latin'],
  variable: '--font-pacifico',
  weight: ['400'],
  display: 'swap',
})

const satisfy = Satisfy({
  subsets: ['latin'],
  variable: '--font-satisfy',
  weight: ['400'],
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const amaticSC = Amatic_SC({
  subsets: ['latin'],
  variable: '--font-amatic',
  weight: ['400', '700'],
  display: 'swap',
})

const shadowsIntoLight = Shadows_Into_Light({
  subsets: ['latin'],
  variable: '--font-shadows',
  weight: ['400'],
  display: 'swap',
})

const handlee = Handlee({
  subsets: ['latin'],
  variable: '--font-handlee',
  weight: ['400'],
  display: 'swap',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  variable: '--font-greatvibes',
  weight: ['400'],
  display: 'swap',
})

const sacramento = Sacramento({
  subsets: ['latin'],
  variable: '--font-sacramento',
  weight: ['400'],
  display: 'swap',
})

const fuzzyBubbles = Fuzzy_Bubbles({
  subsets: ['latin'],
  variable: '--font-fuzzy',
  weight: ['400', '700'],
  display: 'swap',
})

const modak = Modak({
  subsets: ['latin'],
  variable: '--font-modak',
  weight: ['400'],
  display: 'swap',
})

// Elegant, Royal, Cursive-like Fonts
const styleScript = Style_Script({
  subsets: ['latin'],
  variable: '--font-stylescript',
  weight: ['400'],
  display: 'swap',
})

const italianno = Italianno({
  subsets: ['latin'],
  variable: '--font-italianno',
  weight: ['400'],
  display: 'swap',
})

const niconne = Niconne({
  subsets: ['latin'],
  variable: '--font-niconne',
  weight: ['400'],
  display: 'swap',
})

const luxuriousScript = Luxurious_Script({
  subsets: ['latin'],
  variable: '--font-luxurious',
  weight: ['400'],
  display: 'swap',
})

const petitFormalScript = Petit_Formal_Script({
  subsets: ['latin'],
  variable: '--font-petitformal',
  weight: ['400'],
  display: 'swap',
})

const parisienne = Parisienne({
  subsets: ['latin'],
  variable: '--font-parisienne',
  weight: ['400'],
  display: 'swap',
})

const allura = Allura({
  subsets: ['latin'],
  variable: '--font-allura',
  weight: ['400'],
  display: 'swap',
})

const alexBrush = Alex_Brush({
  subsets: ['latin'],
  variable: '--font-alexbrush',
  weight: ['400'],
  display: 'swap',
})

const marckScript = Marck_Script({
  subsets: ['latin'],
  variable: '--font-marckscript',
  weight: ['400'],
  display: 'swap',
})

const nothingYouCouldDo = Nothing_You_Could_Do({
  subsets: ['latin'],
  variable: '--font-nothingyoucoulddo',
  weight: ['400'],
  display: 'swap',
})

const tangerine = Tangerine({
  subsets: ['latin'],
  variable: '--font-tangerine',
  weight: ['400', '700'],
  display: 'swap',
})

const yellowtail = Yellowtail({
  subsets: ['latin'],
  variable: '--font-yellowtail',
  weight: ['400'],
  display: 'swap',
})

const zeyada = Zeyada({
  subsets: ['latin'],
  variable: '--font-zeyada',
  weight: ['400'],
  display: 'swap',
})

const indieFlower = Indie_Flower({
  subsets: ['latin'],
  variable: '--font-indieflower',
  weight: ['400'],
  display: 'swap',
})

const architectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  variable: '--font-architectsdaughter',
  weight: ['400'],
  display: 'swap',
})

const comingSoon = Coming_Soon({
  subsets: ['latin'],
  variable: '--font-comingsoon',
  weight: ['400'],
  display: 'swap',
})

const coveredByYourGrace = Covered_By_Your_Grace({
  subsets: ['latin'],
  variable: '--font-coveredbyyourgrace',
  weight: ['400'],
  display: 'swap',
})

const rockSalt = Rock_Salt({
  subsets: ['latin'],
  variable: '--font-rocksalt',
  weight: ['400'],
  display: 'swap',
})

const kalam = Kalam({
  subsets: ['latin'],
  variable: '--font-kalam',
  weight: ['300', '400', '700'],
  display: 'swap',
})

const reenieBeanie = Reenie_Beanie({
  subsets: ['latin'],
  variable: '--font-reeniebeanie',
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Caramel & Jo - Artisan Baked Goods Made with Love",
  description: 'Fresh, homemade treats crafted daily with the finest ingredients and traditional recipes. Flan, Choco-flan, Chocolate Cake, Cinnamon Rolls, Conchas, and more.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`
      ${inter.variable} 
      ${playfairDisplay.variable}
      ${cormorantGaramond.variable}
      ${lora.variable}
      ${libreBaskerville.variable}
      ${crimsonPro.variable}
      ${merriweather.variable}
      ${alegreya.variable}
      ${cinzel.variable}
      ${dancingScript.variable}
      ${pacifico.variable}
      ${satisfy.variable}
      ${caveat.variable}
      ${amaticSC.variable}
      ${shadowsIntoLight.variable}
      ${handlee.variable}
      ${greatVibes.variable}
      ${sacramento.variable}
      ${fuzzyBubbles.variable}
      ${modak.variable}
      ${styleScript.variable}
      ${italianno.variable}
      ${niconne.variable}
      ${luxuriousScript.variable}
      ${petitFormalScript.variable}
      ${parisienne.variable}
      ${allura.variable}
      ${alexBrush.variable}
      ${marckScript.variable}
      ${nothingYouCouldDo.variable}
      ${tangerine.variable}
      ${yellowtail.variable}
      ${zeyada.variable}
      ${indieFlower.variable}
      ${architectsDaughter.variable}
      ${comingSoon.variable}
      ${coveredByYourGrace.variable}
      ${rockSalt.variable}
      ${kalam.variable}
      ${reenieBeanie.variable}
    `}>
      <body>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
