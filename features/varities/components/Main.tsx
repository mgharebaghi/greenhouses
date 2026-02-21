"use client";

import { PlantVarietyDTO } from "../types/types";
import { useState } from "react";
import PlantVaritiesTable from "./PlantsVaritiesTable";
import PageHeader from "@/shared/components/PageHeader";
import { AppstoreOutlined } from "@ant-design/icons";

export default function PlantsVaritiesDashboard({ initialData }: { initialData: PlantVarietyDTO[] }) {
  const [data, setData] = useState<PlantVarietyDTO[]>(initialData);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6 w-full h-full">
      <PageHeader
        title="واریته - رقم"
        subtitle="مدیریت واریته‌های مرتبط با هر گیاه"
        icon={<AppstoreOutlined />}
      />
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
