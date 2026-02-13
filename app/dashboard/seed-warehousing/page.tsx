import { getAllSeedWarehousing } from "@/features/seedWarehousing/services";
import { getAllSeedPackages } from "@/features/seedPackage/services/read";
import { getAllWarehouses } from "@/features/warehouses/services/read";
import SeedWarehousingTable from "@/features/seedWarehousing/components/SeedWarehousingTable";

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
