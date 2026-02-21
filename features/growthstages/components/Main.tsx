"use client";
import { Tbl_PlantGrowthStage } from "@/app/generated/prisma";
import { useState } from "react";
import GrowthStagesTable from "./GrowthStagesTable";
import PageHeader from "@/shared/components/PageHeader";
import { RiseOutlined } from "@ant-design/icons";

export default function GrowthStagesDashboard({ initialData }: { initialData: Tbl_PlantGrowthStage[] }) {
  const [data, setData] = useState<Tbl_PlantGrowthStage[]>(initialData);
  const [loading, setMainLoading] = useState<boolean>(false);

  return (
    <div className="w-full h-full p-6">
      <PageHeader
        title="مراحل رشد"
        subtitle="مدیریت مراحل رشد انواع گیاهان"
        icon={<RiseOutlined />}
      />
      <div className="w-full">
        <GrowthStagesTable data={data} loading={loading} setMainData={setData} setMainLoading={setMainLoading} />
      </div>
    </div>
  );
}
