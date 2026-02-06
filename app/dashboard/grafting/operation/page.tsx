import { getAllGraftingOperations, getGraftingOptions } from "@/app/lib/services/grafting/operation/read";
import ClientPage from "./_components/ClientPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'عملیات پیوند | داشبورد',
};

export default async function GraftingOperationPage() {
    // Parallel data fetching
    const [data, options] = await Promise.all([
        getAllGraftingOperations(),
        getGraftingOptions()
    ]);

    return (
        <ClientPage
            initialData={data}
            options={options}
        />
    );
}
