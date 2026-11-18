import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildActivity,
  getDashboardRange,
} from "../features/dashboard/domain/activity";
import type { getDashboardOverview } from "../features/dashboard/server/read";
import { createServerLoader } from "./helpers/server-loader";

const today = "2026-11-18";

test("dashboard accepts long, all-time, and valid custom ranges", () => {
  assert.deepEqual(getDashboardRange({ days: "365" }, today), {
    period: "365",
    start: "2025-11-19",
    end: today,
  });
  assert.deepEqual(getDashboardRange({ days: "all" }, today), {
    period: "all",
    start: null,
    end: today,
  });
  assert.deepEqual(
    getDashboardRange({ from: "2022-02-01", to: "2023-03-02" }, today),
    {
      period: "custom",
      start: "2022-02-01",
      end: "2023-03-02",
    },
  );
  for (const query of [
    { from: "2025-02-30", to: today },
    { from: today, to: "2026-11-17" },
    { from: today, to: "2026-11-19" },
    { days: ["7", "30"] },
  ]) {
    assert.equal(getDashboardRange(query, today).period, "30");
  }
});

test("dashboard groups SQL calendar days without losing zero-activity intervals", () => {
  const daily = buildActivity("2026-11-12", today, [
    { date: "2026-11-12", count: 2 },
    { date: "2026-11-18", count: 6 },
  ]);
  assert.deepEqual(
    daily.map(({ count }) => count),
    [2, 0, 0, 0, 0, 0, 6],
  );
  const threeDay = buildActivity("2026-10-20", today, [
    { date: "2026-10-20", count: 2 },
    { date: "2026-10-22", count: 3 },
    { date: "2026-11-18", count: 4 },
    { date: "2026-11-19", count: 7 },
  ]);
  assert.deepEqual(threeDay[0], {
    start: "2026-10-20",
    end: "2026-10-22",
    count: 5,
  });
  assert.deepEqual(threeDay.at(-1), {
    start: "2026-11-16",
    end: "2026-11-18",
    count: 4,
  });
  const multiyear = buildActivity("2020-01-01", today, [
    { date: "2020-01-01", count: 4 },
    { date: today, count: 9 },
  ]);
  assert.ok(multiyear.length <= 12);
  assert.equal(multiyear.at(-1)?.end, today);
  assert.equal(
    multiyear.reduce((sum, bucket) => sum + bucket.count, 0),
    13,
  );
});

test("dashboard protects its reads and reports recorded production stages", async () => {
  const overviewModule = "@/features/dashboard/server/read";
  const denied = createServerLoader({}, null).load(overviewModule)
    .getDashboardOverview as typeof getDashboardOverview;
  const week = getDashboardRange({ days: "7" }, today);
  await assert.rejects(denied(week, today), {
    name: "AuthenticationError",
  });

  const orderDate = new Date("2026-11-18");
  const expirationFilters: unknown[] = [];
  const loader = createServerLoader({
    tbl_Orders: {
      groupBy: async () => [{ OrderDate: orderDate, _count: { _all: 2 } }],
      count: async () => 1,
      findMany: async () => [
        {
          ID: 25,
          OrderDate: orderDate,
          OrderCode: "A25",
          OrderCount: 0,
          Tbl_People_Tbl_Orders_CustomerIDToTbl_People: null,
          _count: {
            Tbl_SeedPlanting: 2,
            Tbl_StartSeedlingCycle: 1,
            Tbl_GraftingOperation: 0,
          },
        },
      ],
    },
    tbl_SeedPlanting: {
      aggregate: async () => ({
        _count: { _all: 2 },
        _sum: { SeedPlantingNumber: 42 },
      }),
    },
    tbl_StartSeedlingCycle: { count: async () => 1 },
    tbl_GraftingOperation: { count: async () => 0 },
    tbl_Greenhouses: { count: async () => 3 },
    tbl_SeedPackage: {
      count: async (query: unknown) => {
        expirationFilters.push(query);
        return 0;
      },
    },
  });
  const getOverview = loader.load(overviewModule)
    .getDashboardOverview as typeof getDashboardOverview;
  const result = await getOverview(week, today);
  assert.deepEqual(result.stages, {
    order: 2,
    planting: 2,
    seedling: 1,
    grafting: 0,
  });
  assert.equal(result.plantedSeeds, 42);
  assert.equal(result.activeGreenhouses, 3);
  assert.equal(result.ordersWithoutPlanting, 1);
  assert.deepEqual(result.recentOrders[0], {
    id: 25,
    date: "2026-11-18",
    code: "A25",
    quantity: 0,
    customer: "",
    stage: "seedling",
  });
  assert.deepEqual(expirationFilters, [
    {
      where: {
        ExpirationDate: { gte: orderDate, lte: new Date("2026-12-18") },
      },
    },
    { where: { ExpirationDate: { lt: orderDate } } },
  ]);
});
