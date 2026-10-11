import type { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/server/db/prisma";
import "server-only";
import type { OrderDetails, OrderPackageDetails } from "../types/details";
export const orderInclude = {
  Tbl_People_Tbl_Orders_CustomerIDToTbl_People: {
    select: { FirstName: true, LastName: true, NationalCode: true },
  },
  Tbl_People_Tbl_Orders_ProjectManagerToTbl_People: {
    select: { FirstName: true, LastName: true, NationalCode: true },
  },
  Tbl_suppliers: {
    select: {
      CompanyName: true,
      FirstName: true,
      LastName: true,
      Legal: true,
      LicenseNumber: true,
    },
  },
  Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
    include: {
      Tbl_plantVariety: {
        include: {
          Tbl_Plants: {
            select: { CommonName: true },
          },
        },
      },
      Tbl_suppliers: {
        select: {
          CompanyName: true,
          FirstName: true,
          LastName: true,
          Legal: true,
        },
      },
    },
  },
  Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
    include: {
      Tbl_plantVariety: {
        include: {
          Tbl_Plants: {
            select: { CommonName: true },
          },
        },
      },
      Tbl_suppliers: {
        select: {
          CompanyName: true,
          FirstName: true,
          LastName: true,
          Legal: true,
        },
      },
    },
  },
} satisfies Prisma.Tbl_OrdersInclude;
type QueryRecord = Prisma.Tbl_OrdersGetPayload<{
  include: typeof orderInclude;
}>;
const serializeSeedPackage = (
  pkg: QueryRecord["Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage"],
): OrderPackageDetails | null => {
  if (!pkg) return null;
  return {
    ...pkg,
    WeightGram: pkg.WeightGram == null ? null : Number(pkg.WeightGram),
    Tbl_plantVariety: pkg.Tbl_plantVariety
      ? {
          ...pkg.Tbl_plantVariety,
          IdealTempMin:
            pkg.Tbl_plantVariety.IdealTempMin == null
              ? null
              : Number(pkg.Tbl_plantVariety.IdealTempMin),
          IdealTempMax:
            pkg.Tbl_plantVariety.IdealTempMax == null
              ? null
              : Number(pkg.Tbl_plantVariety.IdealTempMax),
          IdealHumidityMin:
            pkg.Tbl_plantVariety.IdealHumidityMin == null
              ? null
              : Number(pkg.Tbl_plantVariety.IdealHumidityMin),
          IdealHumidityMax:
            pkg.Tbl_plantVariety.IdealHumidityMax == null
              ? null
              : Number(pkg.Tbl_plantVariety.IdealHumidityMax),
        }
      : null,
  };
};
const serializeOrder = (order: QueryRecord): OrderDetails => {
  return {
    ...order,
    Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage:
      serializeSeedPackage(
        order.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage,
      ),
    Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: serializeSeedPackage(
      order.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage,
    ),
  };
};
export async function getOrderById(id: number) {
  if (!Number.isInteger(id) || id < 1) return null;

  try {
    const order = await prisma.tbl_Orders.findUnique({
      where: { ID: id },
      include: orderInclude,
    });
    if (!order) return null;
    return serializeOrder(order);
  } catch (error) {
    console.error("Error fetching order by id:", error);
    throw new Error("دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}

export { serializeOrder };
