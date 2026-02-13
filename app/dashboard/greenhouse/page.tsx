import { allGreenHouses } from "@/features/greenhouse/services";
import GreenHouses from "@/features/greenhouse/components/Main";
import { Tbl_Greenhouses } from "@/app/generated/prisma/client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات گلخانه ها",
};

export default async function GreenHousesPage() {
  const initialData: Tbl_Greenhouses[] = await allGreenHouses();
  return <GreenHouses initialData={initialData} />;
}
