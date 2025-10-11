"use server";
import { prisma } from "@/app/lib/singletone";
import { Decimal } from "@prisma/client/runtime/library";

export async function updateZone(params: { ZoneID: number; Name: string; AreaSqM: number }) {
  const { ZoneID, Name, AreaSqM } = params;
  const result = await prisma.zones.update({
    where: { ZoneID },
    data: { Name, AreaSqM: new Decimal(AreaSqM) },
  });

  if (result) {
    return "ok";
  } else {
    return null;
  }
}
