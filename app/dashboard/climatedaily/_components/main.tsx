"use client";

import type { ClimateDaily } from "@/app/generated/prisma";
import ClimateDailyTable from "./ClimateDailyTable";

export default function ClimateDailyDashboard({ initialData }: { initialData: any }) {
  return (
    <div className="w-full h-full p-4">
      <ClimateDailyTable initialData={initialData as ClimateDaily[]} />
    </div>
  );
}
