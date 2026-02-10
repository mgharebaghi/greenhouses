"use client";
import { Tbl_Plants } from "@/app/generated/prisma";
import PlantsTable from "@/app/dashboard/plants/_components/PlantsTable";
import { useState } from "react";

export default function PlantsDashboard({ initialData }: { initialData: Tbl_Plants[] }) {
  const [data, setData] = useState<Tbl_Plants[]>(initialData);
  console.log("Initial Data:", data);
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full h-full p-4">
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
