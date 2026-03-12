'use client'

import { useEffect } from 'react'
import ContactForm from '@/components/ContactForm'
import Cart from '@/components/Cart'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePageHeroHeader } from '@/hooks/usePageHeroHeader'

const PHONE_TEL = 'tel:+13023834536'
const PHONE_SMS = 'sms:+13023834536'

export default function ContactPage() {
  usePageHeroHeader()
  useEffect(() => {
    document.body.classList.add('contact-page')
    return () => {
      document.body.classList.remove('contact-page')
    }
  }, [])
  const { t } = useLanguage()

  return (
    <div className="page-content-wrapper">
    <main data-scrollable className="min-h-screen min-h-[100dvh] md:min-h-[calc(100vh+1px)]" style={{ background: 'linear-gradient(135deg, #FCF8F4 0%, #F6EFE6 100%)' }}>
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

            <p className="text-lg text-warmgray-500">
              {t('contact.urgentPrefix')}
              <a
                href={PHONE_SMS}
                className="hover:text-warmgray-700 font-medium text-warmgray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-warmgray-400 focus-visible:ring-offset-1 rounded"
              >
                {t('contact.textUs')}
              </a>
              {t('contact.urgentOr')}
              <a
                href={PHONE_TEL}
                className="hover:text-warmgray-700 font-medium text-warmgray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-warmgray-400 focus-visible:ring-offset-1 rounded"
              >
                {t('contact.callUs')}
              </a>
              {t('contact.urgentSuffix')}
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 lg:p-10">
            <ContactForm />
          </div>

          <p className="text-center text-lg text-warmgray-500">
            {t('contact.responseTime')}
          </p>
        </div>
      </div>
    </main>
    </div>
  )
}
