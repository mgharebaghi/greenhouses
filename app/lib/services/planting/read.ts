"use server";
import { prisma } from "@/app/lib/singletone";

export async function getAllPlantings() {
  // 1) گرفتن کاشت‌ها
  const plantings = await prisma.plantings.findMany({
    include: {
      Zones: { select: { ZoneID: true, Name: true } },
      PlantVarieties: { select: { VarietyID: true, VarietyName: true } },
    },
    orderBy: { PlantingID: "desc" },
  });

  // توجه به نام فیلد: در بعضی اسکیماها GreenHouseID با H بزرگ است.
  const ghIds = Array.from(
    new Set(
      plantings
        .map((p: any) => p.GreenHouseID ?? p.GreenhouseID) // هر دو حالت را پوشش می‌دهیم
        .filter((x: any) => x != null)
    )
  ) as number[];

  // 2) گرفتن نام گلخانه‌ها
  const greenhouses = await prisma.greenhouses.findMany({
    where: { GreenhouseID: { in: ghIds } },
    select: { GreenhouseID: true, GreenhouseName: true },
  });

  const ghMap = new Map(greenhouses.map((g) => [g.GreenhouseID, g.GreenhouseName]));

  // 3) جوین در حافظه + کست تاریخ‌ها/Decimal
  const casted = plantings.map((item: any) => {
    const ghId = item.GreenHouseID ?? item.GreenhouseID;
    const greenhouseName = ghMap.get(ghId) ?? null;

    return {
      ...item,
      GreenhouseName: greenhouseName, // ← برای نمایش ساده در جدول
      PlantsPerM2: item.PlantsPerM2 ? Number(item.PlantsPerM2) : null,
      PlantDate: item.PlantDate ? item.PlantDate.toISOString().split("T")[0] : null,
      ExpectedHarvestDate: item.ExpectedHarvestDate ? item.ExpectedHarvestDate.toISOString().split("T")[0] : null,
      ActualHarvestDate: item.ActualHarvestDate ? item.ActualHarvestDate.toISOString().split("T")[0] : null,
      TransplantDate: item.TransplantDate ? item.TransplantDate.toISOString().split("T")[0] : null,
    };
  });

  return casted;
}

export async function getPlantingByZoneId(zoneId: number) {
  const data = await prisma.plantings.findMany({
    where: { ZoneID: zoneId },
    select: { PlantingID: true },
  });

  return data;
}

export async function getPlantingById(plantingId: number) {
  const data = await prisma.plantings.findUnique({
    where: { PlantingID: plantingId },
  });

  if (!data) return null;

  const casted = {
    ...data,
    PlantsPerM2: data.PlantsPerM2 ? Number(data.PlantsPerM2) : null,
    PlantDate: data.PlantDate ? data.PlantDate.toISOString().split("T")[0] : null,
    ExpectedHarvestDate: data.ExpectedHarvestDate ? data.ExpectedHarvestDate.toISOString().split("T")[0] : null,
    ActualHarvestDate: data.ActualHarvestDate ? data.ActualHarvestDate.toISOString().split("T")[0] : null,
    TransplantDate: data.TransplantDate ? data.TransplantDate.toISOString().split("T")[0] : null,
  };

  return casted;
}
