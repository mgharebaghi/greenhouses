"use server";

import { Zones } from "@/app/generated/prisma";
import { ZoneCreateRes } from "./index";
import { prisma } from "@/app/lib/singletone";

export async function createZone(data: Zones): Promise<ZoneCreateRes> {
  if (!data.Name || !data.AreaSqM || !data.GreenhouseID) {
    return { status: "error", message: "فیلدهای نام، مساحت و شناسه گلخانه الزامی هستند!" };
  }

  const existingZone = await prisma.zones.findFirst({
    where: {
      GreenhouseID: data.GreenhouseID,
      Name: data.Name,
    },
  });

  if (existingZone) {
    return { status: "error", message: "سالن با این نام قبلا ایجاد شده است!" };
  }

  const newZone = await prisma.zones.create({
    data: {
      Name: data.Name,
      AreaSqM: data.AreaSqM,
      GreenhouseID: data.GreenhouseID,
    },
  });

  if (newZone) {
    return { status: "ok", message: "سالن جدید با موفقیت ایجاد شد!" };
  }

  return { status: "error", message: "خطا در ایجاد سالن جدید!" };
}
