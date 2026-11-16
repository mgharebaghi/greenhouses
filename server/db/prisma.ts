import { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import generatedClient from "@/app/generated/prisma/package.json";
import "server-only";

const globalForPrisma = globalThis as typeof globalThis & {
  greenhousePrisma?: { generation: string; client: PrismaClient };
};
const isDevelopment = process.env.NODE_ENV !== "production";
// Prisma generates a package name containing the schema hash.
const generation = `${generatedClient.name}:${Prisma.prismaVersion.client}`;
const cached = isDevelopment ? globalForPrisma.greenhousePrisma : undefined;

export const prisma =
  cached?.generation === generation ? cached.client : new PrismaClient();

if (isDevelopment)
  globalForPrisma.greenhousePrisma = { generation, client: prisma };
