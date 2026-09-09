/**
 * Prisma Client Singleton
 * =============================================================================
 * Ensures a single PrismaClient instance is used across the application.
 * Handles connection pooling and prevents connection exhaustion in development.
 */

import { PrismaClient } from '@prisma/client';

// Declare global type for the Prisma client singleton
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Create Prisma client with logging configuration
 */
function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

  return client;
}

/**
 * Get the Prisma client singleton instance
 * In development, stores the client on globalThis to survive HMR
 */
export function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    return createPrismaClient();
  }

  // In development, use a global variable to preserve client across HMR
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }

  return global.__prisma;
}

/**
 * Default Prisma client instance
 */
export const prisma = getPrismaClient();

/**
 * Gracefully disconnect from the database
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
  if (global.__prisma) {
    global.__prisma = undefined;
  }
}

/**
 * Health check - verify database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export type { PrismaClient };
