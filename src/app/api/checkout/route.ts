import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import { generateOrderNumber, calculateDeposit } from '@/lib/utils'
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
    console.log('📥 Checkout API called')
    
    // Check for required environment variables
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL is not set')
      return NextResponse.json(
        { 
          success: false,
          error: 'Database is not configured. Please contact support.',
          message: 'DATABASE_URL environment variable is missing. Please check your .env.local file.'
        },
        { status: 500 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is not set')
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment service is not configured. Please contact support.',
          message: 'STRIPE_SECRET_KEY environment variable is missing'
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    console.log('📦 Request body received', { 
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      itemsCount: body.items?.length 
    })

    // Validate request body
    const validationResult = checkoutSchema.safeParse(body)
    if (!validationResult.success) {
      console.error('❌ Validation failed', validationResult.error.errors)
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed', 
          details: validationResult.error.errors,
          message: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        },
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

    // Import prisma dynamically to avoid build-time connection
    const { prisma } = await import('@/lib/prisma')

    // Create order in database (before payment)
    let order
    try {
      order = await prisma.order.create({
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
    } catch (dbError: any) {
      console.error('💥 Database error:', dbError)
      
      // Check for specific Prisma connection errors
      if (dbError.code === 'P1001' || dbError.message?.includes('Tenant or user not found') || dbError.message?.includes('FATAL')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database connection failed',
            message: 'Unable to connect to the database. Please verify your DATABASE_URL in .env.local is correct and the database is accessible. Error: ' + (dbError.message || 'Connection failed'),
          },
          { status: 500 }
        )
      }
      
      // Re-throw other database errors to be caught by outer catch
      throw dbError
    }

    // Create Stripe payment intent (50% deposit only)
    const paymentIntent = await getStripe().paymentIntents.create({
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

    console.log('✅ Checkout successful', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      hasClientSecret: !!paymentIntent.client_secret
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
    console.error('💥 Checkout API error:', error)
    
    // Handle Prisma errors specifically
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      if (prismaError.code === 'P1001' || prismaError.message?.includes('Tenant or user not found') || prismaError.message?.includes('FATAL')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database connection failed',
            message: 'Unable to connect to the database. Please check your DATABASE_URL configuration. The database may not exist or the connection credentials may be incorrect.',
          },
          { status: 500 }
        )
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      {
        success: false,
        error: 'Checkout failed',
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && errorStack ? { stack: errorStack } : {}),
      },
      { status: 500 }
    )
  }
}
