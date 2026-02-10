import { Tbl_People } from "@/app/generated/prisma";
import { getAllOwners } from "@/app/lib/services/owners/read";
import OwnersDashboard from "./_components/Main";

import type { Metadata } from "next";
import { OwnerResponse } from "@/app/lib/services/owners";

export const metadata: Metadata = {
  title: "اطلاعات اشخاص",
};

export default async function Owners() {
  const initialData: OwnerResponse = await getAllOwners();
  return <OwnersDashboard initialData={initialData} />;
}
