"use client";
import { PlantGrowthStages } from "@/app/generated/prisma";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import GrowthStagesTable from "./GrowthStagesTable";
import GrowthStagesInsertModal, { GrowthStagesInsUpModalProps } from "./StagesInsUpModal";

export default function GrowthStagesDashboard({ initialData }: { initialData: PlantGrowthStages[] }) {
  const [data, setData] = useState<PlantGrowthStages[]>(initialData);
  const [loading, setMainLoading] = useState<boolean>(false);
  const [openInsertModal, setOpenInsertModal] = useState<GrowthStagesInsUpModalProps | null>(null);

  return (
    <div className="w-full h-full p-4">
      <div className="w-full py-4">
        <Button
          type="primary"
          onClick={() => {
            setOpenInsertModal({ isOpen: true });
          }}
        >
          افزودن مرحله رشد
          <PlusOutlined />
        </Button>
      </div>
      <div className="w-full">
        <GrowthStagesTable data={data} loading={loading} setMainData={setData} setMainLoading={setMainLoading} />
      </div>

      <GrowthStagesInsertModal
        isOpen={openInsertModal?.isOpen || false}
        onClose={() => setOpenInsertModal(null)}
        setMainLoading={setMainLoading}
        setMainData={setData}
      />
    </div>
  );
}
