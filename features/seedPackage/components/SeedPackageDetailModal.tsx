"use client";
import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import {
    ExperimentOutlined,
    DashboardOutlined,
    CalendarOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";

interface SeedPackageDetailModalProps {
    open: boolean;
    onClose: () => void;
    data: any | null;
}

export default function SeedPackageDetailModal({ open, onClose, data }: SeedPackageDetailModalProps) {
    if (!data) return null;

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("fa-IR");
    };

    return (
        <DetailModal
            open={open}
            onClose={onClose}
            title="جزئیات بسته بذر"
            icon={<ExperimentOutlined />}
            gradientFrom="emerald"
            gradientTo="teal"
        >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{data.SerialNumber}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">شناسه سیستم: {data.ID}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* اطلاعات محصول */}
                <InfoCard
                    title="اطلاعات محصول"
                    icon={<DashboardOutlined />}
                    color="#10b981"
                    items={[
                        {
                            label: "تامین کننده",
                            value: data.Tbl_suppliers
                                ? (data.Tbl_suppliers.Legal ? data.Tbl_suppliers.CompanyName : `${data.Tbl_suppliers.FirstName} ${data.Tbl_suppliers.LastName}`)
                                : "—"
                        },
                        { label: "شرکت تولیدی", value: data.ProducerCompany },
                        { label: "واریته", value: data.Tbl_plantVariety?.VarietyName || "—" },
                        { label: "نوع بسته", value: data.PackageType },
                    ]}
                />

                {/* کنترل کیفیت */}
                <InfoCard
                    title="کنترل کیفیت"
                    icon={<SafetyCertificateOutlined />}
                    color="#f59e0b"
                    items={[
                        { label: "نرخ جوانه زنی", value: data.GerminationRate ? `${data.GerminationRate} %` : "—" },
                        { label: "درصد خلوص", value: data.PurityPercent ? `${data.PurityPercent} %` : "—" },
                        { label: "درجه کیفی", value: data.QualityGrade },
                        { label: "گواهی کیفیت", value: data.IsCertified ? "تایید شده" : "تایید نشده" },
                    ]}
                />

                {/* مقادیر و بسته‌بندی */}
                <InfoCard
                    title="مقادیر و بسته‌بندی"
                    icon={<ExperimentOutlined />}
                    color="#8b5cf6"
                    items={[
                        { label: "تعداد کل بسته‌ها", value: data.PackageNumber ? `${data.PackageNumber.toLocaleString()} عدد` : "—" },
                        { label: "تعداد بذر در بسته", value: data.SeedCount ? `${data.SeedCount.toLocaleString()} عدد` : "—" },
                        { label: "وزن هر بسته", value: data.WeightGram ? `${data.WeightGram} گرم` : "—" },
                    ]}
                />

                {/* تاریخ‌های مهم */}
                <InfoCard
                    title="اطلاعات زمان‌بندی"
                    icon={<CalendarOutlined />}
                    color="#3b82f6"
                    items={[
                        { label: "تاریخ تولید", value: formatDate(data.ProductionDate) },
                        { label: "تاریخ بسته بندی", value: formatDate(data.PackagingDate) },
                        { label: "تاریخ انقضا", value: formatDate(data.ExpirationDate) },
                    ]}
                />
            </div>

        </DetailModal>
    );
}
