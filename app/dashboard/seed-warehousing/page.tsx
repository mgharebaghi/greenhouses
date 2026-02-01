import { getAllSeedWarehousing } from "@/app/lib/services/seedWarehousing";
import { getAllSeedPackages } from "@/app/lib/services/seedPackage/read";
import { getAllWarehouses } from "@/app/lib/services/warehouses/read";
import SeedWarehousingTable from "./_components/SeedWarehousingTable";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "مدیریت انبارداری بذر",
};

export default async function SeedWarehousingPage() {
    const [data, seedPackages, warehouses] = await Promise.all([
        getAllSeedWarehousing(),
        getAllSeedPackages(),
        getAllWarehouses(),
    ]);

    return (
        <div className="w-full">
            <SeedWarehousingTable
                data={data}
                seedPackages={seedPackages}
                warehouses={warehouses}
            />
        </div>
    );
}
