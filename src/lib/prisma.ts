import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're in build mode - during build, we should never create a Prisma client
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.NEXT_PHASE === 'phase-production-compile' ||
  (typeof process.env.NEXT_RUNTIME === 'undefined' && !process.env.DATABASE_URL && process.env.NODE_ENV !== 'development')

let prismaInstance: PrismaClient | null = null

function getPrismaClient(): PrismaClient {
  // During build time, throw an error that Next.js can handle
  // This prevents Prisma from trying to connect during build
  if (isBuildTime) {
    // Create a mock object that throws a helpful error when accessed
    // This prevents build errors but makes it clear what's happening
    throw new Error(
      'Prisma Client cannot be used during build time. Database operations will be available at runtime.'
    )
  }

  // Reuse existing instance
  if (prismaInstance) {
    return prismaInstance
  }

  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma
    return prismaInstance
  }

  // Check if DATABASE_URL is available at runtime
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Please configure your database connection string in environment variables.'
    )
  }

  prismaInstance = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  // Store in global to reuse in development
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
  }

  return prismaInstance
}

// Create a Proxy that defers initialization until runtime
// During build, this will throw an error that Next.js will ignore for API routes
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    try {
      const client = getPrismaClient()
      const value = (client as any)[prop]
      if (typeof value === 'function') {
        return value.bind(client)
      }
      return value
    } catch (error) {
      // During build time, return a no-op function to prevent build errors
      // The actual error will occur at runtime if DATABASE_URL is not set
      if (isBuildTime) {
        // Return a function that throws a helpful runtime error
        return () => {
          throw new Error(
            'Database connection not available. Please ensure DATABASE_URL is configured in your environment variables.'
          )
        }
      }
      throw error
    }
  },
})
