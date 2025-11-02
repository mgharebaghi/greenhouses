"use server";

import { prisma } from "@/app/lib/singletone";
import { deleteZones } from "../zones/delete";

export type GreenHouseDeleteResponse = {
  status: "ok" | "error";
  message: string;
};

export async function deleteGreenHouse(id: number) {
  try {
    await deleteZones(id);

    await prisma.greenhouses.delete({
      where: { GreenhouseID: id },
    });
    return { status: "ok", message: "عملیات با موفقیت انجام شد." };
  } catch (error) {
    return { status: "error", message: "از زاین گلخانه در داده های دیگری استفاده شده است." };
  }
}
