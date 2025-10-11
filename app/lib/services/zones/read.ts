"use server";
import { prisma } from "@/app/lib/singletone";

export async function getgreenHouseZones(greenhouseId: number) {
  const zones = await prisma.zones.findMany({
    where: {
      GreenhouseID: greenhouseId,
    },
  });

  if (zones) {
    const changeDecimalstoNumber = zones.map((z) => ({
      ...z,
      AreaSqM: z.AreaSqM ? Number(z.AreaSqM) : null,
    }));

    return changeDecimalstoNumber;
  } else {
    return [];
  }
}
