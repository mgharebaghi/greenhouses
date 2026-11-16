"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { serializeData } from "@/server/db/serialize";

import { prisma } from "@/server/db/prisma";

const seedVarietySelect = {
  ID: true,
  Tbl_plantVariety: {
    select: {
      ID: true,
      VarietyName: true,
      Tbl_Plants: { select: { CommonName: true } },
    },
  },
} as const;

// Helper to serialize BigInt, Decimal, Date, Buffer

export async function getSeedPlantings() {
  try {
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
  } catch (error) {
    throw readError(error);
  }
}

export async function getOrdersForDropdown() {
  try {
    await requireSession();
    const orders = await prisma.tbl_Orders.findMany({
      select: {
        ID: true,
        OrderCode: true,
        OrderCount: true,
        QRCode: true,
        Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
          select: seedVarietySelect,
        },
        Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
          select: seedVarietySelect,
        },
      },
      orderBy: {
        ID: "desc",
      },
    });

    return serializeData(orders);
  } catch (error) {
    throw readError(error);
  }
}

export async function getTechnicians() {
  try {
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
  } catch (error) {
    throw readError(error);
  }
}
