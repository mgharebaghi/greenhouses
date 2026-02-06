import type { Metadata } from "next";
import ClientPage from "./_components/ClientPage";

export const metadata: Metadata = {
    title: "نشاء پیوندی",
};

import { getAllGraftedSeedlings, getGraftingOperationOptions } from "@/app/lib/services/grafting/grafted-seedling/read";

export default async function Page() {
    const [initialData, options] = await Promise.all([
        getAllGraftedSeedlings(),
        getGraftingOperationOptions()
    ]);
    return <ClientPage initialData={initialData} options={options} />;
}
