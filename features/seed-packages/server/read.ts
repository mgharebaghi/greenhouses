"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import type { SeedPackageDetails } from "../types/details";
import { optionalDate, parseInput } from "@/shared/validation/input";
import { z } from "zod";
import { seedPackageExpiration } from "../domain/expiration";
import { productionCalendarSchema } from "../schema";
import {
  getSeedPackageById as queryById,
  seedPackageInclude,
  serializeSeedPackage,
} from "./queries";

import { prisma } from "@/server/db/prisma";

export async function getAllSeedPackages(): Promise<SeedPackageDetails[]> {
  try {
    await requireSession();
    const seedPackages = await prisma.tbl_SeedPackage.findMany({
      include: seedPackageInclude,
      orderBy: {
        ID: "desc",
      },
    });

    return seedPackages.map(serializeSeedPackage);
  } catch (error) {
    throw readError(error);
  }
}

export async function getSeedPackageById(id: number) {
  try {
    await requireSession();
    return queryById(id);
  } catch (error) {
    throw readError(error);
  }
}

export async function getSeedPackageExpiration(input: unknown) {
  await requireSession();
  const { ProductionDate, ProductionCalendar } = parseInput(
    z.object({
      ProductionDate: optionalDate,
      ProductionCalendar: productionCalendarSchema,
    }),
    input,
  );
  return (
    seedPackageExpiration(ProductionDate, ProductionCalendar)
      ?.toISOString()
      .slice(0, 10) ?? null
  );
}
