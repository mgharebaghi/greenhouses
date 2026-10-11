"use server";
import { requireSession } from "@/server/auth/require-session";
import type { SeedPackageDetails } from "../types/details";
import {
  getSeedPackageById as queryById,
  seedPackageInclude,
  serializeSeedPackage,
} from "./queries";

import { prisma } from "@/server/db/prisma";

export async function getAllSeedPackages(): Promise<SeedPackageDetails[]> {
  await requireSession();
  try {
    const seedPackages = await prisma.tbl_SeedPackage.findMany({
      include: seedPackageInclude,
      orderBy: {
        ID: "desc",
      },
    });

    return seedPackages.map(serializeSeedPackage);
  } catch (error) {
    console.error("Query failed", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}

export async function getSeedPackageById(id: number) {
  await requireSession();
  return queryById(id);
}
