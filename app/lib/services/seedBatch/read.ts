"use server";

import { prisma } from "@/app/lib/singletone";

export async function getAllSeedBatches() {
    try {
        const seedBatches = await prisma.seedBatch.findMany({
            include: {
                Suppliers: true,
                PlantVarities: true,
            },
            orderBy: {
                SeedBatchID: "desc",
            },
        });
        // Serialize data to avoid passing Decimal objects to client components
        const serializedSeedBatches = JSON.parse(JSON.stringify(seedBatches, (key, value) => {
            return (typeof value === 'object' && value !== null && 's' in value && 'e' in value && 'd' in value) // Check if it looks like a Decimal
                ? Number(value)
                : value;
        }));

        return serializedSeedBatches;
    } catch (error) {
        console.error("Error fetching seed batches:", error);
        return [];
    }
}
