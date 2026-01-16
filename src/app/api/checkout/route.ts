import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber, calculateDeposit } from '@/lib/utils'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// Validation schema for checkout
const checkoutSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().optional(),
  items: z
    .array(
      z.object({
        productName: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      })
    )
    .min(1, 'At least one item is required'),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = checkoutSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { customerName, customerEmail, customerPhone, items, notes } = validationResult.data

    // Calculate totals
    const itemsWithTotals = items.map((item) => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice,
    }))

    const totalAmount = itemsWithTotals.reduce((sum, item) => sum + item.totalPrice, 0)
    const depositAmount = calculateDeposit(totalAmount)
    const remainingAmount = totalAmount - depositAmount

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order in database (before payment)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        totalAmount,
        depositAmount,
        remainingAmount,
        depositPaid: false,
        status: 'PENDING',
        notes: notes || null,
        items: {
          create: itemsWithTotals.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Create Stripe payment intent (50% deposit only)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(depositAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName,
        customerEmail,
        totalAmount: totalAmount.toString(),
        depositAmount: depositAmount.toString(),
        remainingAmount: remainingAmount.toString(),
      },
      description: `Order ${orderNumber} - 50% Deposit`,
      receipt_email: customerEmail,
    })

    // Update order with Stripe payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentId: paymentIntent.id,
      },
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      clientSecret: paymentIntent.client_secret,
      depositAmount,
      remainingAmount,
      totalAmount,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      {
        error: 'Checkout failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
