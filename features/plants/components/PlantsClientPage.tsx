"use client";

import PlantsTable from "@/features/plants/components/PlantsTable";
import type { PlantRecord } from "@/features/plants/types/record";
import { useState } from "react";

export default function PlantsClientPage({
  initialData,
}: {
  initialData: PlantRecord[];
}) {
  const [data, setData] = useState<PlantRecord[]>(initialData);
  const [loading, setLoading] = useState(false);
  return (
    <div className="dashboard-page">
      <div className="w-full">
        <PlantsTable
          data={data}
          loading={loading}
          setMainData={setData}
          setMainLoading={setLoading}
        />
      </div>
    </div>
  );
}
