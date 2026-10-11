"use client";

import type { GrowthStageRecord } from "@/features/growth-stages/types/record";
import PageHeader from "@/shared/components/PageHeader";
import { RiseOutlined } from "@ant-design/icons";
import { useState } from "react";
import GrowthStagesTable from "./GrowthStagesTable";

export default function GrowthStagesDashboard({
  initialData,
}: {
  initialData: GrowthStageRecord[];
}) {
  const [data, setData] = useState<GrowthStageRecord[]>(initialData);
  const [loading, setMainLoading] = useState<boolean>(false);

  return (
    <div className="w-full h-full p-6">
      <PageHeader
        title="مراحل رشد"
        subtitle="مدیریت مراحل رشد انواع گیاهان"
        icon={<RiseOutlined />}
      />
      <div className="w-full">
        <GrowthStagesTable
          data={data}
          loading={loading}
          setMainData={setData}
          setMainLoading={setMainLoading}
        />
      </div>
    </div>
  );
}
