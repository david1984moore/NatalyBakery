import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendContactEmail } from '@/lib/email'

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = validationResult.data

    // Save contact form submission to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'NEW',
      },
    })

    // Send email notification
    const emailResult = await sendContactEmail(name, email, phone, subject, message)

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error)
      // Still return success since the form was saved to database
    }

    return NextResponse.json({
      success: true,
      messageId: contact.id,
      message: 'Thank you for your message! We will get back to you soon.',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process contact form',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
