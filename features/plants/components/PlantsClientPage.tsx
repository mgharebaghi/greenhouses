"use client";

import PlantsTable from "@/features/plants/components/PlantsTable";
import type { PlantRecord } from "@/features/plants/types/record";
import PageHeader from "@/shared/components/PageHeader";
import { FileTextOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function PlantsClientPage({
  initialData,
}: {
  initialData: PlantRecord[];
}) {
  const [data, setData] = useState<PlantRecord[]>(initialData);
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full h-full p-6">
      <PageHeader
        title="انواع گیاه"
        subtitle="مدیریت اطلاعات پایه انواع گیاه"
        icon={<FileTextOutlined />}
      />
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
