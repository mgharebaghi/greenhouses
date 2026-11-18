"use server";
import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";

import { prisma } from "@/server/db/prisma";

const seedPackageSelection = {
  select: {
    Tbl_plantVariety: {
      select: {
        VarietyName: true,
        Tbl_Plants: { select: { CommonName: true } },
      },
    },
  },
} as const;

const orderSeedPackages = {
  Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: seedPackageSelection,
  Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: seedPackageSelection,
};

export async function getStartSeedlingCycles() {
  try {
    await requireSession();
    const cycles = await prisma.tbl_StartSeedlingCycle.findMany({
      include: {
        Tbl_Orders: {
          select: {
            OrderCode: true,
            ...orderSeedPackages,
          },
        },
        Tbl_Greenhouses: {
          select: { GreenhouseName: true },
        },
      },
      orderBy: { ID: "desc" },
    });
    return cycles;
  } catch (error) {
    throw readError(error);
  }
}

export async function getOrdersForSelect() {
  try {
    await requireSession();
    const orders = await prisma.tbl_Orders.findMany({
      where: {
        // Filter for orders that are relevant? For now get all or maybe non-completed ones
      },
      select: {
        ID: true,
        OrderCode: true,
        ...orderSeedPackages,
      },
      orderBy: { ID: "desc" },
    });

    return orders.map((order) => ({
      value: order.ID,
      label: order.OrderCode,
      rootstockVariety:
        order.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
          ?.Tbl_plantVariety,
      scionVariety:
        order.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
          ?.Tbl_plantVariety,
    }));
  } catch (error) {
    throw readError(error);
  }
}

export async function getGreenhousesForSelect() {
  try {
    await requireSession();
    const greenhouses = await prisma.tbl_Greenhouses.findMany({
      where: { IsActive: true },
      select: { ID: true, GreenhouseName: true },
    });

    return greenhouses.map((g) => ({
      value: g.ID,
      label: g.GreenhouseName,
    }));
  } catch (error) {
    throw readError(error);
  }
}
