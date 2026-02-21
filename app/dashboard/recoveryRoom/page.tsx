"use client";

import { useEffect, useState } from "react";
import { getAllRecoveryRooms } from "@/features/recoveryRoom/services/read";
import RecoveryRoomTable from "@/features/recoveryRoom/components/RecoveryRoomTable";
import PageHeader from "@/shared/components/PageHeader";
import { MedicineBoxOutlined } from "@ant-design/icons";

export default function RecoveryRoomPage() {
    const [data, setData] = useState<any[]>([]);
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
