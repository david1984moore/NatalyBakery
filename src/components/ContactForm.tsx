'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ContactFormRequest } from '@/types/contact'
import { useLanguage } from '@/contexts/LanguageContext'

// Validation schema - messages are basic since validation happens on submit
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContactFormProps {
  onSuccess?: () => void
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message')
      }

      setSubmitStatus({
        type: 'success',
        message: result.message || 'Thank you for your message! We will get back to you soon.',
      })

      // Reset form on success
      reset()

      // Call success callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-warmgray-700 mb-2">
          {t('contact.name')} <span className="text-red-500">{t('common.required')}</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={`w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border rounded-md focus:ring-2 focus:ring-warmbrown-400 focus:border-warmbrown-400 outline-none transition-colors ${
            errors.name ? 'border-red-300' : 'border-warmgray-300'
          }`}
          placeholder={t('contact.placeholder.name')}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-warmgray-700 mb-2">
          {t('contact.email')} <span className="text-red-500">{t('common.required')}</span>
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-warmbrown-400 focus:border-warmbrown-400 outline-none transition-colors ${
            errors.email ? 'border-red-300' : 'border-warmgray-300'
          }`}
          placeholder={t('contact.placeholder.email')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field (Optional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-warmgray-700 mb-2">
          {t('contact.phone')} <span className="text-warmgray-500 text-xs">{t('contact.phoneOptional')}</span>
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-warmbrown-400 focus:border-warmbrown-400 outline-none transition-colors ${
            errors.phone ? 'border-red-300' : 'border-warmgray-300'
          }`}
          placeholder={t('contact.placeholder.phone')}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-warmgray-700 mb-2">
          {t('contact.subject')} <span className="text-red-500">{t('common.required')}</span>
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-warmbrown-400 focus:border-warmbrown-400 outline-none transition-colors ${
            errors.subject ? 'border-red-300' : 'border-warmgray-300'
          }`}
          placeholder={t('contact.placeholder.subject')}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-warmgray-700 mb-2">
          {t('contact.message')} <span className="text-red-500">{t('common.required')}</span>
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={6}
          className={`w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm border rounded-md focus:ring-2 focus:ring-warmbrown-400 focus:border-warmbrown-400 outline-none transition-colors resize-y ${
            errors.message ? 'border-red-300' : 'border-warmgray-300'
          }`}
          placeholder={t('contact.placeholder.message')}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Status Messages */}
      {submitStatus.type && (
        <div
          className={`px-4 py-3 rounded-md text-sm ${
            submitStatus.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Submit Button - uses warmbrown (tan) from tailwind config */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[44px] bg-warmbrown-500 text-warmgray-800 py-3 sm:py-2 rounded-md hover:bg-warmbrown-600 transition-colors duration-200 font-medium text-base sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t('contact.sending') : t('contact.sendMessage')}
      </button>
    </form>
  )
}
