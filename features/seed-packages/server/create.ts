"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput } from "@/shared/validation/input";
import { seedPackageInputSchema } from "../schema";
import { seedPackageExpiration } from "../domain/expiration";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function createSeedPackage(input: unknown) {
  try {
    await requireSession();
    const data = parseInput(seedPackageInputSchema, input);
    const seedPackage = await prisma.tbl_SeedPackage.create({
      data: {
        SupplierID: data.SupplierID,
        ProducerCompany: data.ProducerCompany,
        CropVariety: data.CropVariety,
        GerminationRate: data.GerminationRate,
        PurityPercent: data.PurityPercent,
        PackageNumber: data.PackageNumber,
        ProductionDate: data.ProductionDate,
        ExpirationDate: seedPackageExpiration(
          data.ProductionDate,
          data.ProductionCalendar,
        ),
        QualityGrade: data.QualityGrade,
        SerialNumber: data.SerialNumber,
        PackageType: data.PackageType,
        SeedCount: data.SeedCount,
        WeightGram: data.WeightGram,
        PackagingDate: data.PackagingDate,
        IsCertified: data.IsCertified,
      },
    });

    revalidatePath("/dashboard/seed-package");
    return {
      status: "ok",
      message: "بسته بذر با موفقیت ثبت شد",
      seedPackageId: seedPackage.ID,
    };
  } catch (error) {
    return actionError(error);
  }
}
