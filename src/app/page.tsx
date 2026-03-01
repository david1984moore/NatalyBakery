'use client';

import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import ImagePreloader from '@/components/ImagePreloader'

export default function Home() {
  return (
    <>
      <ImagePreloader images={[
        '/Images/IMG_7616.jpeg',   // Menu first product (Flan)
        '/Images/choco_5.jpeg', '/Images/flan_1.jpeg', '/Images/hero_2.jpeg',  // Choco-flan gallery
      ]} />
      <main data-scrollable className="min-h-[100svh] w-full min-w-0 flex flex-col md:min-h-screen" style={{ background: '#d6b88a' }}>
      <Hero />
      <FeaturedProducts />
    </main>
    </>
  )
}
