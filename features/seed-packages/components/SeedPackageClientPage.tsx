"use client";

import { getAllSeedPackages } from "@/features/seed-packages/actions";
import DataLoadError from "@/shared/components/DataLoadError";
import useRemoteList from "@/shared/hooks/useRemoteList";
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
    <div className="dashboard-page">
      <SeedPackageTable
        data={data}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
      />
    </div>
  );
}
