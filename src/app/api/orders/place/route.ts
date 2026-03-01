import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber, calculateDeposit } from '@/lib/utils'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const placeOrderSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(1, 'Phone number is required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  deliveryTime: z.string().min(1, 'Delivery time is required'),
  items: z
    .array(
      z.object({
        productName: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      })
    )
    .min(1, 'At least one item is required'),
  specialInstructions: z.string().optional(),
})

/**
 * Place order without Stripe payment (used while waiting for Stripe approval).
 * Creates order, sends confirmation to customer and notification to vendor.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Place order API called')
    const body = await request.json()
    console.log('📦 Request body received', {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      deliveryDate: body.deliveryDate,
      itemsCount: body.items?.length,
    })

    const validationResult = placeOrderSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
          message: validationResult.error.errors
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        },
        { status: 400 }
      )
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      items,
      specialInstructions,
    } = validationResult.data

    // No same-day orders. Orders placed today are ready for delivery the following day.
    const tz = process.env.BAKERY_TIMEZONE || 'America/New_York'
    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
    const todayStr = new Intl.DateTimeFormat('en-CA', dateOptions).format(
      new Date()
    )
    if (deliveryDate === todayStr) {
      console.warn('⚠️ Same-day order rejected', { deliveryDate, todayStr, bakeryTimezone: tz })
      return NextResponse.json(
        {
          success: false,
          error: 'Same-day delivery not available',
          message: 'Orders placed today are ready for delivery the following day. Please select tomorrow or a later date.',
        },
        { status: 400 }
      )
    }

    const itemsWithTotals = items.map((item) => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice,
    }))

    const totalAmount = itemsWithTotals.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    )
    const depositAmount = calculateDeposit(totalAmount)
    const remainingAmount = 0

    const orderNumber = generateOrderNumber()

    const deliveryDateObj = new Date(deliveryDate + 'T12:00:00')

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        deliveryLocation: deliveryAddress,
        deliveryDate: deliveryDateObj,
        deliveryTime,
        totalAmount,
        depositAmount,
        remainingAmount,
        depositPaid: false,
        status: 'PENDING',
        notes: specialInstructions || null,
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

    // Send emails (payment pending - no Stripe)
    if (process.env.GMAIL_APP_PASSWORD) {
      const [customerResult, vendorResult] = await Promise.all([
        sendOrderConfirmationEmail(order),
        sendOrderNotificationEmail(order),
      ])
      if (!customerResult.success || !vendorResult.success) {
        console.error('Email sending completed with errors:', {
          customer: customerResult.success ? 'OK' : customerResult.error,
          vendor: vendorResult.success ? 'OK' : vendorResult.error,
        })
      }
    } else {
      console.warn(
        'GMAIL_APP_PASSWORD not set - confirmation emails not sent for order',
        order.orderNumber
      )
    }

    console.log('✅ Order placed successfully', {
      orderId: order.id,
      orderNumber: order.orderNumber,
    })
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error('💥 Place order error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Order failed',
        message:
          error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
