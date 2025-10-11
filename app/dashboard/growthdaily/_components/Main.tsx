"use client";

import type { PlantingGrowthDaily } from "@/app/generated/prisma";
import GrowthDailyTable from "./GrowthDailyTable";

export default function GrowthDailyDashboard({ initialData }: { initialData: any }) {
  return (
    <div className="w-full h-full p-4">
      <GrowthDailyTable initialData={initialData as PlantingGrowthDaily[]} />
    </div>
  );
}
