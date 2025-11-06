"use server";
import { prisma } from "@/app/lib/singletone";

export async function createGrowthDaily(data: any) {
  // جدا کردن فیلدهای relation از بقیه فیلدها
  const { ObserverID, SampleID, StageID, PlantingID, ...restData } = data;

  const inserting = await prisma.plantingGrowthDaily.create({
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

  if (inserting) {
    return true;
  } else {
    return false;
  }
}
