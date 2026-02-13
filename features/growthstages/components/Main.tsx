"use client";
import { Tbl_PlantGrowthStage } from "@/app/generated/prisma";
import { useState } from "react";
import GrowthStagesTable from "./GrowthStagesTable";

export default function GrowthStagesDashboard({ initialData }: { initialData: Tbl_PlantGrowthStage[] }) {
  const [data, setData] = useState<Tbl_PlantGrowthStage[]>(initialData);
  const [loading, setMainLoading] = useState<boolean>(false);

  return (
    <div className="w-full h-full p-4">
      <div className="w-full">
        <GrowthStagesTable data={data} loading={loading} setMainData={setData} setMainLoading={setMainLoading} />
      </div>
    </div>
  );
}
