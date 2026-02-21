"use client";

import { useEffect, useState } from "react";
import SeedPlantingTable from "@/features/seedPlanting/components/SeedPlantingTable";
import { getSeedPlantings } from "@/features/seedPlanting/services";
import PageHeader from "@/shared/components/PageHeader";
import { ContainerOutlined } from "@ant-design/icons";

export default function SeedPlantingPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const res = await getSeedPlantings();
        setData(res);
        setLoading(false);
    };

    return (
        <div className="p-6">
            <PageHeader
                title="کاشت بذور"
                subtitle="مدیریت عملیات کاشت بذر در سینی"
                icon={<ContainerOutlined />}
            />
            <SeedPlantingTable
                data={data}
                loading={loading}
                setMainData={setData}
                setMainLoading={setLoading}
            />
        </div>
    );
}
