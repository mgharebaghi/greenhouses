"use client";
import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import {
    ExperimentOutlined,
    DashboardOutlined,
    CalendarOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";

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
            {/* Header / QR Section */}
            <div className="flex justify-between items-start mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{data.SerialNumber}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">شناسه سیستم: {data.ID}</p>
                </div>
                {data.ID && (
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <QRCodeCanvas value={`https://mygreenhouses.ir/public/scan/seed-package/${data.ID}`} size={128} />
                    </div>
                )}
            </div>

            {/* اطلاعات کلی */}
            <InfoCard
                title="اطلاعات محصول"
                icon={<DashboardOutlined />}
                color="#10b981"
                items={[
                    { label: "تولید کننده", value: data.ProducerName },
                    { label: "گونه گیاهی", value: data.VarietyName },
                    { label: "نوع بسته", value: data.PackageType },
                    { label: "تعداد بذر", value: data.SeedCount ? `${data.SeedCount} عدد` : "—" },
                    { label: "وزن", value: data.WeightGram ? `${data.WeightGram} گرم` : "—" },
                ]}
            />

            {/* کنترل کیفیت */}
            <InfoCard
                title="کنترل کیفیت"
                icon={<SafetyCertificateOutlined />}
                color="#f59e0b"
                items={[
                    { label: "درصد جوانه زنی", value: data.GerminationRate ? `${data.GerminationRate} %` : "—" },
                    { label: "درصد خلوص", value: data.PurityPercent ? `${data.PurityPercent} %` : "—" },
                    { label: "درجه کیفی", value: data.QualityGrade },
                    { label: "وضعیت گواهی", value: data.IsCertified ? "تایید شده" : "تایید نشده" },
                ]}
            />

            {/* تاریخ‌ها و خط تولید */}
            <InfoCard
                title="اطلاعات تولید"
                icon={<CalendarOutlined />}
                color="#3b82f6"
                items={[
                    { label: "تاریخ تولید", value: formatDate(data.ProductionDate) },
                    { label: "تاریخ بسته بندی", value: formatDate(data.PackagingDate) },
                    { label: "تاریخ انقضا", value: formatDate(data.ExpirationDate) },
                    { label: "خط بسته بندی", value: data.PackagingLine },
                ]}
            />
        </DetailModal>
    );
}
