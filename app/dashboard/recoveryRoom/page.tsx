"use client";

import type { RecoveryRoomListItem } from "@/features/recovery-rooms/types";

import { getAllRecoveryRooms } from "@/features/recovery-rooms/actions";
import RecoveryRoomTable from "@/features/recovery-rooms/components/RecoveryRoomTable";
import PageHeader from "@/shared/components/PageHeader";
import { MedicineBoxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function RecoveryRoomPage() {
  const [data, setData] = useState<RecoveryRoomListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const rooms = await getAllRecoveryRooms();
    setData(rooms);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <PageHeader
        title="اتاق ریکاوری"
        subtitle="مدیریت و مشاهده وضعیت سینی‌های موجود در اتاق ریکاوری"
        icon={<MedicineBoxOutlined />}
      />
      <RecoveryRoomTable
        data={data}
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        refreshData={fetchData}
      />
    </div>
  );
}
