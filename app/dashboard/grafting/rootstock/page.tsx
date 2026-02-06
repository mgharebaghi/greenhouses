"use client";

import { useEffect, useState } from "react";
import { getAllRootStockPlants, getRootStockOptions } from "@/app/lib/services/grafting/rootstock/read";
import { deleteRootStockPlant } from "@/app/lib/services/grafting/rootstock/delete";
import RootStockTable from "./_components/RootStockTable";
import { Breadcrumb } from "antd";

export default function RootStockPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState<{ varieties: any[], suppliers: any[] }>({ varieties: [], suppliers: [] });

    const fetchData = async () => {
        setLoading(true);
        const [plants, opts] = await Promise.all([
            getAllRootStockPlants(),
            getRootStockOptions()
        ]);
        setData(plants);
        setOptions(opts);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-full p-6">
            <RootStockTable
                data={data}
                loading={loading}
                setLoading={setLoading}
                refreshData={fetchData}
                options={options}
            />
        </div>
    );
}
