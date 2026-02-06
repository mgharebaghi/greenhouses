"use server";

import { prisma } from "@/app/lib/singletone";

export async function getAllRootStockPlants() {
    try {
        const data = await prisma.rootStockPlant.findMany({
            include: {
                PlantVarities: true,
                Suppliers: true
            },
            orderBy: {
                RootstockID: 'desc'
            }
        });

        // Convert Decimal fields to numbers/strings to prevent serialization errors
        const serializedData = data.map(item => ({
            ...item,
            StemDiameter: item.StemDiameter ? Number(item.StemDiameter) : null,
            PlantVarities: item.PlantVarities ? {
                ...item.PlantVarities,
                TypicalYieldKgPerM2: item.PlantVarities.TypicalYieldKgPerM2 ? Number(item.PlantVarities.TypicalYieldKgPerM2) : null,
                IdealTempMin: item.PlantVarities.IdealTempMin ? Number(item.PlantVarities.IdealTempMin) : null,
                IdealTempMax: item.PlantVarities.IdealTempMax ? Number(item.PlantVarities.IdealTempMax) : null,
                IdealHumidityMin: item.PlantVarities.IdealHumidityMin ? Number(item.PlantVarities.IdealHumidityMin) : null,
                IdealHumidityMax: item.PlantVarities.IdealHumidityMax ? Number(item.PlantVarities.IdealHumidityMax) : null
            } : null
        }));

        return JSON.parse(JSON.stringify(serializedData));
    } catch (error) {
        console.error("Error fetching root stock plants:", error);
        return [];
    }
}

export async function getRootStockOptions() {
    const result = {
        varieties: [] as { label: string, value: number }[],
        suppliers: [] as { label: string, value: number }[]
    };

    try {
        console.log("Fetching varieties...");
        const varieties = await prisma.plantVarities.findMany({
            select: { VarietyID: true, VarietyName: true },
            orderBy: { VarietyName: 'asc' }
        });
        result.varieties = varieties.map(v => ({ label: v.VarietyName || `Variety ${v.VarietyID}`, value: v.VarietyID }));
        console.log(`Fetched ${varieties.length} varieties.`);
    } catch (error) {
        console.error("Error fetching varieties:", error);
    }

    try {
        console.log("Fetching suppliers...");
        const suppliers = await prisma.suppliers.findMany({
            select: { ID: true, FirstName: true, LastName: true, CompanyName: true },
            orderBy: { ID: 'desc' } // Changed to ID desc to debug visibility
        });
        result.suppliers = suppliers.map(s => {
            const companyName = s.CompanyName ? s.CompanyName.trim() : "";
            const fullName = `${s.FirstName || ''} ${s.LastName || ''}`.trim();

            // Treat "-" as invalid company name (often used as placeholder)
            const isValidCompany = companyName.length > 0 && companyName !== '-';

            // Priority: Valid CompanyName > FullName > "ناشناس"
            const label = isValidCompany ? companyName : (fullName.length > 0 ? fullName : 'ناشناس');

            if (!isValidCompany) {
                console.log(`Supplier [${s.ID}]: No Valid Company ('${companyName}'). Name='${fullName}'. Label='${label}'`);
            }

            return { label, value: s.ID };
        });
        console.log(`Fetched ${suppliers.length} suppliers. Top 5:`, result.suppliers.slice(0, 5).map(s => s.label));
    } catch (error) {
        console.error("Error fetching suppliers:", error);
    }

    return result;
}
