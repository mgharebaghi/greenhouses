"use client";

import { getAllWarehouses } from "@/features/warehouses/actions";
import DataLoadError from "@/shared/components/DataLoadError";
import useRemoteList from "@/shared/hooks/useRemoteList";
import WarehousesTable from "./WarehousesTable";

export default function WarehousesClientPage() {
  const {
    data,
    loading,
    setLoading,
    setData,
    error,
    refresh: fetchData,
  } = useRemoteList(getAllWarehouses);
  if (error) return <DataLoadError onRetry={() => void fetchData()} />;

  return (
    <div className="dashboard-page">
      <WarehousesTable
        data={data}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        refreshData={fetchData}
      />
    </div>
  );
}
