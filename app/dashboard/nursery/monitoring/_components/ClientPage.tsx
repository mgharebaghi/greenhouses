"use client";

import { useEffect, useState } from "react";
import NurseryMonitoringTable from "./NurseryMonitoringTable";
import { getAllCareLogs, getNurserySeedsForMonitoring } from "@/app/lib/services/nursery/monitoring/read";

export default function ClientPage() {
    const [data, setData] = useState<any[]>([]);
    const [nurserySeeds, setNurserySeeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const [logs, seeds] = await Promise.all([
            getAllCareLogs(),
            getNurserySeedsForMonitoring()
        ]);
        setData(logs);
        setNurserySeeds(seeds);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <NurseryMonitoringTable
                    data={data}
                    loading={loading}
                    setLoading={setLoading}
                    refreshData={fetchData}
                    nurserySeeds={nurserySeeds}
                />
            </div>
        </div>
    );
}
