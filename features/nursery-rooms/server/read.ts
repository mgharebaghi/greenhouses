"use server";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";
import type { NurseryRoomRecord } from "../types/record";

export async function getAllNurseryRooms(): Promise<NurseryRoomRecord[]> {
  await requireSession();
  try {
    const nurseryRooms = await prisma.tbl_NurseryRoom.findMany({
      orderBy: {
        ID: "desc",
      },
    });
    const safeNurseryRooms = nurseryRooms.map((room) => ({
      ...room,
      TemperatureMin: room.TemperatureMin?.toNumber() ?? null,
      TemperatureMax: room.TemperatureMax?.toNumber() ?? null,
      HumidityMin: room.HumidityMin?.toNumber() ?? null,
      HumidityMax: room.HumidityMax?.toNumber() ?? null,
      LightHoursPerDay: room.LightHoursPerDay?.toNumber() ?? null,
    }));
    return safeNurseryRooms;
  } catch (error) {
    console.error("Query failed", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}

export async function getNurseryRoomById(
  id: number,
): Promise<NurseryRoomRecord | null> {
  await requireSession();
  try {
    const nurseryRoom = await prisma.tbl_NurseryRoom.findUnique({
      where: { ID: id },
    });
    if (!nurseryRoom) return null;

    return {
      ...nurseryRoom,
      TemperatureMin: nurseryRoom.TemperatureMin?.toNumber() ?? null,
      TemperatureMax: nurseryRoom.TemperatureMax?.toNumber() ?? null,
      HumidityMin: nurseryRoom.HumidityMin?.toNumber() ?? null,
      HumidityMax: nurseryRoom.HumidityMax?.toNumber() ?? null,
      LightHoursPerDay: nurseryRoom.LightHoursPerDay?.toNumber() ?? null,
    };
  } catch (error) {
    console.error("Query failed", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}
