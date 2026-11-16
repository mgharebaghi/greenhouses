"use server";
import { actionError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { parseInput, recordIdSchema } from "@/shared/validation/input";
import { seedPackageInputSchema } from "../schema";
import { seedPackageExpiration } from "../domain/expiration";

import { serializableTransaction } from "@/server/db/transaction";
import { revalidatePath } from "next/cache";

export async function updateSeedPackage(id: number, input: unknown) {
  try {
    await requireSession();
    const data = parseInput(seedPackageInputSchema, input);
    const recordId = parseInput(recordIdSchema, id);
    await serializableTransaction(async (tx) => {
      let expiration: Date | null | undefined;
      if (data.ProductionDate !== undefined) {
        const saved = await tx.tbl_SeedPackage.findUniqueOrThrow({
          where: { ID: recordId },
          select: { ProductionDate: true, ExpirationDate: true },
        });
        if (
          !saved.ExpirationDate ||
          saved.ProductionDate?.getTime() !== data.ProductionDate?.getTime()
        ) {
          expiration = seedPackageExpiration(
            data.ProductionDate,
            data.ProductionCalendar,
          );
        }
      }
      return tx.tbl_SeedPackage.update({
        where: { ID: recordId },
        data: {
          SupplierID: data.SupplierID,
          ProducerCompany: data.ProducerCompany,
          CropVariety: data.CropVariety,
          GerminationRate: data.GerminationRate,
          PurityPercent: data.PurityPercent,
          PackageNumber: data.PackageNumber,
          ProductionDate: data.ProductionDate,
          ExpirationDate: expiration,
          QualityGrade: data.QualityGrade,
          SerialNumber: data.SerialNumber,
          PackageType: data.PackageType,
          SeedCount: data.SeedCount,
          WeightGram: data.WeightGram,
          PackagingDate: data.PackagingDate,
          IsCertified: data.IsCertified,
        },
      });
    });

    revalidatePath("/dashboard/seed-package");
    return { status: "ok", message: "اطلاعات بسته بذر با موفقیت ویرایش شد" };
  } catch (error) {
    return actionError(error);
  }
}
