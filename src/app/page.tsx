import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import StickyNav from '@/components/StickyNav'
import MobileMenu from '@/components/MobileMenu'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <FeaturedProducts />
      <StickyNav />
      <MobileMenu />
    </main>
  )
}
