import nodemailer from 'nodemailer'
import { Order, OrderItem } from '@prisma/client'
import { formatCurrency } from './utils'

const EMAIL_FROM = process.env.EMAIL_FROM || 'caramelcakejo@gmail.com'
const EMAIL_TO = process.env.EMAIL_TO || 'caramelcakejo@gmail.com'

type OrderWithItems = Order & {
  items: OrderItem[]
}

/**
 * Create Nodemailer transporter for Gmail SMTP
 */
function createTransporter() {
  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_APP_PASSWORD environment variable is missing. Please set up a Gmail App Password.')
  }

  const gmailUser = process.env.GMAIL_USER || EMAIL_FROM
  const gmailPassword = process.env.GMAIL_APP_PASSWORD

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword, // This should be an App Password, not the regular Gmail password
    },
  })
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(order: OrderWithItems) {
  console.log('📧 Sending order confirmation email to:', order.customerEmail)
  
  try {
    const depositAmount = formatCurrency(order.depositAmount)
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
Total: ${totalAmount}
${order.depositPaid ? `Payment: ${depositAmount} (paid in full)` : `Amount due: ${depositAmount}`}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${order.deliveryDate && order.deliveryTime ? `Requested Delivery:\n${new Date(order.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at ${order.deliveryTime}\n\n` : ''}
${order.notes ? `Special Instructions:\n${order.notes}\n\n` : ''}
Payment Status:
${order.depositPaid ? `✅ Full payment of ${depositAmount} has been received.` : `⏳ Payment of ${depositAmount} will be arranged separately. We'll reach out to confirm your order and payment details.`}

We'll notify you once your order is ready. If you have any questions, please don't hesitate to contact us.

With love,
Caramel & Jo
`

    const transporter = createTransporter()
    
    const result = await transporter.sendMail({
      from: `"Caramel & Jo" <${EMAIL_FROM}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>').replace(/━━━+/g, '<hr>'),
    })

    console.log('✅ Order confirmation email sent successfully:', {
      messageId: result.messageId,
      to: order.customerEmail,
      orderNumber: order.orderNumber,
    })

    return { success: true }
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
    })
    return { success: false, error: errorMessage }
  }
}

/**
 * Send order notification email to vendor
 */
export async function sendOrderNotificationEmail(order: OrderWithItems) {
  console.log('📧 Sending order notification email to vendor:', EMAIL_TO)
  
  try {
    const depositAmount = formatCurrency(order.depositAmount)
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
Phone: ${order.customerPhone}
${order.deliveryLocation ? `Delivery Address: ${order.deliveryLocation}` : ''}
${order.deliveryDate && order.deliveryTime ? `Requested Delivery: ${new Date(order.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at ${order.deliveryTime}` : ''}

Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount: ${totalAmount}
${order.depositPaid ? `Payment: ${depositAmount} (paid in full)` : `Amount due: ${depositAmount}`}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${order.notes ? `Special Instructions:\n${order.notes}\n\n` : ''}
Payment:
${order.depositPaid ? `✅ Full payment of ${depositAmount} received via Stripe` : `⏳ Payment pending - amount due: ${depositAmount}. Customer will pay separately.`}

Please confirm this order and the delivery time/day, then begin preparation.

View order details: ${process.env.NEXT_PUBLIC_APP_URL || 'https://caramelandjo.com'}/admin/orders/${order.id}
`

    const transporter = createTransporter()
    
    const result = await transporter.sendMail({
      from: `"Order System" <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      subject: `🍰 New Order: ${order.orderNumber} - ${order.customerName}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>').replace(/━━━+/g, '<hr>'),
    })

    console.log('✅ Order notification email sent successfully:', {
      messageId: result.messageId,
      to: EMAIL_TO,
      orderNumber: order.orderNumber,
    })

    return { success: true }
  } catch (error) {
    console.error('❌ Error sending order notification email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      orderNumber: order.orderNumber,
      vendorEmail: EMAIL_TO,
    })
    return { success: false, error: errorMessage }
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

    const transporter = createTransporter()
    
    // Send to vendor
    await transporter.sendMail({
      from: `"Contact Form" <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>').replace(/━━━+/g, '<hr>'),
    })

    // Send confirmation to customer
    await transporter.sendMail({
      from: `"Caramel & Jo" <${EMAIL_FROM}>`,
      to: email,
      subject: `Thank you for contacting Caramel & Jo`,
      text: `Dear ${name},\n\nThank you for reaching out! We've received your message and will get back to you soon.\n\nBest regards,\nCaramel & Jo`,
      html: `<p>Dear ${name},</p><p>Thank you for reaching out! We've received your message and will get back to you soon.</p><p>Best regards,<br>Caramel & Jo</p>`,
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending contact email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
