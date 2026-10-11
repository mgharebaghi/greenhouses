"use client";

import { getAllOrders } from "@/features/orders/actions";
import DataLoadError from "@/shared/components/DataLoadError";
import PageHeader from "@/shared/components/PageHeader";
import useRemoteList from "@/shared/hooks/useRemoteList";
import { ShoppingCartOutlined } from "@ant-design/icons";
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
    <div className="p-6">
      <PageHeader
        title="ثبت سفارش"
        subtitle="مدیریت سفارشات ثبت شده در سیستم"
        icon={<ShoppingCartOutlined />}
      />
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
