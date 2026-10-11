import type { Prisma } from "@/app/generated/prisma";
import "server-only";
import type { SeedPackageDetails } from "../types/details";
export const seedPackageInclude = {
  Tbl_suppliers: {
    select: {
      CompanyName: true,
      FirstName: true,
      LastName: true,
      Legal: true,
    },
  },
  Tbl_plantVariety: {
    select: {
      VarietyName: true,
      Tbl_Plants: {
        select: {
          CommonName: true,
        },
      },
    },
  },
} satisfies Prisma.Tbl_SeedPackageInclude;
type QueryRecord = Prisma.Tbl_SeedPackageGetPayload<{
  include: typeof seedPackageInclude;
}>;

import { prisma } from "@/server/db/prisma";
function serializeSeedPackage(pkg: QueryRecord): SeedPackageDetails {
  return {
    ...pkg,
    WeightGram: pkg.WeightGram == null ? null : Number(pkg.WeightGram),
    // The dates are automatically handled by Next.js SC/CC boundary if they are simple iso strings on JSON.stringify,
    // but prisma returns Date objects. Next.js serialization should handle it fine, or use .toISOString() if needed.
  };
}
export async function getSeedPackageById(
  id: number,
): Promise<SeedPackageDetails | null> {
  if (!Number.isInteger(id) || id < 1) return null;

  try {
    const pkg = await prisma.tbl_SeedPackage.findUnique({
      where: { ID: id },
      include: seedPackageInclude,
    });

    if (!pkg) return null;

    return serializeSeedPackage(pkg);
  } catch (error) {
    console.error("Error fetching seed package by id:", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}

export { serializeSeedPackage };
