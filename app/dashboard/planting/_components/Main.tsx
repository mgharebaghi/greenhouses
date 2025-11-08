"use client";

import type { Plantings } from "@/app/generated/prisma";
import PlantingTable from "./PlantingTable";
import { useState } from "react";

export default function PlantingDashboard({ initialData }: { initialData: any }) {
  const [data, setData] = useState<any[]>(initialData || []);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full h-full p-4">
      <PlantingTable data={data} loading={loading} setMainData={setData} setMainLoading={setLoading} />
    </div>
  );
}
