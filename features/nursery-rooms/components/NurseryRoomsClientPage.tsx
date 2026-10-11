"use client";

import { getAllNurseryRooms } from "@/features/nursery-rooms/actions";
import DataLoadError from "@/shared/components/DataLoadError";
import PageHeader from "@/shared/components/PageHeader";
import useRemoteList from "@/shared/hooks/useRemoteList";
import { BorderOuterOutlined } from "@ant-design/icons";
import NurseryRoomsTable from "./NurseryRoomsTable";

export default function NurseryRoomsClientPage() {
  const {
    data,
    loading,
    setLoading,
    setData,
    error,
    refresh: fetchData,
  } = useRemoteList(getAllNurseryRooms);
  if (error) return <DataLoadError onRetry={() => void fetchData()} />;

  return (
    <div className="p-6">
      <PageHeader
        title="اتاق‌های ریکاوری"
        subtitle="تعریف و مدیریت اطلاعات پایه اتاق‌های ریکاوری (نرسری)"
        icon={<BorderOuterOutlined />}
      />
      <NurseryRoomsTable
        data={data}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        refreshData={fetchData}
      />
    </div>
  );
}
