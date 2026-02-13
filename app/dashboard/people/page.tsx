import { Tbl_People } from "@/app/generated/prisma";
import { getAllOwners } from "@/features/owners/services/read";
import OwnersDashboard from "@/features/owners/components/Main";

import type { Metadata } from "next";
import { OwnerResponse } from "@/features/owners/services";

export const metadata: Metadata = {
  title: "اطلاعات اشخاص",
};

export default async function Owners() {
  const initialData: OwnerResponse = await getAllOwners();
  return <OwnersDashboard initialData={initialData} />;
}
