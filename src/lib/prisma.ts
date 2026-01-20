import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're in build mode
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                    (typeof process.env.NEXT_RUNTIME === 'undefined' && process.env.NODE_ENV === 'production')

function getPrismaClient(): PrismaClient {
  // Reuse existing instance
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // During build time, don't try to connect
  if (isBuildTime) {
    // Return a dummy client that will fail gracefully at runtime if accessed
    // This prevents build errors but ensures runtime errors if DB is not configured
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://dummy:dummy@dummy:5432/dummy',
        },
      },
      log: [],
    }) as PrismaClient
  }

  // Check if DATABASE_URL is available at runtime
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Please configure your database connection string in environment variables.'
    )
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  // Store in global to reuse in development
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

// Lazy initialization - only creates client when first accessed
export const prisma: PrismaClient = (() => {
  // Use Proxy to defer initialization until first property access
  return new Proxy({} as PrismaClient, {
    get(_target, prop: string | symbol) {
      const client = getPrismaClient()
      const value = (client as any)[prop]
      if (typeof value === 'function') {
        return value.bind(client)
      }
      return value
    },
  })
})()
