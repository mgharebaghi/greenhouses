"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { seedPackageInputSchema } from "../schema";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";

export async function updateSeedPackage(id: number, input: unknown) {
  try {
    await requireSession();
    const data = parseInput(seedPackageInputSchema, input);
    parseInput(recordIdSchema, id);
    await prisma.tbl_SeedPackage.update({
      where: { ID: id },
      data: {
        SupplierID: data.SupplierID,
        ProducerCompany: data.ProducerCompany,
        CropVariety: data.CropVariety,
        GerminationRate: data.GerminationRate,
        PurityPercent: data.PurityPercent,
        PackageNumber: data.PackageNumber,
        ProductionDate: data.ProductionDate
          ? new Date(data.ProductionDate)
          : undefined,
        ExpirationDate: data.ExpirationDate
          ? new Date(data.ExpirationDate)
          : undefined,
        QualityGrade: data.QualityGrade,
        SerialNumber: data.SerialNumber,
        PackageType: data.PackageType,
        SeedCount: data.SeedCount,
        WeightGram: data.WeightGram,
        PackagingDate: data.PackagingDate
          ? new Date(data.PackagingDate)
          : undefined,
        IsCertified: data.IsCertified,
      },
    });

    revalidatePath("/dashboard/seed-package");
    return { status: "ok", message: "اطلاعات بسته بذر با موفقیت ویرایش شد" };
  } catch (error) {
    return actionError(error);
  }
}
