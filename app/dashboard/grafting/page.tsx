import { getAllGraftingOperations, getGraftingFormData } from "@/features/grafting/services/read";
import GraftingTable from "@/features/grafting/components/GraftingTable";

export default async function GraftingPage() {
    const operations = await getAllGraftingOperations();
    const formData = await getGraftingFormData();

    return (
        <div>
            <GraftingTable
                initialData={operations.data || []}
                formData={formData}
            />
        </div>
    );
}
