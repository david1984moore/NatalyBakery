import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import StickyNav from '@/components/StickyNav'

export default function Home() {
  return (
    <main className="min-h-[100svh] flex flex-col md:min-h-screen">
      <Hero />
      <FeaturedProducts />
      <StickyNav />
    </main>
  )
}
