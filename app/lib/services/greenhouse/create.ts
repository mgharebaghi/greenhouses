"use server";
import { prisma } from "@/app/lib/singletone";
import { GreenHouseCreateRes } from "./types";
import { Greenhouses } from "@/app/generated/prisma/client";

export async function createGreenHouse(data: Greenhouses): Promise<GreenHouseCreateRes> {
  if (!data.GreenhouseName || !data.OwnerID || !data.Address) {
    return { status: "error", message: "فیلدهای نام، مالک و آدرس الزامی هستند!" };
  }

  const greenHouse = await prisma.greenhouses.findFirst({
    where: { GreenhouseName: data.GreenhouseName },
  });

  if (greenHouse) {
    return { status: "error", message: "گلخانه‌ای با این نام قبلا ثبت شده است!" };
  }

  const newGreenHouse = await prisma.greenhouses.create({
    data: {
      GreenhouseName: data.GreenhouseName,
      OwnerID: data.OwnerID,
      Address: data.Address,
      Notes: data.Notes,
      CreatedAt: new Date(),
    },
  });

  if (!newGreenHouse) {
    return { status: "error", message: "خطایی در ثبت گلخانه رخ داد، لطفا مجددا تلاش کنید." };
  }

  return { status: "ok", message: "گلخانه جدید با موفقیت ایجاد شد!", greenHouseId: newGreenHouse.GreenhouseID };
}
