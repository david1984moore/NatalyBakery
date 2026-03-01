import { Language } from '@/contexts/LanguageContext'

export type TranslationKey = 
  // Navigation
  | 'nav.contact'
  | 'nav.order'
  | 'nav.home'
  | 'nav.shop'
  | 'nav.menu'
  
  // Cart
  | 'cart.shoppingCart'
  | 'cart.empty'
  | 'cart.total'
  | 'cart.deposit'
  | 'cart.depositPercent'
  | 'cart.remaining'
  | 'cart.remainingDue'
  | 'cart.checkout'
  | 'cart.continueShopping'
  | 'cart.remove'
  | 'cart.each'
  | 'cart.qty'
  
  // Menu
  | 'menu.loading'
  | 'menu.selectOption'
  | 'menu.quantity'
  | 'menu.minimum'
  | 'menu.addToCart'
  | 'menu.addedToCart'
  | 'menu.minimumOrder'
  | 'menu.deliveryNote'
  
  // Checkout
  | 'checkout.title'
  | 'checkout.customerInfo'
  | 'checkout.fullName'
  | 'checkout.email'
  | 'checkout.phone'
  | 'checkout.phoneNumber'
  | 'checkout.deliveryAddress'
  | 'checkout.deliveryLocation'
  | 'checkout.deliveryDate'
  | 'checkout.deliveryTime'
  | 'checkout.deliveryTimeWindow'
  | 'checkout.nextDayNote'
  | 'checkout.specialInstructions'
  | 'checkout.placeholder.address'
  | 'checkout.placeholder.specialInstructions'
  | 'checkout.selectTime'
  | 'checkout.orderSummary'
  | 'checkout.continueToPayment'
  | 'checkout.submitOrder'
  | 'checkout.confirmOrder'
  | 'checkout.confirmOrderMessage'
  | 'checkout.confirmOrderTotal'
  | 'checkout.cancel'
  | 'checkout.processing'
  | 'checkout.completePayment'
  | 'checkout.paymentDetails'
  | 'checkout.depositAmount'
  | 'checkout.payDeposit'
  | 'checkout.processingPayment'
  | 'checkout.loadingPaymentForm'
  | 'checkout.securePayment'
  | 'checkout.depositNote'
  | 'checkout.paymentArrangedNote'
  
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
  | 'success.thankYouPending'
  | 'success.orderNumber'
  | 'success.whatsNext'
  | 'success.confirmationEmail'
  | 'success.readyForPickup'
  | 'success.balanceDue'
  | 'success.paymentArranged'
  | 'success.loadingOrder'
  | 'success.contactUs'
  
  // About
  | 'about.title'
  | 'about.bio'
  
  // Admin
  | 'admin.orders'
  | 'admin.orderDetails'
  | 'admin.confirmDelivery'
  | 'admin.deliveryConfirmed'
  | 'admin.pendingConfirmation'
  | 'admin.login'
  | 'admin.password'
  | 'admin.loginRequired'
  
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
  
  // Variants
  | 'variant.smallPlain'
  | 'variant.smallBerries'
  | 'variant.largePlain'
  | 'variant.largeBerries'
  | 'variant.rolls6Pan'
  | 'variant.pan10'

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    // Navigation
    'nav.contact': 'contact',
    'nav.order': 'order',
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.menu': 'menu',
    
    // Cart
    'cart.shoppingCart': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total:',
    'cart.deposit': 'Amount to pay:',
    'cart.depositPercent': 'Total',
    'cart.remaining': 'Remaining (due at pickup):',
    'cart.remainingDue': 'Remaining (due at pickup)',
    'cart.checkout': 'Checkout',
    'cart.continueShopping': 'Continue Shopping',
    'cart.remove': 'Remove',
    'cart.each': 'each',
    'cart.qty': 'Qty:',
    
    // Menu
    'menu.loading': 'Loading menu...',
    'menu.selectOption': 'Select Option:',
    'menu.quantity': 'Quantity:',
    'menu.minimum': '(Minimum {min})',
    'menu.addToCart': 'Add to Cart',
    'menu.addedToCart': 'Added!',
    'menu.minimumOrder': 'Minimum order of {min} pieces required',
    'menu.deliveryNote': 'All orders will be delivered to you. We deliver orders between 6:30pm and 9:30pm daily. Local delivery (Christiana, Newark, southern Wilmington, New Castle, Bear) is free. Any delivery outside of New Castle county, Delaware will be an additional $15.',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.customerInfo': 'Customer Information',
    'checkout.fullName': 'Full Name *',
    'checkout.email': 'Email *',
    'checkout.phone': 'Phone Number *',
    'checkout.phoneNumber': 'Phone Number',
    'checkout.deliveryAddress': 'Delivery Address *',
    'checkout.deliveryLocation': 'Delivery Location *',
    'checkout.deliveryDate': 'Delivery Date *',
    'checkout.deliveryTime': 'Delivery Time *',
    'checkout.deliveryTimeWindow': 'We deliver between 6:30pm and 9:30pm daily.',
    'checkout.nextDayNote': 'Orders placed today are ready for delivery the following day.',
    'checkout.specialInstructions': 'Special Instructions',
    'checkout.placeholder.address': 'Street address, city, state, zip',
    'checkout.placeholder.specialInstructions': 'Gate code, building instructions, leave at door, etc.',
    'checkout.selectTime': 'Select a time',
    'checkout.orderSummary': 'Order Summary',
    'checkout.continueToPayment': 'Continue to Payment',
    'checkout.submitOrder': 'Submit Order',
    'checkout.confirmOrder': 'Confirm Order',
    'checkout.confirmOrderMessage': 'Please review your order details. Once you confirm, Nataly will receive your order and contact you to arrange payment and delivery.',
    'checkout.confirmOrderTotal': 'Order total:',
    'checkout.cancel': 'Cancel',
    'checkout.processing': 'Mixing the batter...',
    'checkout.completePayment': 'Complete Your Payment',
    'checkout.paymentDetails': 'Payment Details',
    'checkout.depositAmount': 'Amount to pay:',
    'checkout.payDeposit': 'Pay in full',
    'checkout.processingPayment': 'Processing Payment...',
    'checkout.loadingPaymentForm': 'Loading payment form...',
    'checkout.securePayment': 'Your payment is secure and encrypted. We never store your card details.',
    'checkout.depositNote': 'You will pay the full order total now.',
    'checkout.paymentArrangedNote': 'Payment will be arranged separately after order confirmation. Nataly will contact you.',
    
    // Contact
    'contact.getInTouch': 'Get in Touch',
    'contact.subtitle': 'Questions? Custom requests? Or just want to say hello...we want to hear from you!',
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
    'success.thankYou': 'Thank you for your order. We\'ve received your payment and will begin preparing your order.',
    'success.thankYouPending': 'Thank you for your order! We\'ve received it and Nataly will contact you shortly to arrange payment and confirm your delivery details.',
    'success.orderNumber': 'Order Number',
    'success.whatsNext': 'What\'s Next?',
    'success.confirmationEmail': 'You\'ll receive a confirmation email shortly with your order details.',
    'success.readyForPickup': 'We\'ll contact you when your order is ready.',
    'success.balanceDue': 'Your order has been paid in full.',
    'success.paymentArranged': 'Nataly will contact you to arrange payment and confirm delivery.',
    'success.loadingOrder': 'Loading order details...',
    'success.contactUs': 'Contact Us',
    
    // About
    'about.title': 'About Nataly',
    'about.bio': 'Nataly Hernandez, originally from Puebla, Mexico, grew up in a house of cooks. Since 2025, Nataly has been offering her homemade baked foods for the world to enjoy.',
    
    // Admin
    'admin.orders': 'Orders',
    'admin.orderDetails': 'Order Details',
    'admin.confirmDelivery': 'Confirm Delivery',
    'admin.deliveryConfirmed': 'Delivery Confirmed',
    'admin.pendingConfirmation': 'Pending Confirmation',
    'admin.login': 'Log In',
    'admin.password': 'Password',
    'admin.loginRequired': 'Admin login required',
    
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
    
    // Variants
    'variant.smallPlain': 'Small (6") - Plain',
    'variant.smallBerries': 'Small (6") - With Fresh Berry Garnish',
    'variant.largePlain': 'Large (10") - Plain',
    'variant.largeBerries': 'Large (10") - With Fresh Berry Garnish',
    'variant.rolls6Pan': '6 rolls/pan',
    'variant.pan10': '10" pan',
  },
  es: {
    // Navigation
    'nav.contact': 'contacto',
    'nav.order': 'Pedido',
    'nav.home': 'Inicio',
    'nav.shop': 'Tienda',
    'nav.menu': 'menú',
    
    // Cart
    'cart.shoppingCart': 'Carrito de Compras',
    'cart.empty': 'Tu carrito está vacío',
    'cart.total': 'Total:',
    'cart.deposit': 'Monto a pagar:',
    'cart.depositPercent': 'Total',
    'cart.remaining': 'Restante (pagar al recoger):',
    'cart.remainingDue': 'Restante (pagar al recoger)',
    'cart.checkout': 'Finalizar Compra',
    'cart.continueShopping': 'Seguir Comprando',
    'cart.remove': 'Eliminar',
    'cart.each': 'cada uno',
    'cart.qty': 'Cantidad:',
    
    // Menu
    'menu.loading': 'Cargando menú...',
    'menu.selectOption': 'Seleccionar Opción:',
    'menu.quantity': 'Cantidad:',
    'menu.minimum': '(Mínimo {min})',
    'menu.addToCart': 'Agregar al Carrito',
    'menu.addedToCart': '¡Agregado!',
    'menu.minimumOrder': 'Pedido mínimo de {min} piezas requerido',
    'menu.deliveryNote': 'Todos los pedidos serán entregados a domicilio. Entregamos entre 6:30pm y 9:30pm diariamente. La entrega local (Christiana, Newark, sur de Wilmington, New Castle, Bear) es gratis. Cualquier entrega fuera del condado de New Castle, Delaware tendrá un cargo adicional de $15.',
    
    // Checkout
    'checkout.title': 'Finalizar Compra',
    'checkout.customerInfo': 'Información del Cliente',
    'checkout.fullName': 'Nombre Completo *',
    'checkout.email': 'Correo Electrónico *',
    'checkout.phone': 'Número de Teléfono *',
    'checkout.phoneNumber': 'Número de Teléfono',
    'checkout.deliveryAddress': 'Dirección de Entrega *',
    'checkout.deliveryLocation': 'Ubicación de Entrega *',
    'checkout.deliveryDate': 'Fecha de Entrega *',
    'checkout.deliveryTime': 'Hora de Entrega *',
    'checkout.deliveryTimeWindow': 'Entregamos entre 6:30pm y 9:30pm diariamente.',
    'checkout.nextDayNote': 'Los pedidos de hoy están listos para entrega al día siguiente.',
    'checkout.specialInstructions': 'Instrucciones Especiales',
    'checkout.placeholder.address': 'Dirección, ciudad, estado, código postal',
    'checkout.placeholder.specialInstructions': 'Código de acceso, instrucciones del edificio, dejar en la puerta, etc.',
    'checkout.selectTime': 'Seleccionar hora',
    'checkout.orderSummary': 'Resumen del Pedido',
    'checkout.continueToPayment': 'Continuar al Pago',
    'checkout.submitOrder': 'Enviar Pedido',
    'checkout.confirmOrder': 'Confirmar Pedido',
    'checkout.confirmOrderMessage': 'Por favor revisa los detalles de tu pedido. Una vez que confirmes, Nataly recibirá tu pedido y te contactará para coordinar el pago y la entrega.',
    'checkout.confirmOrderTotal': 'Total del pedido:',
    'checkout.cancel': 'Cancelar',
    'checkout.processing': 'Batiendo la masa...',
    'checkout.completePayment': 'Completa Tu Pago',
    'checkout.paymentDetails': 'Detalles del Pago',
    'checkout.depositAmount': 'Monto a pagar:',
    'checkout.payDeposit': 'Pagar total',
    'checkout.processingPayment': 'Procesando Pago...',
    'checkout.loadingPaymentForm': 'Cargando formulario de pago...',
    'checkout.securePayment': 'Tu pago está seguro y encriptado. Nunca almacenamos los detalles de tu tarjeta.',
    'checkout.depositNote': 'Pagarás el total del pedido ahora.',
    'checkout.paymentArrangedNote': 'El pago se coordinará por separado después de la confirmación del pedido. Nataly te contactará.',
    
    // Contact
    'contact.getInTouch': 'Ponte en Contacto',
    'contact.subtitle': '¿Preguntas? ¿Pedidos personalizados? ¿O solo quieres saludar?... ¡Queremos saber de ti!',
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
    'success.thankYouPending': '¡Gracias por tu pedido! Lo hemos recibido y Nataly te contactará pronto para coordinar el pago y confirmar los detalles de entrega.',
    'success.thankYou': 'Gracias por tu pedido. Hemos recibido tu pago y comenzaremos a preparar tu pedido.',
    'success.orderNumber': 'Número de Pedido',
    'success.whatsNext': '¿Qué Sigue?',
    'success.confirmationEmail': 'Recibirás un correo electrónico de confirmación pronto con los detalles de tu pedido.',
    'success.readyForPickup': 'Te contactaremos cuando tu pedido esté listo.',
    'success.balanceDue': 'Tu pedido ha sido pagado en su totalidad.',
    'success.paymentArranged': 'Nataly te contactará para coordinar el pago y confirmar la entrega.',
    'success.loadingOrder': 'Cargando detalles del pedido...',
    'success.contactUs': 'Contáctanos',
    
    // About
    'about.title': 'Acerca de Nataly',
    'about.bio': 'Nataly Hernandez, originaria de Puebla, México, creció en una casa de cocineros. Desde 2025, Nataly ha estado ofreciendo sus alimentos horneados caseros para que el mundo disfrute.',
    
    // Admin
    'admin.orders': 'Pedidos',
    'admin.orderDetails': 'Detalles del Pedido',
    'admin.confirmDelivery': 'Confirmar Entrega',
    'admin.deliveryConfirmed': 'Entrega Confirmada',
    'admin.pendingConfirmation': 'Confirmación Pendiente',
    'admin.login': 'Iniciar Sesión',
    'admin.password': 'Contraseña',
    'admin.loginRequired': 'Inicio de sesión de administrador requerido',
    
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
    
    // Variants
    'variant.smallPlain': 'Pequeño (6") - Simple',
    'variant.smallBerries': 'Pequeño (6") - Con Frutos Rojos Frescos',
    'variant.largePlain': 'Grande (10") - Simple',
    'variant.largeBerries': 'Grande (10") - Con Frutos Rojos Frescos',
    'variant.rolls6Pan': '6 rollos/bandeja',
    'variant.pan10': 'Bandeja de 10"',
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
