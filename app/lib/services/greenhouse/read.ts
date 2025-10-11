"use server";

import { Greenhouses } from "@/app/generated/prisma";
import { prisma } from "../../singletone";

export async function allGreenHouses(): Promise<Greenhouses[]> {
  const rows = await prisma.greenhouses.findMany({
    include: { Owner_Observer: { select: { FirstName: true, LastName: true } }, Zones: true },
    orderBy: { GreenhouseID: "desc" },
  });

  const plain = rows.map((g) => ({
    ...g,
    Zones: g.Zones.map((z) => ({
      ...z,
      AreaSqM: z.AreaSqM ? z.AreaSqM.toNumber() : null, // یا .toString()
    })),
  }));

  return plain;
}
