import {
  getAllGraftingOperations,
  getGraftingFormData,
} from "@/features/grafting/actions";
import GraftingTable from "@/features/grafting/components/GraftingTable";
import PageHeader from "@/shared/components/PageHeader";
import { ToolOutlined } from "@ant-design/icons";

export default async function GraftingPage() {
  const operations = await getAllGraftingOperations();
  if (operations.status === "error") throw new Error(operations.message);
  const formData = await getGraftingFormData();

  return (
    <div className="dashboard-page">
      <PageHeader
        title="عملیات پیوند زنی"
        subtitle="مدیریت عملیات پیوند "
        icon={<ToolOutlined />}
      />
      <GraftingTable initialData={operations.data || []} formData={formData} />
    </div>
  );
}
