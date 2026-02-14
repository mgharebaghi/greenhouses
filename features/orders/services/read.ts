"use server";

import { prisma } from "@/lib/singletone";

const serializeSeedPackage = (pkg: any) => {
    if (!pkg) return null;
    return {
        ...pkg,
        WeightGram: pkg.WeightGram ? Number(pkg.WeightGram) : null,
        Tbl_plantVariety: pkg.Tbl_plantVariety ? {
            ...pkg.Tbl_plantVariety,
            IdealTempMin: pkg.Tbl_plantVariety.IdealTempMin ? Number(pkg.Tbl_plantVariety.IdealTempMin) : null,
            IdealTempMax: pkg.Tbl_plantVariety.IdealTempMax ? Number(pkg.Tbl_plantVariety.IdealTempMax) : null,
            IdealHumidityMin: pkg.Tbl_plantVariety.IdealHumidityMin ? Number(pkg.Tbl_plantVariety.IdealHumidityMin) : null,
            IdealHumidityMax: pkg.Tbl_plantVariety.IdealHumidityMax ? Number(pkg.Tbl_plantVariety.IdealHumidityMax) : null,
        } : null
    };
};

const serializeOrder = (order: any) => {
    if (!order) return null;
    return {
        ...order,
        Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: serializeSeedPackage(order.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage),
        Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: serializeSeedPackage(order.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage),
    };
};

export async function getAllOrders() {
    try {
        const orders = await prisma.tbl_Orders.findMany({
            include: {
                Tbl_People_Tbl_Orders_CustomerIDToTbl_People: {
                    select: { FirstName: true, LastName: true, NationalCode: true }
                },
                Tbl_People_Tbl_Orders_ProjectManagerToTbl_People: {
                    select: { FirstName: true, LastName: true, NationalCode: true }
                },
                Tbl_suppliers: {
                    select: { CompanyName: true, FirstName: true, LastName: true, Legal: true, LicenseNumber: true }
                },
                Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
                    include: {
                        Tbl_plantVariety: {
                            include: {
                                Tbl_Plants: {
                                    select: { CommonName: true }
                                }
                            }
                        },
                        Tbl_suppliers: {
                            select: { CompanyName: true, FirstName: true, LastName: true }
                        }
                    }
                },
                Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
                    include: {
                        Tbl_plantVariety: {
                            include: {
                                Tbl_Plants: {
                                    select: { CommonName: true }
                                }
                            }
                        },
                        Tbl_suppliers: {
                            select: { CompanyName: true, FirstName: true, LastName: true }
                        }
                    }
                },
            },
            orderBy: {
                ID: "desc",
            },
        });
        return orders.map(serializeOrder);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

export async function getOrderById(id: number) {
    try {
        const order = await prisma.tbl_Orders.findUnique({
            where: { ID: id },
            include: {
                Tbl_People_Tbl_Orders_CustomerIDToTbl_People: {
                    select: { FirstName: true, LastName: true, NationalCode: true }
                },
                Tbl_People_Tbl_Orders_ProjectManagerToTbl_People: {
                    select: { FirstName: true, LastName: true, NationalCode: true }
                },
                Tbl_suppliers: {
                    select: { CompanyName: true, FirstName: true, LastName: true, Legal: true, LicenseNumber: true }
                },
                Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
                    include: {
                        Tbl_plantVariety: {
                            include: {
                                Tbl_Plants: {
                                    select: { CommonName: true }
                                }
                            }
                        },
                        Tbl_suppliers: {
                            select: { CompanyName: true, FirstName: true, LastName: true }
                        }
                    }
                },
                Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
                    include: {
                        Tbl_plantVariety: {
                            include: {
                                Tbl_Plants: {
                                    select: { CommonName: true }
                                }
                            }
                        },
                        Tbl_suppliers: {
                            select: { CompanyName: true, FirstName: true, LastName: true }
                        }
                    }
                },
            },
        });
        return serializeOrder(order);
    } catch (error) {
        console.error("Error fetching order by id:", error);
        return null;
    }
}
