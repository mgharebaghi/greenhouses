"use server";
import { prisma } from "@/app/lib/singletone";

// تابع helper برای تبدیل Decimal ها
function convertGrowthDailyDecimals(item: any) {
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
    PlantingSamples: item.PlantingSamples
      ? {
          ...item.PlantingSamples,
          Plantings: item.PlantingSamples.Plantings
            ? {
                ...item.PlantingSamples.Plantings,
                PlantsPerM2: item.PlantingSamples.Plantings.PlantsPerM2
                  ? Number(item.PlantingSamples.Plantings.PlantsPerM2)
                  : null,
              }
            : null,
        }
      : null,
  };
}

export async function getGrowthDaily() {
  const growthStages = await prisma.plantingGrowthDaily.findMany({
    orderBy: {
      PlantGrowthDailyID: "desc",
    },
    take: 100,
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      PlantGrowthStages: { select: { StageID: true, StageName: true } },
      PlantingSamples: {
        include: {
          Plantings: {
            include: {
              PlantVarieties: { select: { VarietyName: true } },
            },
          },
        },
      },
    },
  });

  return growthStages.map(convertGrowthDailyDecimals);
}

export async function getGrowthingByGreenHouseId(greenHouseId: number) {
  const growthStages = await prisma.plantingGrowthDaily.findMany({
    where: {
      PlantingSamples: { Plantings: { GreenhouseID: greenHouseId } },
    },
    take: 100,
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      PlantGrowthStages: { select: { StageID: true, StageName: true } },
      PlantingSamples: {
        include: {
          Plantings: {
            include: {
              PlantVarieties: { select: { VarietyName: true } },
            },
          },
        },
      },
    },
    orderBy: { PlantGrowthDailyID: "desc" },
  });

  return growthStages.map(convertGrowthDailyDecimals);
}

export async function getGrowthingByZoneId(zoneId: number) {
  const growthStages = await prisma.plantingGrowthDaily.findMany({
    where: {
      PlantingSamples: { Plantings: { Zones: { ZoneID: zoneId } } },
    },
    take: 100,
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      PlantGrowthStages: { select: { StageID: true, StageName: true } },
      PlantingSamples: {
        include: {
          Plantings: {
            include: {
              PlantVarieties: { select: { VarietyName: true } },
            },
          },
        },
      },
    },
    orderBy: { PlantGrowthDailyID: "desc" },
  });

  return growthStages.map(convertGrowthDailyDecimals);
}

export async function getGrowthDailyByPlantingId(plantingId: number) {
  const growthStages = await prisma.plantingGrowthDaily.findMany({
    where: {
      PlantingSamples: { Plantings: { PlantingID: plantingId } },
    },
    include: {
      Owner_Observer: { select: { ID: true, FirstName: true, LastName: true } },
      PlantGrowthStages: { select: { StageID: true, StageName: true } },
      PlantingSamples: {
        include: {
          Plantings: {
            include: {
              PlantVarieties: { select: { VarietyName: true } },
            },
          },
        },
      },
    },
    orderBy: { PlantGrowthDailyID: "desc" },
  });

  return growthStages.map(convertGrowthDailyDecimals);
}
