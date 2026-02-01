import SeedBatches from "./_components/Main";
import { getAllSeedBatches } from "@/app/lib/services/seedBatch";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "مدیریت تولید بذر",
};

export default async function SeedProductionPage() {
    const initialData = await getAllSeedBatches();

    return <SeedBatches initialData={initialData} />;
}
