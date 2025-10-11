"use server";
import { prisma } from "@/app/lib/singletone";

export async function getGrowthDaily() {
  const growthStages = await prisma.plantingGrowthDaily.findMany({
    orderBy: {
      PlantGrowthDailyID: "desc",
    },
    take: 100,
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      PlantGrowthStages: { select: { StageID: true, StageName: true } },
      Plantings: { select: { VarietyID: true, PlantVarieties: { select: { VarietyName: true } } } },
    },
  });

  const castedDecimals = growthStages.map((item) => {
    return {
      ...item,
      Owner_Observer: item.Owner_Observer
        ? {
            ...item.Owner_Observer,
            FullName: `${item.Owner_Observer.FirstName} ${item.Owner_Observer.LastName}`,
          }
        : null,
      RecordDate: item.RecordDate ? item.RecordDate.toISOString().split("T")[0] : null,
      HeightCm: item.HeightCm ? Number(item.HeightCm) : null,
      HealthScore: item.HealthScore ? Number(item.HealthScore) : null,
    };
  });

  return castedDecimals;
}

export async function getGrowthingByGreenHouseId(greenHouseId: number) {
  const growthStages = await prisma.plantingGrowthDaily.findMany({
    where: {
      Plantings: { GreenhouseID: greenHouseId },
    },
    take: 100,
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      PlantGrowthStages: { select: { StageID: true, StageName: true } },
      Plantings: { select: { VarietyID: true, PlantVarieties: { select: { VarietyName: true } } } },
    },
    orderBy: { PlantGrowthDailyID: "desc" },
  });

  const castedDecimals = growthStages.map((item) => {
    return {
      ...item,
      Owner_Observer: item.Owner_Observer
        ? {
            ...item.Owner_Observer,
            FullName: `${item.Owner_Observer.FirstName} ${item.Owner_Observer.LastName}`,
          }
        : null,
      RecordDate: item.RecordDate ? item.RecordDate.toISOString().split("T")[0] : null,
      HeightCm: item.HeightCm ? Number(item.HeightCm) : null,
      HealthScore: item.HealthScore ? Number(item.HealthScore) : null,
    };
  });

  return castedDecimals;
}

export async function getGrowthingByZoneId(zoneId: number) {
  const growthStages = await prisma.plantingGrowthDaily.findMany({
    where: {
      Plantings: { ZoneID: zoneId },
    },
    take: 100,
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      PlantGrowthStages: { select: { StageID: true, StageName: true } },
      Plantings: { select: { VarietyID: true, PlantVarieties: { select: { VarietyName: true } } } },
    },
    orderBy: { PlantGrowthDailyID: "desc" },
  });

  const castedDecimals = growthStages.map((item) => {
    return {
      ...item,
      Owner_Observer: item.Owner_Observer
        ? {
            ...item.Owner_Observer,
            FullName: `${item.Owner_Observer.FirstName} ${item.Owner_Observer.LastName}`,
          }
        : null,
      RecordDate: item.RecordDate ? item.RecordDate.toISOString().split("T")[0] : null,
      HeightCm: item.HeightCm ? Number(item.HeightCm) : null,
      HealthScore: item.HealthScore ? Number(item.HealthScore) : null,
    };
  });

  return castedDecimals;
}

export async function getGrowthDailyByPlantingId(plantingId: number) {
  const growthStages = await prisma.plantingGrowthDaily.findMany({
    where: {
      PlantingID: plantingId,
    },
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      PlantGrowthStages: { select: { StageID: true, StageName: true } },
      Plantings: { select: { VarietyID: true, PlantVarieties: { select: { VarietyName: true } } } },
    },
    orderBy: { PlantGrowthDailyID: "desc" },
  });

  const castedDecimals = growthStages.map((item) => {
    return {
      ...item,
      Owner_Observer: item.Owner_Observer
        ? {
            ...item.Owner_Observer,
            FullName: `${item.Owner_Observer.FirstName} ${item.Owner_Observer.LastName}`,
          }
        : null,
      RecordDate: item.RecordDate ? item.RecordDate.toISOString().split("T")[0] : null,
      HeightCm: item.HeightCm ? Number(item.HeightCm) : null,
      HealthScore: item.HealthScore ? Number(item.HealthScore) : null,
    };
  });

  return castedDecimals;
}
