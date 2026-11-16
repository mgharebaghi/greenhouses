"use client";

import { getAllOrders } from "@/features/orders/actions";
import DataLoadError from "@/shared/components/DataLoadError";
import useRemoteList from "@/shared/hooks/useRemoteList";
import OrdersTable from "./OrdersTable";

export default function OrdersClientPage() {
  const {
    data,
    loading,
    setLoading,
    setData,
    error,
    refresh: fetchData,
  } = useRemoteList(getAllOrders);
  if (error) return <DataLoadError onRetry={() => void fetchData()} />;

  return (
    <div className="dashboard-page">
      <OrdersTable
        data={data}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        refreshData={fetchData}
      />
    </div>
  );
}
