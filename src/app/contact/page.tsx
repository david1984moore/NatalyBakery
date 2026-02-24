'use client'

import ContactForm from '@/components/ContactForm'
import Cart from '@/components/Cart'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePageHeroHeader } from '@/hooks/usePageHeroHeader'

export default function ContactPage() {
  usePageHeroHeader()
  const { t } = useLanguage()

  return (
    <div className="page-content-wrapper">
    <main data-scrollable className="min-h-screen min-h-[100dvh]" style={{ background: 'linear-gradient(135deg, #FCF8F4 0%, #F6EFE6 100%)' }}>
      {/* Spacer so content is not under fixed PageHeader */}
      <div className="h-[52px] md:h-0 md:min-h-0 shrink-0" aria-hidden />

      <Cart />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-32 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="pt-10 md:pt-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-warmgray-800">
              {t('contact.getInTouch')}
            </h1>
            <p className="text-lg md:text-xl text-warmgray-700 max-w-2xl mx-auto font-light">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 lg:p-10">
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
    </div>
  )
}
