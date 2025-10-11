"use server";

import { prisma } from "../../singletone";

export async function deleteZones(id: number) {
  await prisma.zones.deleteMany({
    where: {
      GreenhouseID: id,
    },
  });
}

export async function deleteZone(ZoneID: number) {
  await prisma.zones.delete({
    where: {
      ZoneID: ZoneID,
    },
  });
}
