"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";

export async function getPlants() {
  try {
    await requireSession();
    return await prisma.tbl_Plants.findMany({
      orderBy: { ID: "desc" },
    });
  } catch (error) {
    throw readError(error);
  }
}
