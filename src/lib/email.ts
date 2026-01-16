import { Resend } from 'resend'
import { Order, OrderItem } from '@prisma/client'
import { formatCurrency } from './utils'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_FROM = process.env.EMAIL_FROM || 'caramelcakeJo@gmail.com'
const EMAIL_TO = process.env.EMAIL_TO || 'caramelcakeJo@gmail.com'

type OrderWithItems = Order & {
  items: OrderItem[]
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(order: OrderWithItems) {
  try {
    const depositAmount = formatCurrency(order.depositAmount)
    const remainingAmount = formatCurrency(order.remainingAmount)
    const totalAmount = formatCurrency(order.totalAmount)

    const itemsList = order.items
      .map(
        (item) =>
          `  • ${item.productName} × ${item.quantity} = ${formatCurrency(item.totalPrice)}`
      )
      .join('\n')

    const emailContent = `
Dear ${order.customerName},

Thank you for your order at Caramel & Jo! We've received your order and are excited to prepare your treats.

Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}

Items Ordered:
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: ${totalAmount}
Deposit Paid (50%): ${depositAmount}
Remaining Balance (50%): ${remainingAmount}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${order.notes ? `Special Instructions:\n${order.notes}\n\n` : ''}
Payment Status:
✅ Deposit of ${depositAmount} has been received.
⏳ Remaining balance of ${remainingAmount} is due when you pick up your order.

We'll notify you once your order is ready for pickup. If you have any questions, please don't hesitate to contact us.

With love,
Caramel & Jo
`

    await resend.emails.send({
      from: `Caramel & Jo <${EMAIL_FROM}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>').replace(/━━━+/g, '<hr>'),
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Send order notification email to vendor
 */
export async function sendOrderNotificationEmail(order: OrderWithItems) {
  try {
    const depositAmount = formatCurrency(order.depositAmount)
    const remainingAmount = formatCurrency(order.remainingAmount)
    const totalAmount = formatCurrency(order.totalAmount)

    const itemsList = order.items
      .map(
        (item) =>
          `  • ${item.productName} × ${item.quantity} @ ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.totalPrice)}`
      )
      .join('\n')

    const emailContent = `
🍰 NEW ORDER RECEIVED 🍰

Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })}

Customer Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${order.customerName}
Email: ${order.customerEmail}
${order.customerPhone ? `Phone: ${order.customerPhone}` : ''}

Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount: ${totalAmount}
Deposit Paid (50%): ${depositAmount}
Remaining Due (50%): ${remainingAmount}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${order.notes ? `Customer Notes:\n${order.notes}\n\n` : ''}
Payment:
✅ ${depositAmount} deposit received via Stripe
💰 ${remainingAmount} due at pickup

Please confirm this order and begin preparation.

View order details: ${process.env.NEXT_PUBLIC_APP_URL || 'https://caramelandjo.com'}/admin/orders/${order.id}
`

    await resend.emails.send({
      from: `Order System <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      subject: `🍰 New Order: ${order.orderNumber} - ${order.customerName}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>').replace(/━━━+/g, '<hr>'),
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending order notification email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Send contact form email
 */
export async function sendContactEmail(name: string, email: string, phone: string | null, subject: string, message: string) {
  try {
    const emailContent = `
New Contact Form Submission

From: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Subject: ${subject}

Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please respond to: ${email}
`

    await resend.emails.send({
      from: `Contact Form <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>').replace(/━━━+/g, '<hr>'),
    })

    // Send confirmation to customer
    await resend.emails.send({
      from: `Caramel & Jo <${EMAIL_FROM}>`,
      to: email,
      subject: `Thank you for contacting Caramel & Jo`,
      text: `Dear ${name},\n\nThank you for reaching out! We've received your message and will get back to you soon.\n\nBest regards,\nCaramel & Jo`,
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending contact email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
