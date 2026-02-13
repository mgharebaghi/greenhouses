"use client";

import { useEffect, useState } from "react";
import SeedPackageTable from "./SeedPackageTable";
import { getAllSeedPackages } from "@/features/seedPackage/services";

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
            <SeedPackageTable
                data={data}
                loading={loading}
                setLoading={setLoading}
                setData={setData}
            />
        </div>
    );
}
