"use client";

import { getAllSeedPackages } from "@/features/seed-packages/actions";
import DataLoadError from "@/shared/components/DataLoadError";
import PageHeader from "@/shared/components/PageHeader";
import useRemoteList from "@/shared/hooks/useRemoteList";
import { InboxOutlined } from "@ant-design/icons";
import SeedPackageTable from "./SeedPackageTable";

export default function SeedPackagePage() {
  const {
    data,
    loading,
    setLoading,
    setData,
    error,
    refresh: fetchData,
  } = useRemoteList(getAllSeedPackages);
  if (error) return <DataLoadError onRetry={() => void fetchData()} />;

  return (
    <div className="p-6">
      <PageHeader
        title="بسته‌های بذر"
        subtitle="مدیریت عملیات مربوط به بسته‌های بذر و اختصاص شماره سریال"
        icon={<InboxOutlined />}
      />
      <SeedPackageTable
        data={data}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
      />
    </div>
  );
}
