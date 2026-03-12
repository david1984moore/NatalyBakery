'use client'

import { useEffect, useState } from 'react'
import ContactForm from '@/components/ContactForm'
import Cart from '@/components/Cart'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePageHeroHeader } from '@/hooks/usePageHeroHeader'

const PHONE_TEL = 'tel:+13023834536'

export default function ContactPage() {
  const [showCallModal, setShowCallModal] = useState(false)
  usePageHeroHeader()
  useEffect(() => {
    document.body.classList.add('contact-page')
    return () => {
      document.body.classList.remove('contact-page')
    }
  }, [])

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowCallModal(false)
    }
    if (showCallModal) {
      document.addEventListener('keydown', onEscape)
      return () => document.removeEventListener('keydown', onEscape)
    }
  }, [showCallModal])
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
              {t('contact.urgentPrefix')}
              <button
                type="button"
                onClick={(e) => {
                  setShowCallModal(true)
                  ;(e.currentTarget as HTMLButtonElement).blur()
                }}
                className="hover:text-warmgray-700 font-medium text-warmgray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-warmgray-400 focus-visible:ring-offset-1 rounded"
              >
                {t('contact.callUs')}
              </button>
              {t('contact.urgentSuffix')}
            </p>
          </div>
        </div>
      </div>

      {/* Call modal */}
      {showCallModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowCallModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('contact.callModal')}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-10 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={PHONE_TEL}
              className="block w-full min-h-[44px] px-4 py-2.5 border-2 border-hero-600 bg-headerButtonFill text-white rounded-md font-medium hover:bg-hero-600 text-center"
            >
              {t('contact.callModal')}
            </a>
            <button
              type="button"
              onClick={() => setShowCallModal(false)}
              className="w-full min-h-[44px] px-4 py-2.5 border-2 border-warmgray-300 text-warmgray-700 rounded-md font-medium hover:bg-warmgray-50"
            >
              {t('checkout.cancel')}
            </button>
          </div>
        </div>
      )}
    </main>
    </div>
  )
}
