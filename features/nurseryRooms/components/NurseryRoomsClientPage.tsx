"use client";

import { useEffect, useState } from "react";
import NurseryRoomsTable from "./NurseryRoomsTable";
import { getAllNurseryRooms } from "@/features/nurseryRooms/services";
import PageHeader from "@/shared/components/PageHeader";
import { BorderOuterOutlined } from "@ant-design/icons";

export default function NurseryRoomsClientPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllNurseryRooms();
        setData(res);
        setLoading(false);
    };

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
