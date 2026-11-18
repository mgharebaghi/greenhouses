import type { ActivityBucket, DashboardRange, ProductionStage } from "../types";

const dayMilliseconds = 86_400_000;
export const dashboardPeriods = ["7", "30", "90", "365", "all"] as const;

export type DashboardRangeQuery = {
  days?: string | string[];
  from?: string | string[];
  to?: string | string[];
};

export function shiftDay(day: string, offset: number) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function isCalendarDay(value: unknown): value is string {
  if (typeof value !== "string" || !/^(?!0000)\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const parsed = new Date(value);
  return (
    Number.isFinite(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function validDashboardDates(
  start: unknown,
  end: unknown,
  today: string,
) {
  return (
    isCalendarDay(start) && isCalendarDay(end) && start <= end && end <= today
  );
}

export function getDashboardRange(
  { days, from, to }: DashboardRangeQuery,
  today: string,
): DashboardRange {
  if (
    typeof from === "string" &&
    typeof to === "string" &&
    validDashboardDates(from, to, today)
  ) {
    return { period: "custom", start: from, end: to };
  }
  const period = dashboardPeriods.find((item) => item === days) ?? "30";
  const start = period === "all" ? null : shiftDay(today, 1 - Number(period));
  return { period, start, end: today };
}

export function buildActivity(
  start: string,
  end: string,
  rows: { date: string; count: number }[],
): ActivityBucket[] {
  const first = Date.parse(start);
  const days = (Date.parse(end) - first) / dayMilliseconds + 1;
  const bucketSize = days <= 10 ? 1 : Math.ceil(days / 12);
  const buckets = Array.from(
    { length: Math.ceil(days / bucketSize) },
    (_, index) => {
      const offset = index * bucketSize;
      return {
        start: shiftDay(start, offset),
        end: shiftDay(start, Math.min(days, offset + bucketSize) - 1),
        count: 0,
      };
    },
  );
  for (const { date, count } of rows) {
    if (date < start || date > end) continue;
    const index = Math.floor(
      (Date.parse(date) - first) / dayMilliseconds / bucketSize,
    );
    buckets[index].count += count;
  }
  return buckets;
}

export function recordedStage({
  planting,
  seedling,
  grafting,
}: Record<Exclude<ProductionStage, "order">, number>): ProductionStage {
  if (grafting > 0) return "grafting";
  if (seedling > 0) return "seedling";
  return planting > 0 ? "planting" : "order";
}
