"use client";

import PageHeader from "@/shared/components/PageHeader";
import { AppstoreOutlined } from "@ant-design/icons";
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
    <div className="p-6 w-full h-full">
      <PageHeader
        title="واریته - رقم"
        subtitle="مدیریت واریته‌های مرتبط با هر گیاه"
        icon={<AppstoreOutlined />}
      />
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
