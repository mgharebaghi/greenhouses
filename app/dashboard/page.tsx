import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import DashboardOverviewView, {
  DashboardOverviewData,
} from "@/features/dashboard/components/DashboardOverviewView";
import DashboardLoading from "@/features/dashboard/components/DashboardLoading";
import {
  getDashboardRange,
  type DashboardRangeQuery,
} from "@/features/dashboard/domain/activity";
import { getDashboardOverview } from "@/features/dashboard/server/read";
import { getTehranDay } from "@/shared/dates/calendar";
import type { DashboardRange } from "@/features/dashboard/types";

export const metadata: Metadata = {
  title: "داشبورد",
};

async function DashboardData({
  range,
  today,
}: {
  range: DashboardRange;
  today: string;
}) {
  const overview = await getDashboardOverview(range, today).catch(
    (error: unknown) => {
      unstable_rethrow(error);
      return null;
    },
  );
  return <DashboardOverviewData overview={overview} />;
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<DashboardRangeQuery>;
}) {
  const today = getTehranDay(Date.now());
  const range = getDashboardRange(await searchParams, today);
  return (
    <DashboardOverviewView range={range} today={today}>
      <Suspense
        key={`${range.start}:${range.end}`}
        fallback={<DashboardLoading />}
      >
        <DashboardData range={range} today={today} />
      </Suspense>
    </DashboardOverviewView>
  );
}
