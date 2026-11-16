import {
  getAllGraftingOperations,
  getGraftingFormData,
} from "@/features/grafting/actions";
import GraftingTable from "@/features/grafting/components/GraftingTable";

export default async function GraftingPage() {
  const operations = await getAllGraftingOperations();
  if (operations.status === "error") throw new Error(operations.message);
  const formData = await getGraftingFormData();

  return (
    <div className="dashboard-page">
      <GraftingTable initialData={operations.data || []} formData={formData} />
    </div>
  );
}
