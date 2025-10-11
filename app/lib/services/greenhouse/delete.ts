"use server";

import { prisma } from "@/app/lib/singletone";
import { deleteZones } from "../zones/delete";

export async function deleteGreenHouse(id: number) {
  await deleteZones(id);

  await prisma.greenhouses.delete({
    where: { GreenhouseID: id },
  });
}
