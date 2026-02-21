import { getStartSeedlingCycles, getOrdersForSelect, getGreenhousesForSelect } from "../services/read";
import StartSeedlingCycleTable from "./StartSeedlingCycleTable";
import PageHeader from "@/shared/components/PageHeader";
import { RetweetOutlined } from "@ant-design/icons";

export default async function StartSeedlingCyclePage() {
    const data = await getStartSeedlingCycles();
    const orders = await getOrdersForSelect();
    const greenhouses = await getGreenhousesForSelect();

    return (
        <div className="p-6">
            <PageHeader
                title="شروع سیکل نشاء"
                subtitle="مدیریت عملیات انتقال سینی‌ها به گلخانه"
                icon={<RetweetOutlined />}
            />
            <StartSeedlingCycleTable
                data={data}
                orders={orders}
                greenhouses={greenhouses}
            />
        </div>
    );
}
