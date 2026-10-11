"use server";
import { requireSession } from "@/server/auth/require-session";
import { serializeData } from "@/server/db/serialize";

import { prisma } from "@/server/db/prisma";

// Helper to serialize BigInt, Decimal, Date, Buffer

export async function getSeedPlantings() {
  await requireSession();
  const rows = await prisma.tbl_SeedPlanting.findMany({
    include: {
      Tbl_Orders: {
        include: {
          Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
            include: {
              Tbl_plantVariety: true,
              Tbl_suppliers: true,
            },
          },
          Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
            include: {
              Tbl_plantVariety: true,
              Tbl_suppliers: true,
            },
          },
        },
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
  await requireSession();
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
  await requireSession();
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
