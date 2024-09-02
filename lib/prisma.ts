import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Extend Prisma Client with Accelerate
const prisma = new PrismaClient({ log: ['error'] }).$extends(withAccelerate());

export default prisma;
export { PrismaClient };
