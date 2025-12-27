import { Owner_Observer } from "@/app/generated/prisma";
import { getAllOwners } from "@/app/lib/services/owners/read";
import OwnersDashboard from "./_components/Main";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات اشخاص",
};

export default async function Owners() {
  const initialData: Owner_Observer[] = await getAllOwners();
  return <OwnersDashboard initialData={initialData} />;
}
