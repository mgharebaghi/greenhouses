"use server";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";

export async function getPlantVarieties() {
  await requireSession();
  const data = await prisma.tbl_PlantVariety.findMany({
    include: { Tbl_Plants: true },
    orderBy: { ID: "desc" },
  });

  const formatDecimals = data.map((item) => ({
    ...item,
    IdealTempMin: item.IdealTempMin?.toNumber() ?? null,
    IdealTempMax: item.IdealTempMax?.toNumber() ?? null,
    IdealHumidityMin: item.IdealHumidityMin?.toNumber() ?? null,
    IdealHumidityMax: item.IdealHumidityMax?.toNumber() ?? null,
  }));

  return formatDecimals;
}
