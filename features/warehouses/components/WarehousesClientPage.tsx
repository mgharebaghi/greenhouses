"use client";

import { useEffect, useState } from "react";
import WarehousesTable from "./WarehousesTable";
import { getAllWarehouses } from "@/features/warehouses/services";

export default function WarehousesClientPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllWarehouses();
        setData(res);
        setLoading(false);
    };

    return (
        <div className="p-6">
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
