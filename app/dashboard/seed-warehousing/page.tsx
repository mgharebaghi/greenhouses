import { getAllSeedPackages } from "@/features/seed-packages/actions";
import { getAllSeedWarehousing } from "@/features/seed-warehousing/actions";
import SeedWarehousingTable from "@/features/seed-warehousing/components/SeedWarehousingTable";
import { getAllWarehouses } from "@/features/warehouses/actions";

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
    <div className="dashboard-page">
      <SeedWarehousingTable
        data={data}
        seedPackages={seedPackages}
        warehouses={warehouses}
      />
    </div>
  );
}
