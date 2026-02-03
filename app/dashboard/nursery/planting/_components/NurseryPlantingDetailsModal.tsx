"use client";

import DetailModal, { InfoCard } from "../../../_components/UI/DetailModal";
import {
    CalendarOutlined,
    EnvironmentOutlined,
    ExperimentOutlined,
    QrcodeOutlined,
    HeartOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import Image from "next/image";

dayjs.extend(jalaliday);

interface NurseryPlantingDetailsModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: any;
}

export default function NurseryPlantingDetailsModal({
    open,
    setOpen,
    data
}: NurseryPlantingDetailsModalProps) {
    if (!data) return null;

    const onClose = () => setOpen(false);

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "—";
        return dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD");
    };

    // Translations
    const stageMap: Record<string, string> = {
        'Seedling': 'کاشت بذر',
        'Germination': 'جوانه‌زنی',
        'ReadyForGraft': 'آماده پیوند'
    };

    const healthMap: Record<string, string> = {
        'Healthy': 'سالم',
        'Sick': 'بیمار',
        'Recovering': 'در حال بهبود'
    };

    const qrCodeValue = data.SeedPackage?.QRCode ? (
        <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={data.SeedPackage.QRCode}
                alt="QR"
                className="w-10 h-10 object-contain rounded bg-white border border-slate-200"
            />
            <span className="font-mono text-xs">{data.SeedPackage.SerialNumber}</span>
        </div>
    ) : (
        <span className="font-mono">{data.SeedPackage?.SerialNumber || "—"}</span>
    );

    return (
        <DetailModal
            open={open}
            onClose={onClose}
            title="جزئیات کاشت نشاء"
            icon={<ExperimentOutlined />}
            gradientFrom="emerald"
            gradientTo="teal"
        >
            {/* وضعیت و سلامت */}
            <InfoCard
                title="وضعیت و سلامت"
                icon={<HeartOutlined />}
                color="#ef4444"
                items={[
                    { label: "مرحله فعلی", value: stageMap[data.CurrentStage] || data.CurrentStage },
                    { label: "وضعیت سلامت", value: healthMap[data.HealthStatus] || data.HealthStatus },
                    { label: "نرخ رشد", value: data.GrowthRate ? `${data.GrowthRate} از 10` : "—" },
                    { label: "شناسه نشاء", value: `#${data.NurserySeedID}` },
                ]}
            />

            {/* زمان‌بندی */}
            <InfoCard
                title="زمان‌بندی"
                icon={<CalendarOutlined />}
                color="#f59e0b"
                items={[
                    { label: "تاریخ کاشت", value: formatDate(data.PlantingDate) },
                    { label: "جوانه‌زنی (تخمینی)", value: formatDate(data.EmergenceDate) },
                    { label: "آماده پیوند (تخمینی)", value: formatDate(data.ReadyForGraftingDate) },
                ]}
            />

            {/* بسته بذر */}
            <InfoCard
                title="اطلاعات بسته بذر"
                icon={<QrcodeOutlined />}
                color="#10b981"
                items={[
                    { label: "کد/QR", value: qrCodeValue },
                    { label: "گونه گیاهی", value: data.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName },
                    { label: "بچ کد", value: data.SeedPackage?.SeedBatch?.BatchCode },
                    { label: "نوع بسته", value: data.SeedPackage?.PackageType },
                ]}
            />

            {/* اتاق نشاء */}
            <InfoCard
                title="اطلاعات اتاق نشاء"
                icon={<EnvironmentOutlined />}
                color="#3b82f6"
                items={[
                    { label: "نام اتاق", value: data.NurseryRoom?.NurseryRoomName },
                    { label: "کد اتاق", value: data.NurseryRoom?.NurseryRoomCode },
                    { label: "نوردهی", value: data.NurseryRoom?.LightType },
                    { label: "دما/رطوبت", value: `${data.NurseryRoom?.TemperatureMin || 0}° - ${data.NurseryRoom?.HumidityMin || 0}%` },
                ]}
            />

            {/* یادداشت‌ها / بیماری‌ها */}
            {(data.DiseaseObserved || data.Notes) && (
                <div className="md:col-span-2">
                    <InfoCard
                        title="مشاهدات و یادداشت‌ها"
                        icon={<InfoCircleOutlined />}
                        color="#64748b"
                        items={[
                            { label: "بیماری/مشکلات", value: data.DiseaseObserved || "موردی ثبت نشده", span: true },
                            ...(data.Notes ? [{ label: "یادداشت", value: data.Notes, span: true }] : [])
                        ]}
                    />
                </div>
            )}
        </DetailModal>
    );
}


