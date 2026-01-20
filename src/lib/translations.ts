import { Language } from '@/contexts/LanguageContext'

export type TranslationKey = 
  // Navigation
  | 'nav.gallery'
  | 'nav.contact'
  | 'nav.order'
  | 'nav.home'
  | 'nav.shop'
  
  // Cart
  | 'cart.shoppingCart'
  | 'cart.empty'
  | 'cart.total'
  | 'cart.deposit'
  | 'cart.depositPercent'
  | 'cart.remaining'
  | 'cart.remainingDue'
  | 'cart.checkout'
  | 'cart.remove'
  | 'cart.each'
  | 'cart.qty'
  
  // Menu
  | 'menu.loading'
  | 'menu.selectOption'
  | 'menu.quantity'
  | 'menu.minimum'
  | 'menu.addToCart'
  | 'menu.minimumOrder'
  
  // Checkout
  | 'checkout.title'
  | 'checkout.customerInfo'
  | 'checkout.fullName'
  | 'checkout.email'
  | 'checkout.phone'
  | 'checkout.phoneNumber'
  | 'checkout.specialInstructions'
  | 'checkout.orderSummary'
  | 'checkout.continueToPayment'
  | 'checkout.processing'
  | 'checkout.completePayment'
  | 'checkout.paymentDetails'
  | 'checkout.depositAmount'
  | 'checkout.payDeposit'
  | 'checkout.processingPayment'
  | 'checkout.loadingPaymentForm'
  | 'checkout.securePayment'
  | 'checkout.depositNote'
  
  // Contact
  | 'contact.getInTouch'
  | 'contact.subtitle'
  | 'contact.name'
  | 'contact.email'
  | 'contact.phone'
  | 'contact.phoneOptional'
  | 'contact.subject'
  | 'contact.message'
  | 'contact.sendMessage'
  | 'contact.sending'
  | 'contact.placeholder.name'
  | 'contact.placeholder.email'
  | 'contact.placeholder.phone'
  | 'contact.placeholder.subject'
  | 'contact.placeholder.message'
  | 'contact.responseTime'
  | 'contact.urgent'
  
  // Success
  | 'success.orderConfirmed'
  | 'success.thankYou'
  | 'success.orderNumber'
  | 'success.whatsNext'
  | 'success.confirmationEmail'
  | 'success.readyForPickup'
  | 'success.balanceDue'
  | 'success.loadingOrder'
  | 'success.contactUs'
  
  // About
  | 'about.title'
  | 'about.bio'
  
  // Common
  | 'common.loading'
  | 'common.error'
  | 'common.required'
  | 'common.optional'
  | 'common.home'
  
  // Products
  | 'product.flan'
  | 'product.chocoFlan'
  | 'product.cinnamonRolls'
  | 'product.brownies'
  | 'product.chocolateMatildaCake'
  | 'product.chocolateCheesecake'
  | 'product.lemonCharlotte'
  | 'product.conchas'
  
  // Variants
  | 'variant.smallPlain'
  | 'variant.smallBerries'
  | 'variant.largePlain'
  | 'variant.largeBerries'
  | 'variant.rolls6Pan'
  | 'variant.pan10'
  | 'variant.conchaShells'

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    // Navigation
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.order': 'Order',
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    
    // Cart
    'cart.shoppingCart': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total:',
    'cart.deposit': 'Deposit (50%):',
    'cart.depositPercent': 'Deposit (50%)',
    'cart.remaining': 'Remaining (due at pickup):',
    'cart.remainingDue': 'Remaining (due at pickup)',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.each': 'each',
    'cart.qty': 'Qty:',
    
    // Menu
    'menu.loading': 'Loading menu...',
    'menu.selectOption': 'Select Option:',
    'menu.quantity': 'Quantity:',
    'menu.minimum': '(Minimum {min})',
    'menu.addToCart': 'Add to Cart',
    'menu.minimumOrder': 'Minimum order of {min} shells required for Conchas',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.customerInfo': 'Customer Information',
    'checkout.fullName': 'Full Name *',
    'checkout.email': 'Email *',
    'checkout.phone': 'Phone Number *',
    'checkout.phoneNumber': 'Phone Number',
    'checkout.specialInstructions': 'Special Instructions',
    'checkout.orderSummary': 'Order Summary',
    'checkout.continueToPayment': 'Continue to Payment',
    'checkout.processing': 'Processing your order...',
    'checkout.completePayment': 'Complete Your Payment',
    'checkout.paymentDetails': 'Payment Details',
    'checkout.depositAmount': 'Deposit Amount:',
    'checkout.payDeposit': 'Pay Deposit',
    'checkout.processingPayment': 'Processing Payment...',
    'checkout.loadingPaymentForm': 'Loading payment form...',
    'checkout.securePayment': 'Your payment is secure and encrypted. We never store your card details.',
    'checkout.depositNote': 'You will pay the 50% deposit now. The remaining balance is due at pickup.',
    
    // Contact
    'contact.getInTouch': 'Get in Touch',
    'contact.subtitle': 'Have a question, custom order request, or just want to say hello? We\'d love to hear from you!',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.phoneOptional': '(optional)',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.sendMessage': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.placeholder.name': 'Your name',
    'contact.placeholder.email': 'your.email@example.com',
    'contact.placeholder.phone': '(555) 123-4567',
    'contact.placeholder.subject': 'What is this regarding?',
    'contact.placeholder.message': 'Tell us more about your inquiry...',
    'contact.responseTime': 'We typically respond within 24-48 hours.',
    'contact.urgent': 'For urgent matters, please call us directly.',
    
    // Success
    'success.orderConfirmed': 'Order Confirmed!',
    'success.thankYou': 'Thank you for your order. We\'ve received your deposit payment and will begin preparing your order.',
    'success.orderNumber': 'Order Number',
    'success.whatsNext': 'What\'s Next?',
    'success.confirmationEmail': 'You\'ll receive a confirmation email shortly with your order details.',
    'success.readyForPickup': 'We\'ll contact you when your order is ready for pickup.',
    'success.balanceDue': 'The remaining balance will be due at pickup (cash or card accepted).',
    'success.loadingOrder': 'Loading order details...',
    'success.contactUs': 'Contact Us',
    
    // About
    'about.title': 'About Nataly',
    'about.bio': 'Nataly Hernandez, originally from Puebla, Mexico, grew up in a house of cooks. Since 2025, Nataly has been offering her homemade baked foods for the world to enjoy.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.required': '*',
    'common.optional': '(optional)',
    'common.home': 'Home',
    
    // Products
    'product.flan': 'Flan',
    'product.chocoFlan': 'Choco-flan',
    'product.cinnamonRolls': 'Cinnamon Rolls',
    'product.brownies': 'Brownies',
    'product.chocolateMatildaCake': 'Chocolate Matilda Cake',
    'product.chocolateCheesecake': 'Chocolate Cheesecake',
    'product.lemonCharlotte': 'Lemon Charlotte',
    'product.conchas': 'Conchas',
    
    // Variants
    'variant.smallPlain': 'Small (6") - Plain',
    'variant.smallBerries': 'Small (6") - With Fresh Berry Garnish',
    'variant.largePlain': 'Large (10") - Plain',
    'variant.largeBerries': 'Large (10") - With Fresh Berry Garnish',
    'variant.rolls6Pan': '6 rolls/pan',
    'variant.pan10': '10" pan',
    'variant.conchaShells': 'Concha Shells',
  },
  es: {
    // Navigation
    'nav.gallery': 'Galería',
    'nav.contact': 'Contacto',
    'nav.order': 'Pedido',
    'nav.home': 'Inicio',
    'nav.shop': 'Tienda',
    
    // Cart
    'cart.shoppingCart': 'Carrito de Compras',
    'cart.empty': 'Tu carrito está vacío',
    'cart.total': 'Total:',
    'cart.deposit': 'Depósito (50%):',
    'cart.depositPercent': 'Depósito (50%)',
    'cart.remaining': 'Restante (pagar al recoger):',
    'cart.remainingDue': 'Restante (pagar al recoger)',
    'cart.checkout': 'Finalizar Compra',
    'cart.remove': 'Eliminar',
    'cart.each': 'cada uno',
    'cart.qty': 'Cantidad:',
    
    // Menu
    'menu.loading': 'Cargando menú...',
    'menu.selectOption': 'Seleccionar Opción:',
    'menu.quantity': 'Cantidad:',
    'menu.minimum': '(Mínimo {min})',
    'menu.addToCart': 'Agregar al Carrito',
    'menu.minimumOrder': 'Pedido mínimo de {min} piezas requerido para Conchas',
    
    // Checkout
    'checkout.title': 'Finalizar Compra',
    'checkout.customerInfo': 'Información del Cliente',
    'checkout.fullName': 'Nombre Completo *',
    'checkout.email': 'Correo Electrónico *',
    'checkout.phone': 'Número de Teléfono *',
    'checkout.phoneNumber': 'Número de Teléfono',
    'checkout.specialInstructions': 'Instrucciones Especiales',
    'checkout.orderSummary': 'Resumen del Pedido',
    'checkout.continueToPayment': 'Continuar al Pago',
    'checkout.processing': 'Procesando tu pedido...',
    'checkout.completePayment': 'Completa Tu Pago',
    'checkout.paymentDetails': 'Detalles del Pago',
    'checkout.depositAmount': 'Monto del Depósito:',
    'checkout.payDeposit': 'Pagar Depósito',
    'checkout.processingPayment': 'Procesando Pago...',
    'checkout.loadingPaymentForm': 'Cargando formulario de pago...',
    'checkout.securePayment': 'Tu pago está seguro y encriptado. Nunca almacenamos los detalles de tu tarjeta.',
    'checkout.depositNote': 'Pagarás el depósito del 50% ahora. El saldo restante se pagará al recoger.',
    
    // Contact
    'contact.getInTouch': 'Ponte en Contacto',
    'contact.subtitle': '¿Tienes una pregunta, solicitud de pedido personalizado o solo quieres saludar? ¡Nos encantaría saber de ti!',
    'contact.name': 'Nombre',
    'contact.email': 'Correo Electrónico',
    'contact.phone': 'Teléfono',
    'contact.phoneOptional': '(opcional)',
    'contact.subject': 'Asunto',
    'contact.message': 'Mensaje',
    'contact.sendMessage': 'Enviar Mensaje',
    'contact.sending': 'Enviando...',
    'contact.placeholder.name': 'Tu nombre',
    'contact.placeholder.email': 'tu.correo@ejemplo.com',
    'contact.placeholder.phone': '(555) 123-4567',
    'contact.placeholder.subject': '¿De qué se trata?',
    'contact.placeholder.message': 'Cuéntanos más sobre tu consulta...',
    'contact.responseTime': 'Normalmente respondemos dentro de 24-48 horas.',
    'contact.urgent': 'Para asuntos urgentes, por favor llámanos directamente.',
    
    // Success
    'success.orderConfirmed': '¡Pedido Confirmado!',
    'success.thankYou': 'Gracias por tu pedido. Hemos recibido tu pago de depósito y comenzaremos a preparar tu pedido.',
    'success.orderNumber': 'Número de Pedido',
    'success.whatsNext': '¿Qué Sigue?',
    'success.confirmationEmail': 'Recibirás un correo electrónico de confirmación pronto con los detalles de tu pedido.',
    'success.readyForPickup': 'Te contactaremos cuando tu pedido esté listo para recoger.',
    'success.balanceDue': 'El saldo restante se pagará al recoger (efectivo o tarjeta aceptados).',
    'success.loadingOrder': 'Cargando detalles del pedido...',
    'success.contactUs': 'Contáctanos',
    
    // About
    'about.title': 'Acerca de Nataly',
    'about.bio': 'Nataly Hernandez, originaria de Puebla, México, creció en una casa de cocineros. Desde 2025, Nataly ha estado ofreciendo sus alimentos horneados caseros para que el mundo disfrute.',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.required': '*',
    'common.optional': '(opcional)',
    'common.home': 'Inicio',
    
    // Products
    'product.flan': 'Flan',
    'product.chocoFlan': 'Choco-flan',
    'product.cinnamonRolls': 'Rollos de Canela',
    'product.brownies': 'Brownies',
    'product.chocolateMatildaCake': 'Pastel Matilda de Chocolate',
    'product.chocolateCheesecake': 'Pastel de Queso de Chocolate',
    'product.lemonCharlotte': 'Charlotte de Limón',
    'product.conchas': 'Conchas',
    
    // Variants
    'variant.smallPlain': 'Pequeño (6") - Simple',
    'variant.smallBerries': 'Pequeño (6") - Con Frutos Rojos Frescos',
    'variant.largePlain': 'Grande (10") - Simple',
    'variant.largeBerries': 'Grande (10") - Con Frutos Rojos Frescos',
    'variant.rolls6Pan': '6 rollos/bandeja',
    'variant.pan10': 'Bandeja de 10"',
    'variant.conchaShells': 'Conchas',
  },
}

export function getTranslation(language: Language, key: TranslationKey, params?: Record<string, string | number>): string {
  const translation = translations[language]?.[key] || key
  
  if (params) {
    return Object.entries(params).reduce(
      (text, [paramKey, paramValue]) => text.replace(`{${paramKey}}`, String(paramValue)),
      translation
    )
  }
  
  return translation
}
