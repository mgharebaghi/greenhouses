import { getPeople } from "@/features/people/actions";
import PeopleClientPage from "@/features/people/components/PeopleClientPage";

import type { PersonActionResponse } from "@/features/people/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اطلاعات اشخاص",
};

export default async function Owners() {
  const initialData: PersonActionResponse = await getPeople();
  return <PeopleClientPage initialData={initialData} />;
}
