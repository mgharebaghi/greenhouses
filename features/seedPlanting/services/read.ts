"use server";

import { prisma } from "@/lib/singletone";

// Helper to serialize BigInt, Decimal, Date, Buffer
function serializeData(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === "bigint") {
        return obj.toString();
    }

    if (obj instanceof Date) {
        return obj.toISOString();
    }

    // Duck-typing for Decimal (Prisma/Decimal.js)
    if (obj && typeof obj === 'object' && typeof obj.toNumber === 'function') {
        return obj.toNumber();
    }

    if (Buffer.isBuffer(obj)) {
        return `data:image/png;base64,${obj.toString('base64')}`;
    }

    if (Array.isArray(obj)) {
        return obj.map(serializeData);
    }

    if (typeof obj === "object") {
        const newObj: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = serializeData(obj[key]);
            }
        }
        return newObj;
    }

    return obj;
}

export async function getSeedPlantings() {
    const rows = await prisma.tbl_SeedPlanting.findMany({
        include: {
            Tbl_Orders: {
                include: {
                    Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
                        include: {
                            Tbl_plantVariety: true,
                            Tbl_suppliers: true
                        }
                    },
                    Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
                        include: {
                            Tbl_plantVariety: true,
                            Tbl_suppliers: true
                        }
                    }
                }
            },
            Tbl_Greenhouses: true,
            Tbl_People: true,
        },
        orderBy: {
            ID: "desc",
        },
    });

    return serializeData(rows);
}

export async function getOrdersForDropdown() {
    const orders = await prisma.tbl_Orders.findMany({
        select: {
            ID: true,
            OrderCode: true,
            OrderCount: true,
            QRCode: true,
            Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
                select: {
                    ID: true,
                    Tbl_plantVariety: {
                        select: {
                            ID: true,
                            VarietyName: true,
                        },
                    },
                },
            },
            Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
                select: {
                    ID: true,
                    Tbl_plantVariety: {
                        select: {
                            ID: true,
                            VarietyName: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            ID: "desc",
        },
    });

    return serializeData(orders);
}

export async function getTechnicians() {
    const techs = await prisma.tbl_People.findMany({
        select: {
            ID: true,
            FirstName: true,
            LastName: true,
        },
        orderBy: {
            LastName: "asc",
        },
    });
    return serializeData(techs);
}
