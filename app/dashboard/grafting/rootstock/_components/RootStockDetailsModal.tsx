"use client";

import DetailModal, { InfoCard } from "../../../_components/UI/DetailModal";
import {
    CalendarOutlined,
    ExperimentOutlined,
    HeartOutlined,
    InfoCircleOutlined,
    UserOutlined,
    BarcodeOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

interface RootStockDetailsModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: any;
}

export default function RootStockDetailsModal({
    open,
    setOpen,
    data
}: RootStockDetailsModalProps) {
    if (!data) return null;

    const onClose = () => setOpen(false);

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "—";
        return dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD");
    };

    // Translations
    const stageMap: Record<string, string> = {
        'Seedling': 'نشاء',
        'Growing': 'در حال رشد',
        'ReadyToGraft': 'آماده پیوند'
    };

    const healthMap: Record<string, string> = {
        'Healthy': 'سالم',
        'Sick': 'بیمار',
        'Recovering': 'در حال بهبود'
    };

    // Helper for Supplier Name logic (consistent with Table/Dropdown)
    const getSupplierName = (s: any) => {
        if (!s) return "—";
        const companyName = s.CompanyName ? s.CompanyName.toString().trim() : "";
        const fullName = `${s.FirstName || ''} ${s.LastName || ''}`.trim();
        const isValidCompany = companyName.length > 0 && companyName !== '-';
        return isValidCompany ? companyName : (fullName.length > 0 ? fullName : "—");
    };

    return (
        <DetailModal
            open={open}
            onClose={onClose}
            title="جزئیات گیاه پایه"
            icon={<ExperimentOutlined />}
            gradientFrom="emerald"
            gradientTo="teal"
        >
            {/* وضعیت و سلامت */}
            <InfoCard
                title="مشخصات ظاهری و وضعیت"
                icon={<HeartOutlined />}
                color="#ef4444"
                items={[
                    { label: "مرحله رشد", value: stageMap[data.GrowthStage] || data.GrowthStage },
                    { label: "وضعیت سلامت", value: healthMap[data.HealthStatus] || data.HealthStatus },
                    { label: "قطر ساقه", value: data.StemDiameter ? `${data.StemDiameter} mm` : "—" },
                    { label: "شناسه", value: `#${data.RootstockID}` },
                ]}
            />

            {/* اطلاعات پایه */}
            <InfoCard
                title="اطلاعات شناسایی"
                icon={<BarcodeOutlined />}
                color="#3b82f6"
                items={[
                    { label: "گونه گیاهی", value: data.PlantVarities?.VarietyName || "—" },
                    { label: "کد بچ", value: data.BatchCode || "—" },
                ]}
            />

            {/* تامین کننده و زمان */}
            <InfoCard
                title="تامین و تولید"
                icon={<UserOutlined />}
                color="#f59e0b"
                items={[
                    { label: "تامین کننده", value: getSupplierName(data.Suppliers) },
                    { label: "تاریخ تولید", value: formatDate(data.ProductionDate) },
                ]}
            />
        </DetailModal>
    );
}
