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
        '/Images/conchas_3.jpeg', '/Images/conchas_1.jpeg', '/Images/conchas_2.jpeg', '/Images/conchas_4.jpeg',  // Conchas gallery
      ]} />
      <main data-scrollable className="min-h-[100svh] w-full min-w-0 flex flex-col md:min-h-screen" style={{ background: 'linear-gradient(135deg, #F8ECDF 0%, #EFE2D2 100%)' }}>
      <Hero />
      <FeaturedProducts />
    </main>
    </>
  )
}
