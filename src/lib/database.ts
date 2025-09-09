import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create or reuse Prisma client instance
const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// In development, store the instance globally to prevent multiple clients
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

// Export types for use in other files
export type * from '@prisma/client';
