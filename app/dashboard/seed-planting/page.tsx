"use client";

import { useEffect, useState } from "react";
import SeedPlantingTable from "@/features/seedPlanting/components/SeedPlantingTable";
import { getSeedPlantings } from "@/features/seedPlanting/services";

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
        <SeedPlantingTable
            data={data}
            loading={loading}
            setMainData={setData}
            setMainLoading={setLoading}
        />
    );
}
