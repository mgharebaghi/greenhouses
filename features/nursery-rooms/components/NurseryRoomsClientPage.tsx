"use client";

import { getAllNurseryRooms } from "@/features/nursery-rooms/actions";
import DataLoadError from "@/shared/components/DataLoadError";
import useRemoteList from "@/shared/hooks/useRemoteList";
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
    <div className="dashboard-page">
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
