'use server';
import {prisma} from '@/app/lib/singletone'

export async function updateGreenHouse(params: { id: number; data: any }) {
    await prisma.greenhouses.update({
        where: { GreenhouseID: params.id },
        data: params.data,
    });
}