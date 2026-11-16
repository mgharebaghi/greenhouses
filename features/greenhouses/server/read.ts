"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";

export async function getGreenhouses() {
  try {
    await requireSession();
    const rows = await prisma.tbl_Greenhouses.findMany({
      include: { Tbl_People: { select: { FirstName: true, LastName: true } } },
      orderBy: { ID: "desc" },
    });

    const plain = rows.map((g) => ({
      ...g,
      AreaSqM: g.AreaSqM ? Number(g.AreaSqM.toString()) : null,
      ConstructionDate: g.ConstructionDate
        ? g.ConstructionDate.toISOString()
        : null,
    }));

    return plain;
  } catch (error) {
    throw readError(error);
  }
}
