"use server";
import { prisma } from "@/app/lib/singletone";
import { GreenHouseCreateRes } from "./types";
import { Tbl_Greenhouses } from "@/app/generated/prisma/client";

export async function createGreenHouse(data: Tbl_Greenhouses): Promise<GreenHouseCreateRes> {
  if (!data.GreenhouseName || !data.OwnerID || !data.GreenhouseAddress) {
    return { status: "error", message: "فیلدهای نام، مالک و آدرس الزامی هستند!" };
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
