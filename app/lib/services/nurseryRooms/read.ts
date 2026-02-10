"use server";

import { prisma } from "@/app/lib/singletone";

export async function getAllNurseryRooms() {
    try {
        const nurseryRooms = await prisma.tbl_NurseryRoom.findMany({
            orderBy: {
                ID: "desc",
            },
        });
        const safeNurseryRooms = nurseryRooms.map((room) => ({
            ...room,
            TemperatureMin: room.TemperatureMin?.toNumber(),
            TemperatureMax: room.TemperatureMax?.toNumber(),
            HumidityMin: room.HumidityMin?.toNumber(),
            HumidityMax: room.HumidityMax?.toNumber(),
            LightHoursPerDay: room.LightHoursPerDay?.toNumber(),
        }));
        return safeNurseryRooms;
    } catch (error) {
        console.error("Error fetching nursery rooms:", error);
        return [];
    }
}

export async function getNurseryRoomById(id: number) {
    try {
        const nurseryRoom = await prisma.tbl_NurseryRoom.findUnique({
            where: { ID: id },
        });
        if (!nurseryRoom) return null;

        return {
            ...nurseryRoom,
            TemperatureMin: nurseryRoom.TemperatureMin?.toNumber(),
            TemperatureMax: nurseryRoom.TemperatureMax?.toNumber(),
            HumidityMin: nurseryRoom.HumidityMin?.toNumber(),
            HumidityMax: nurseryRoom.HumidityMax?.toNumber(),
            LightHoursPerDay: nurseryRoom.LightHoursPerDay?.toNumber(),
        };
    } catch (error) {
        console.error("Error fetching nursery room:", error);
        return null;
    }
}
