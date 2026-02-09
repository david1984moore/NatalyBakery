import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/email'

// Force dynamic rendering - prevents Next.js from trying to analyze this route during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Initialize Stripe lazily to avoid connection during build
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return stripeInstance
}

// This endpoint handles Stripe webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json({ error: `Invalid signature: ${error}` }, { status: 400 })
    }

    // Handle payment intent succeeded (deposit paid successfully)
    if (event.type === 'payment_intent.succeeded') {
      console.log('📥 Received payment_intent.succeeded webhook')
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = paymentIntent.metadata.orderId

      console.log('📦 Payment Intent details:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        orderId,
        metadata: paymentIntent.metadata,
      })

      if (!orderId) {
        console.error('❌ Order ID missing from payment intent metadata', {
          paymentIntentId: paymentIntent.id,
          metadata: paymentIntent.metadata,
        })
        return NextResponse.json({ error: 'Order ID missing' }, { status: 400 })
      }

      try {
        // First, check if order already has deposit paid (idempotency check)
        const existingOrder = await prisma.order.findUnique({
          where: { id: orderId },
          select: { depositPaid: true, orderNumber: true },
        })

        if (!existingOrder) {
          console.error(`❌ Order not found: ${orderId}`)
          return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // If deposit already paid, this is a duplicate webhook - skip email sending
        if (existingOrder.depositPaid) {
          console.log(`⚠️ Order ${existingOrder.orderNumber} already has deposit paid - skipping email sending (idempotency)`)
          return NextResponse.json({ success: true, orderId, message: 'Order already processed' })
        }

        // Update order status
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            depositPaid: true,
            depositPaidAt: new Date(),
            status: 'CONFIRMED',
          },
          include: {
            items: true,
          },
        })

        // Send confirmation emails asynchronously (don't wait for completion)
        // Only sent once because we checked depositPaid above
        Promise.all([
          sendOrderConfirmationEmail(order),
          sendOrderNotificationEmail(order),
        ])
          .then((results) => {
            const customerResult = results[0]
            const vendorResult = results[1]
            
            if (customerResult.success && vendorResult.success) {
              console.log(`✅ All emails sent successfully for order ${order.orderNumber}`)
            } else {
              console.error(`⚠️ Email sending completed with errors for order ${order.orderNumber}:`, {
                customerEmail: customerResult.success ? '✅' : `❌ ${customerResult.error}`,
                vendorEmail: vendorResult.success ? '✅' : `❌ ${vendorResult.error}`,
              })
            }
          })
          .catch((error) => {
            console.error('❌ Fatal error sending confirmation emails:', error)
            console.error('Error details:', {
              message: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : undefined,
            })
            // Log but don't fail the webhook
          })

        console.log(`✅ Order ${order.orderNumber} confirmed - deposit paid`)
        return NextResponse.json({ success: true, orderId: order.id })
      } catch (dbError) {
        console.error('Database error updating order:', dbError)
        return NextResponse.json(
          { error: 'Failed to update order', message: dbError instanceof Error ? dbError.message : 'Unknown error' },
          { status: 500 }
        )
      }
    }

    // Handle payment intent failed
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = paymentIntent.metadata.orderId

      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'CANCELLED',
            },
          })
          console.log(`Order ${orderId} cancelled - payment failed`)
        } catch (dbError) {
          console.error('Database error updating cancelled order:', dbError)
        }
      }
    }

    // Return success for other event types (we don't handle them yet)
    return NextResponse.json({ received: true, eventType: event.type })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Support GET for webhook endpoint verification (Stripe sometimes tests with GET)
export async function GET() {
  return NextResponse.json({ message: 'Stripe webhook endpoint is active' })
}
