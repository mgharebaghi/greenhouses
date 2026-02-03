"use client";

import { useEffect, useState } from "react";
import NurseryPlantingTable from "./NurseryPlantingTable";
import { getAllNurserySeeds, getSeedPackagesOptions, getNurseryRoomsOptions } from "@/app/lib/services/nursery/planting";

export default function ClientPage() {
    const [data, setData] = useState<any[]>([]);
    const [seedPackages, setSeedPackages] = useState<any[]>([]);
    const [nurseryRooms, setNurseryRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const [seeds, packages, rooms] = await Promise.all([
            getAllNurserySeeds(),
            getSeedPackagesOptions(),
            getNurseryRoomsOptions()
        ]);
        setData(seeds);
        setSeedPackages(packages);
        setNurseryRooms(rooms);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <NurseryPlantingTable
                    data={data}
                    loading={loading}
                    setLoading={setLoading}
                    refreshData={fetchData}
                    seedPackages={seedPackages}
                    nurseryRooms={nurseryRooms}
                />
            </div>
        </div>
    );
}
