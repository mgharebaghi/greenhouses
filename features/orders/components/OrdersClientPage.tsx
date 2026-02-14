"use client";

import { useEffect, useState } from "react";
import OrdersTable from "./OrdersTable";
import { getAllOrders } from "@/features/orders/services";

export default function OrdersClientPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllOrders();
        setData(res);
        setLoading(false);
    };

    return (
        <div className="p-6">
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
