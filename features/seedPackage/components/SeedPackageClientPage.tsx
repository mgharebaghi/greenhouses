"use client";

import { useEffect, useState } from "react";
import SeedPackageTable from "./SeedPackageTable";
import { getAllSeedPackages } from "@/features/seedPackage/services";
import PageHeader from "@/shared/components/PageHeader";
import { InboxOutlined } from "@ant-design/icons";

export default function SeedPackagePage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllSeedPackages();
        setData(res);
        setLoading(false);
    };

    return (
        <div className="p-6">
            <PageHeader
                title="بسته‌های بذر"
                subtitle="مدیریت عملیات مربوط به بسته‌های بذر و اختصاص شماره سریال"
                icon={<InboxOutlined />}
            />
            <SeedPackageTable
                data={data}
                loading={loading}
                setLoading={setLoading}
                setData={setData}
            />
        </div>
    );
}
