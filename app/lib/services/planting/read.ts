"use server";
import { prisma } from "@/app/lib/singletone";

export async function getAllPlantings() {
  const data = await prisma.plantings.findMany({
    include: {
      Zones: {
        select: { ZoneID: true, Name: true, GreenhouseID: true, Greenhouses: { select: { GreenhouseName: true } } },
      },
      PlantVarieties: { select: { VarietyID: true, VarietyName: true } },
    },
    orderBy: { PlantingID: "desc" },
  });

  const castDates = data.map((item) => ({
    ...item,
    PlantsPerM2: item.PlantsPerM2 ? Number(item.PlantsPerM2) : null,
    PlantDate: item.PlantDate ? item.PlantDate.toISOString().split("T")[0] : null,
    ExpectedHarvestDate: item.ExpectedHarvestDate ? item.ExpectedHarvestDate.toISOString().split("T")[0] : null,
    ActualHarvestDate: item.ActualHarvestDate ? item.ActualHarvestDate.toISOString().split("T")[0] : null,
    TransplantDate: item.TransplantDate ? item.TransplantDate.toISOString().split("T")[0] : null,
  }));

  return castDates;
}

export async function getPlantingByZoneId(zoneId: number) {
  const data = await prisma.plantings.findMany({
    where: { ZoneID: zoneId },
    select: { PlantingID: true },
  });

  return data;
}
