"use client";

import type { getSeedPlantings as SeedPlantingsQuery } from "@/features/seed-planting/actions";
type SeedPlantingDetails = Awaited<
  ReturnType<typeof SeedPlantingsQuery>
>[number];

import { getSeedPlantings } from "@/features/seed-planting/actions";
import SeedPlantingTable from "@/features/seed-planting/components/SeedPlantingTable";
import PageHeader from "@/shared/components/PageHeader";
import { ContainerOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function SeedPlantingPage() {
  const [data, setData] = useState<SeedPlantingDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await getSeedPlantings();
    setData(res);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="کاشت بذور"
        subtitle="مدیریت عملیات کاشت بذر در سینی"
        icon={<ContainerOutlined />}
      />
      <SeedPlantingTable
        data={data}
        loading={loading}
        setMainData={setData}
        setMainLoading={setLoading}
      />
    </div>
  );
}
