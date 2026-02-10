"use client";

import { PlantVarietyDTO } from "../page";
import { useState } from "react";
import PlantVaritiesTable from "./PlantsVaritiesTable";

export default function PlantsVaritiesDashboard({ initialData }: { initialData: PlantVarietyDTO[] }) {
  const [data, setData] = useState<PlantVarietyDTO[]>(initialData);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4 w-full h-full">
      <div className="w-full">
        <PlantVaritiesTable
          data={data}
          loading={loading}
          setMainData={setData}
          setMainLoading={setLoading}
        />
      </div>
    </div>
  );
}
