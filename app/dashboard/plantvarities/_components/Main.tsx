"use client";

import { Button } from "antd";
import { PlantVarietyDTO } from "../page";
import { useState } from "react";
import PlantVaritiesTable from "./PlantsVaritiesTable";
import PlantVaritiesInsertModal from "./PlantVaritiesInsertModal";

export default function PlantsVaritiesDashboard({ initialData }: { initialData: PlantVarietyDTO[] }) {
  const [data, setData] = useState<PlantVarietyDTO[]>(initialData);
  const [loading, setLoading] = useState(false);

  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);

  const openInsertModal = () => {
    setIsInsertModalOpen(true);
  };

  return (
    <div className="p-4 w-full h-full">
      <div className="w-full py-4">
        <Button type="primary" onClick={openInsertModal}>
          افزودن گونه گیاهی
        </Button>
      </div>
      <div className="w-full">
        <PlantVaritiesTable data={data} loading={loading} setMainData={setData} setMainLoading={setLoading} />
      </div>

      <PlantVaritiesInsertModal
        isOpen={isInsertModalOpen}
        onClose={() => setIsInsertModalOpen(false)}
        setMainLoading={setIsInsertModalOpen}
        setMainData={setData}
      />
    </div>
  );
}
