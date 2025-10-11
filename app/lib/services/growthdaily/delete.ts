'use server';
import {prisma} from '@/app/lib/singletone';

export async function deleteGrowthDaily(id: number) {
    await prisma.plantingGrowthDaily.delete({
        where: {
            PlantGrowthDailyID: id
        }
    });

    return true;
}