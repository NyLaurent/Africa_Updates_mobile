import { PrismaClient } from "@prisma/client";

// Use the same database connection as the web app
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://neondb_owner:npg_8Dby7CrnIKPX@ep-plain-darkness-a22pbk2t-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
      },
    },
  });
};

// Prevent multiple instances in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma; 