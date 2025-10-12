"use client";
import { PlantGrowthStages } from "@/app/generated/prisma";
import { useState } from "react";
import GrowthStagesTable from "./GrowthStagesTable";

export default function GrowthStagesDashboard({ initialData }: { initialData: PlantGrowthStages[] }) {
  const [data, setData] = useState<PlantGrowthStages[]>(initialData);
  const [loading, setMainLoading] = useState<boolean>(false);

  return (
    <div className="w-full h-full p-4">
      <div className="w-full">
        <GrowthStagesTable data={data} loading={loading} setMainData={setData} setMainLoading={setMainLoading} />
      </div>
    </div>
  );
}
