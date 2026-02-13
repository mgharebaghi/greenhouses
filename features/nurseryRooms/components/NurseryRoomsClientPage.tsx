"use client";

import { useEffect, useState } from "react";
import NurseryRoomsTable from "./NurseryRoomsTable";
import { getAllNurseryRooms } from "@/features/nurseryRooms/services";

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
