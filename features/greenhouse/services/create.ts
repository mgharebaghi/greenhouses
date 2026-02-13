"use server";
import { prisma } from "@/lib/singletone";
import { GreenHouseCreateRes } from "../types";
import { createGreenHouseSchema } from "../schema";
import { z } from "zod";

export async function createGreenHouse(data: z.infer<typeof createGreenHouseSchema>): Promise<GreenHouseCreateRes> {
  const result = createGreenHouseSchema.safeParse(data);
  if (!result.success) {
    return { status: "error", message: result.error.message };
  }

  const greenHouse = await prisma.tbl_Greenhouses.findFirst({
    where: { GreenhouseName: data.GreenhouseName },
  });

  if (greenHouse) {
    return { status: "error", message: "گلخانه‌ای با این نام قبلا ثبت شده است!" };
  }

  const newGreenHouse = await prisma.tbl_Greenhouses.create({
    data: {
      GreenhouseName: data.GreenhouseName,
      OwnerID: data.OwnerID,
      GreenhouseAddress: data.GreenhouseAddress,
      Notes: data.Notes,
      GreenhouseType: data.GreenhouseType,
      AreaSqM: data.AreaSqM,
      ConstructionDate: data.ConstructionDate,
      IsActive: data.IsActive ?? true,
    },
  });

  if (!newGreenHouse) {
    return { status: "error", message: "خطایی در ثبت گلخانه رخ داد، لطفا مجددا تلاش کنید." };
  }

  return { status: "ok", message: "گلخانه جدید با موفقیت ایجاد شد!", greenHouseId: newGreenHouse.ID };
}
