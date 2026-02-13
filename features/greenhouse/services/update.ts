'use server';
import { prisma } from '@/lib/singletone'

export async function updateGreenHouse(params: { id: number; data: any }) {
    await prisma.tbl_Greenhouses.update({
        where: { ID: params.id },
        data: {
            GreenhouseName: params.data.GreenhouseName,
            GreenhouseType: params.data.GreenhouseType,
            AreaSqM: params.data.AreaSqM,
            OwnerID: params.data.OwnerID,
            ConstructionDate: params.data.ConstructionDate,
            GreenhouseAddress: params.data.GreenhouseAddress,
            IsActive: params.data.IsActive,
            Notes: params.data.Notes,
        },
    });

    return { status: "ok", message: "ویرایش با موفقیت انجام شد" };
}