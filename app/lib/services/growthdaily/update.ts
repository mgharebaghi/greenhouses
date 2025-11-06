"use server";
import { prisma } from "@/app/lib/singletone";

export async function updateGrowthDaily(id: number, data: any) {
  // جدا کردن فیلدهای relation از بقیه فیلدها
  const { ObserverID, SampleID, StageID, PlantingID, ...restData } = data;

  const updated = await prisma.plantingGrowthDaily.update({
    where: { PlantGrowthDailyID: id },
    data: {
      ...restData,
      // استفاده از connect برای روابط
      ...(ObserverID && {
        Owner_Observer: {
          connect: { ID: ObserverID },
        },
      }),
      ...(SampleID && {
        PlantingSamples: {
          connect: { ID: SampleID },
        },
      }),
      ...(StageID && {
        PlantGrowthStages: {
          connect: { StageID: StageID },
        },
      }),
    },
  });

  if (updated) {
    return true;
  } else {
    return false;
  }
}
