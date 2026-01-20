'use client'

import Navigation from '@/components/Navigation'
import ContactForm from '@/components/ContactForm'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

export default function ContactPage() {
  const { t } = useLanguage()
  
  return (
    <main className="min-h-screen bg-cream-50/30">
      <Navigation />
      
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex-shrink-0 px-3 py-1.5"
          aria-label="Home"
        >
          <span className="text-black font-nav-tangerine text-xl md:text-2xl font-bold">Caramel & Jo</span>
        </Link>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-warmgray-800">
              {t('contact.getInTouch')}
            </h1>
            <p className="text-lg md:text-xl text-warmgray-600 max-w-2xl mx-auto font-light">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 lg:p-10">
            <ContactForm />
          </div>

          {/* Additional Contact Information */}
          <div className="text-center space-y-2 pt-4">
            <p className="text-sm text-warmgray-500">
              {t('contact.responseTime')}
            </p>
            <p className="text-sm text-warmgray-500">
              {t('contact.urgent')}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
