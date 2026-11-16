"use client";

import { useState } from "react";
import { PlantVarietyDTO } from "../types";
import PlantVarietiesTable from "./PlantVarietiesTable";

export default function PlantVarietiesClientPage({
  initialData,
}: {
  initialData: PlantVarietyDTO[];
}) {
  const [data, setData] = useState<PlantVarietyDTO[]>(initialData);
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard-page">
      <div className="w-full">
        <PlantVarietiesTable
          data={data}
          loading={loading}
          setMainData={setData}
          setMainLoading={setLoading}
        />
      </div>
    </div>
  );
}
