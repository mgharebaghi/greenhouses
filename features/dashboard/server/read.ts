import "server-only";

import { readError } from "@/server/actions/errors";
import { requireSession } from "@/server/auth/require-session";
import { prisma } from "@/server/db/prisma";
import { getTehranDay } from "@/shared/dates/calendar";
import { buildActivity, recordedStage, shiftDay } from "../domain/activity";
import type { DashboardRange, DashboardOverview } from "../types";

export async function getDashboardOverview(
  selection: DashboardRange,
  today = getTehranDay(Date.now()),
): Promise<DashboardOverview> {
  await requireSession();
  const range = {
    ...(selection.start && { gte: new Date(selection.start) }),
    lt: new Date(shiftDay(selection.end, 1)),
  };
  const currentDay = new Date(today);

  try {
    const [
      dailyOrders,
      planting,
      seedling,
      grafting,
      activeGreenhouses,
      ordersWithoutPlanting,
      expiringPackages,
      expiredPackages,
      recentOrders,
    ] = await Promise.all([
      prisma.tbl_Orders.groupBy({
        by: ["OrderDate"],
        where: { OrderDate: range },
        orderBy: { OrderDate: "asc" },
        _count: { _all: true },
      }),
      prisma.tbl_SeedPlanting.aggregate({
        where: { PlantingDate: range },
        _count: { _all: true },
        _sum: { SeedPlantingNumber: true },
      }),
      prisma.tbl_StartSeedlingCycle.count({
        where: { GreenhouseEntryDate: range },
      }),
      prisma.tbl_GraftingOperation.count({ where: { GraftingDate: range } }),
      prisma.tbl_Greenhouses.count({ where: { IsActive: true } }),
      prisma.tbl_Orders.count({
        where: { OrderDate: range, Tbl_SeedPlanting: { none: {} } },
      }),
      prisma.tbl_SeedPackage.count({
        where: {
          ExpirationDate: {
            gte: currentDay,
            lte: new Date(shiftDay(today, 30)),
          },
        },
      }),
      prisma.tbl_SeedPackage.count({
        where: { ExpirationDate: { lt: currentDay } },
      }),
      prisma.tbl_Orders.findMany({
        where: { OrderDate: range },
        orderBy: [{ OrderDate: "desc" }, { ID: "desc" }],
        take: 5,
        select: {
          ID: true,
          OrderDate: true,
          OrderCode: true,
          OrderCount: true,
          Tbl_People_Tbl_Orders_CustomerIDToTbl_People: {
            select: { FirstName: true, LastName: true },
          },
          _count: {
            select: {
              Tbl_SeedPlanting: true,
              Tbl_StartSeedlingCycle: true,
              Tbl_GraftingOperation: true,
            },
          },
        },
      }),
    ]);

    const datedOrders = dailyOrders.flatMap(({ OrderDate, _count }) =>
      OrderDate
        ? [{ date: OrderDate.toISOString().slice(0, 10), count: _count._all }]
        : [],
    );
    return {
      activity: buildActivity(
        selection.start ?? datedOrders[0]?.date ?? selection.end,
        selection.end,
        datedOrders,
      ),
      stages: {
        order: dailyOrders.reduce((sum, row) => sum + row._count._all, 0),
        planting: planting._count._all,
        seedling,
        grafting,
      },
      plantedSeeds: planting._sum.SeedPlantingNumber ?? 0,
      activeGreenhouses,
      ordersWithoutPlanting,
      expiringPackages,
      expiredPackages,
      recentOrders: recentOrders.flatMap((order) => {
        if (!order.OrderDate) return [];
        const customer = order.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
        return [
          {
            id: order.ID,
            code: order.OrderCode,
            date: order.OrderDate.toISOString().slice(0, 10),
            customer: [customer?.FirstName, customer?.LastName]
              .filter(Boolean)
              .join(" "),
            quantity: order.OrderCount,
            stage: recordedStage({
              planting: order._count.Tbl_SeedPlanting,
              seedling: order._count.Tbl_StartSeedlingCycle,
              grafting: order._count.Tbl_GraftingOperation,
            }),
          },
        ];
      }),
    };
  } catch (error) {
    throw readError(error);
  }
}
