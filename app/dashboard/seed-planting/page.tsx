"use client";

import { getSeedPlantings } from "@/features/seed-planting/actions";
import SeedPlantingTable from "@/features/seed-planting/components/SeedPlantingTable";
import DataLoadError from "@/shared/components/DataLoadError";
import PageHeader from "@/shared/components/PageHeader";
import useRemoteList from "@/shared/hooks/useRemoteList";
import { ContainerOutlined } from "@ant-design/icons";

export default function SeedPlantingPage() {
  const { data, loading, setData, setLoading, error, refresh } =
    useRemoteList(getSeedPlantings);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="کاشت بذور"
        subtitle="مدیریت عملیات کاشت بذر در سینی"
        icon={<ContainerOutlined />}
      />
      {error ? (
        <DataLoadError onRetry={() => void refresh()} />
      ) : (
        <SeedPlantingTable
          data={data}
          loading={loading}
          setMainData={setData}
          setMainLoading={setLoading}
        />
      )}
    </div>
  );
}
