"use client";

import DetailModal, { InfoCard } from "../../../_components/UI/DetailModal";
import {
    CalendarOutlined,
    ExperimentOutlined,
    InfoCircleOutlined,
    NumberOutlined,
    CheckCircleOutlined,
    IdcardOutlined,
    DeploymentUnitOutlined,
    SafetyCertificateOutlined,
    EditOutlined,
    BranchesOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

interface GraftingOperationDetailsModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: any;
}

export default function GraftingOperationDetailsModal({
    open,
    setOpen,
    data
}: GraftingOperationDetailsModalProps) {
    if (!data) return null;

    const onClose = () => setOpen(false);

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "—";
        return dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD");
    };

    const methodMap: Record<string, string> = {
        'Hole Insertion': 'پیوند حفره‌ای',
        'Tongue Approach': 'پیوند نیم‌نیم',
        'Splice': 'پیوند اسپلایس',
        'Other': 'سایر'
    };

    const statusMap: Record<string, string> = {
        'Success': 'موفق',
        'Failure': 'ناموفق',
        'Partial': 'نسبی',
        'Pending': 'در انتظار',
        'Unknown': 'نامشخص'
    };

    return (
        <DetailModal
            open={open}
            onClose={onClose}
            title="جزئیات عملیات پیوند"
            icon={<ExperimentOutlined />}
            gradientFrom="purple"
            gradientTo="indigo"
        >
            {/* ستون اول: مشخصات و نتایج */}
            <div className="flex flex-col gap-4">
                <InfoCard
                    title="مشخصات عملیات"
                    icon={<IdcardOutlined />}
                    color="#3b82f6"
                    items={[
                        { label: "شناسه پیوند", value: `#${data.GraftingID}` },
                        { label: "روش پیوند", value: methodMap[data.GraftingMethod] || data.GraftingMethod || "—" },
                        { label: "مجری", value: data.OperatorName || "—" },
                        { label: "تعداد کل", value: data.GraftedNumber || "—" },
                        { label: "تعداد موفق", value: data.SucceedGrafted || "—" },
                    ]}
                />

                <InfoCard
                    title="نتایج و وضعیت"
                    icon={<SafetyCertificateOutlined />}
                    color="#10b981"
                    items={[
                        { label: "نرخ موفقیت", value: data.SuccessRate ? `${data.SuccessRate}%` : "—" },
                        { label: "نتیجه اولیه", value: statusMap[data.InitialResult] || data.InitialResult || "—" },
                        { label: "نتیجه نهایی", value: statusMap[data.FinalResult] || data.FinalResult || "—" },
                        { label: "دوره نقاهت", value: data.RecoveryPeriodDays ? `${data.RecoveryPeriodDays} روز` : "—" },
                    ]}
                />
            </div>

            {/* ستون دوم: اجزای گیاهی و یادداشت */}
            <div className="flex flex-col gap-4">
                <InfoCard
                    title="اجزای گیاهی"
                    icon={<BranchesOutlined />}
                    color="#f59e0b"
                    items={[
                        {
                            label: "نشاء",
                            value: `#${data.NurserySeedID} - ${data.NurserySeed?.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName || '—'}`
                        },
                        {
                            label: "پایه",
                            value: `#${data.RootstockID} - ${data.RootStockPlant?.PlantVarities?.VarietyName || '—'}`
                        },
                    ]}
                />

                {data.GraftNotes && (
                    <InfoCard
                        title="یادداشت‌ها"
                        icon={<EditOutlined />}
                        color="#64748b"
                        items={[
                            { label: "توضیحات", value: data.GraftNotes, span: true }
                        ]}
                    />
                )}
            </div>
        </DetailModal>
    );
}
