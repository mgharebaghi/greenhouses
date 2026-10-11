"use client";

import { getAllWarehouses } from "@/features/warehouses/actions";
import DataLoadError from "@/shared/components/DataLoadError";
import PageHeader from "@/shared/components/PageHeader";
import useRemoteList from "@/shared/hooks/useRemoteList";
import { ContainerOutlined } from "@ant-design/icons";
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
    <div className="p-6">
      <PageHeader
        title="مدیریت انبارها"
        subtitle="تعریف و مدیریت اطلاعات پایه انبارهای بذر"
        icon={<ContainerOutlined />}
      />
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
