/**
 * Type definitions for contact form
 */

export interface ContactFormRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ContactFormResponse {
  success: boolean
  messageId?: string
  message?: string
  error?: string
  details?: any
}
