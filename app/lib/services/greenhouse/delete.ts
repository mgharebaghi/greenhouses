"use server";

import { prisma } from "@/app/lib/singletone";
// import { deleteZones } from "../zones/delete";

export type GreenHouseDeleteResponse = {
  status: "ok" | "error";
  message: string;
};

export async function deleteGreenHouse(id: number) {
  try {
    // await deleteZones(id); // Module deleted

    await prisma.tbl_Greenhouses.delete({
      where: { ID: id },
    });
    return { status: "ok", message: "عملیات با موفقیت انجام شد." };
  } catch (error) {
    return { status: "error", message: "از زاین گلخانه در داده های دیگری استفاده شده است." };
  }
}
