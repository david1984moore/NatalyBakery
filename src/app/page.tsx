import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import StickyNav from '@/components/StickyNav'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <FeaturedProducts />
      <StickyNav />
    </main>
  )
}
