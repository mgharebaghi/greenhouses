import { getAllSeedPackages } from "@/features/seed-packages/actions";
import { getAllSeedWarehousing } from "@/features/seed-warehousing/actions";
import SeedWarehousingTable from "@/features/seed-warehousing/components/SeedWarehousingTable";
import { getAllWarehouses } from "@/features/warehouses/actions";
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
