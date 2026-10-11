import type { Prisma } from "@/app/generated/prisma";
import "server-only";
import { prisma } from "./prisma";

/** Retry serialization conflicts only; other failures roll back and propagate. */
export async function serializableTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: "Serializable",
      });
    } catch (error) {
      const conflict =
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2034";
      if (!conflict || attempt >= 2) throw error;
    }
  }
}
