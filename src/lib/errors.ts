/**
 * Custom error classes for server-side operations
 */

export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class PaymentError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'PaymentError'
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class EmailError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'EmailError'
  }
}

/**
 * Standardized error response formatter
 */
export function formatErrorResponse(error: unknown, defaultMessage = 'An error occurred') {
  if (error instanceof ValidationError) {
    return {
      error: 'Validation failed',
      message: error.message,
      details: error.details,
    }
  }

  if (error instanceof PaymentError) {
    return {
      error: 'Payment processing failed',
      message: error.message,
      code: error.code,
    }
  }

  if (error instanceof DatabaseError) {
    return {
      error: 'Database operation failed',
      message: error.message,
    }
  }

  if (error instanceof EmailError) {
    return {
      error: 'Email sending failed',
      message: error.message,
    }
  }

  if (error instanceof Error) {
    return {
      error: defaultMessage,
      message: error.message,
    }
  }

  return {
    error: defaultMessage,
    message: 'Unknown error occurred',
  }
}
