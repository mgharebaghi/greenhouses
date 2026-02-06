"use client";

import { useState } from "react";
import GraftingOperationTable from "./GraftingOperationTable";
import { getAllGraftingOperations } from "@/app/lib/services/grafting/operation/read";

interface ClientPageProps {
    initialData: any[];
    options: {
        seeds: { label: string, value: number }[];
        rootstocks: { label: string, value: number }[];
    };
}

export default function ClientPage({ initialData, options }: ClientPageProps) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const refreshData = async () => {
        // setLoading(true); // Optional: silent refresh preferred for better UX
        const newData = await getAllGraftingOperations();
        setData(newData);
        setLoading(false);
    };

    return (
        <div className="w-full">
            <GraftingOperationTable
                data={data}
                loading={loading}
                setLoading={setLoading}
                refreshData={refreshData}
                options={options}
            />
        </div>
    );
}
