import { allGreenHouses } from "@/app/lib/services/greenhouse";
import GreenHouses from "../greenhouse/_components/Main";
import { Greenhouses as GreenHouse } from "@/app/generated/prisma/client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات گلخانه ها",
};

export default async function GreenHousesPage() {
  const initialData: GreenHouse[] = await allGreenHouses();
  return <GreenHouses initialData={initialData} />;
}
