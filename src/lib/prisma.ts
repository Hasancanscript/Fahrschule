import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Bump after a schema migration so Fast Refresh cannot reuse an obsolete client.
const schemaVersion = "20261009120000_customer_notifications";
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaVersion: string | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

const cachedClient = globalForPrisma.prismaSchemaVersion === schemaVersion
  ? globalForPrisma.prisma
  : undefined;

export const prisma = cachedClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  const previousClient = globalForPrisma.prisma;
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaVersion = schemaVersion;
  if (previousClient && previousClient !== prisma) {
    void previousClient.$disconnect().catch(() => {});
  }
}

