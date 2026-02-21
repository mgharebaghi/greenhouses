import { getAllGraftingOperations, getGraftingFormData } from "@/features/grafting/services/read";
import GraftingTable from "@/features/grafting/components/GraftingTable";
import PageHeader from "@/shared/components/PageHeader";
import { ToolOutlined } from "@ant-design/icons";

export default async function GraftingPage() {
    const operations = await getAllGraftingOperations();
    const formData = await getGraftingFormData();

    return (
        <div className="p-6">
            <PageHeader
                title="عملیات پیوند زنی"
                subtitle="مدیریت عملیات پیوند "
                icon={<ToolOutlined />}
            />
            <GraftingTable
                initialData={operations.data || []}
                formData={formData}
            />
        </div>
    );
}
