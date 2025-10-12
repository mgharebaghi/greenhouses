"use client";
import { Plants } from "@/app/generated/prisma";
import PlantsTable from "@/app/dashboard/plants/_components/PlantsTable";
import { useState } from "react";
import PlantsInsrtModal from "@/app/dashboard/plants/_components/PlantsInsertModal";

export default function PlantsDashboard({ initialData }: { initialData: Plants[] }) {
  const [data, setData] = useState<Plants[]>(initialData);
  console.log("Initial Data:", data);
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full h-full p-4">
      <div className="w-full">
        <PlantsTable
          data={data}
          loading={loading}
          setMainData={setData}
          setMainLoading={setLoading}
          setInsertModalOpen={setInsertModalOpen}
        />
      </div>

      <PlantsInsrtModal
        isOpen={insertModalOpen}
        setIsOpen={setInsertModalOpen}
        setMainData={setData}
        setMainLoading={setLoading}
      />
    </div>
  );
}
