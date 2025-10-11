"use server";
import { prisma } from "@/app/lib/singletone";

export async function getPlantVarieties() {
  const data = await prisma.plantVarities.findMany({
    include: { Plants: true },
    orderBy: { VarietyID: "desc" },
  });

  const formatDecimals = data.map((item) => ({
    ...item,
    TypicalYieldKgPerM2: item.TypicalYieldKgPerM2?.toNumber() || null,
    IdealTempMin: item.IdealTempMin?.toNumber() || null,
    IdealTempMax: item.IdealTempMax?.toNumber() || null,
    IdealHumidityMin: item.IdealHumidityMin?.toNumber() || null,
    IdealHumidityMax: item.IdealHumidityMax?.toNumber() || null,
  }));

  return formatDecimals;
}
