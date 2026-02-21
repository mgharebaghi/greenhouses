"use client";
import { Tbl_Plants } from "@/app/generated/prisma";
import PlantsTable from "@/features/plants/components/PlantsTable";
import { useState } from "react";
import PageHeader from "@/shared/components/PageHeader";
import { FileTextOutlined } from "@ant-design/icons";

export default function PlantsDashboard({ initialData }: { initialData: Tbl_Plants[] }) {
  const [data, setData] = useState<Tbl_Plants[]>(initialData);
  console.log("Initial Data:", data);
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
