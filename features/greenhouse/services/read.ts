"use server";

import { Tbl_Greenhouses } from "@/app/generated/prisma";
import { prisma } from "@/lib/singletone";

export async function allGreenHouses(): Promise<any[]> {
  const rows = await prisma.tbl_Greenhouses.findMany({
    include: { Tbl_People: { select: { FirstName: true, LastName: true } } },
    orderBy: { ID: "desc" },
  });

  const plain = rows.map((g) => ({
    ...g,
    AreaSqM: g.AreaSqM ? Number(g.AreaSqM.toString()) : null,
    ConstructionDate: g.ConstructionDate ? g.ConstructionDate.toISOString() : null,
  }));

  return plain;
}
