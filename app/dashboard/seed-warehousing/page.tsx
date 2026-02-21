import { getAllSeedWarehousing } from "@/features/seedWarehousing/services";
import { getAllSeedPackages } from "@/features/seedPackage/services/read";
import { getAllWarehouses } from "@/features/warehouses/services/read";
import SeedWarehousingTable from "@/features/seedWarehousing/components/SeedWarehousingTable";
import PageHeader from "@/shared/components/PageHeader";
import { DatabaseOutlined } from "@ant-design/icons";

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
        <div className="p-6">
            <PageHeader
                title="انبارداری بذر"
                subtitle="مدیریت ورود و خروج بسته‌های بذر به انبارها"
                icon={<DatabaseOutlined />}
            />
            <SeedWarehousingTable
                data={data}
                seedPackages={seedPackages}
                warehouses={warehouses}
            />
        </div>
    );
}
