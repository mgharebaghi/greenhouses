"use server";
import { prisma } from "@/lib/singletone";

export async function getPlantVarieties() {
  const data = await prisma.tbl_PlantVariety.findMany({
    include: { Tbl_Plants: true },
    orderBy: { ID: "desc" },
  });

  const formatDecimals = data.map((item) => ({
    ...item,
    IdealTempMin: item.IdealTempMin?.toNumber() || null,
    IdealTempMax: item.IdealTempMax?.toNumber() || null,
    IdealHumidityMin: item.IdealHumidityMin?.toNumber() || null,
    IdealHumidityMax: item.IdealHumidityMax?.toNumber() || null,
  }));

  return formatDecimals;
}
