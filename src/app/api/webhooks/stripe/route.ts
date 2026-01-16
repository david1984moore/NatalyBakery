import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

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
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json({ error: `Invalid signature: ${error}` }, { status: 400 })
    }

    // Handle payment intent succeeded (deposit paid successfully)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = paymentIntent.metadata.orderId

      if (!orderId) {
        console.error('Order ID missing from payment intent metadata', {
          paymentIntentId: paymentIntent.id,
          metadata: paymentIntent.metadata,
        })
        return NextResponse.json({ error: 'Order ID missing' }, { status: 400 })
      }

      try {
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
        Promise.all([
          sendOrderConfirmationEmail(order),
          sendOrderNotificationEmail(order),
        ]).catch((error) => {
          console.error('Error sending confirmation emails:', error)
          // Log but don't fail the webhook
        })

        console.log(`Order ${order.orderNumber} confirmed - deposit paid`)
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
