"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import { StartSeedlingCycle } from "../types";
import {
    CalendarOutlined,
    NumberOutlined,
    HomeOutlined,
    BarcodeOutlined,
    ExperimentOutlined,
    HistoryOutlined
} from "@ant-design/icons";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface Props {
    open: boolean;
    onCancel: () => void;
    record: StartSeedlingCycle | null;
}

export default function StartSeedlingCycleDetailModal({ open, onCancel, record }: Props) {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "---";
        return new DateObject(date).convert(persian, persian_fa).format("YYYY/MM/DD");
    };

    useEffect(() => {
        if (record && record.OrderID) {
            const qrContent = `https://mygreenhouses.ir/public/scan/orders/${record.OrderID}`;
            QRCode.toDataURL(qrContent, { width: 200, margin: 1, color: { dark: "#000000", light: "#ffffff" } })
                .then((url) => {
                    setQrCodeUrl(url);
                })
                .catch((err) => {
                    console.error("QR Generation Error", err);
                    setQrCodeUrl(null);
                });
        } else {
            setQrCodeUrl(null);
        }
    }, [record]);

    if (!record) return null;

    return (
        <DetailModal
            open={open}
            onClose={onCancel}
            title={`جزئیات سیکل نشاء - ${record.Tbl_Orders?.OrderCode || ""}`}
            icon={<ExperimentOutlined />}
            gradientFrom="emerald"
            gradientTo="teal"
            width={850}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* General Info */}
                <InfoCard
                    title="اطلاعات پایه و سفارش"
                    icon={<BarcodeOutlined />}
                    color="#10b981"
                    items={[
                        { label: "کد سفارش", value: record.Tbl_Orders?.OrderCode || "---" },
                        { label: "نوع بذر", value: record.SeedType === null ? "---" : (record.SeedType ? "پیوندک" : "پایه") },
                        {
                            label: "نام واریته",
                            value: record.SeedType === null
                                ? "---"
                                : (record.SeedType
                                    ? record.Tbl_Orders?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName
                                    : record.Tbl_Orders?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName) || "---"
                        },
                        { label: "گلخانه (نرسری)", value: record.Tbl_Greenhouses?.GreenhouseName || "---" },
                        { label: "نام سالن", value: record.SalonName || "---" },
                        { label: "تعداد سینی", value: record.NumberOfTrays?.toLocaleString() || "---" },
                    ]}
                />

                {/* Dates & Timeline */}
                <InfoCard
                    title="تاریخ‌ها و زمان‌بندی"
                    icon={<CalendarOutlined />}
                    color="#0ea5e9"
                    items={[
                        { label: "تاریخ خروج از اتاق جوانه زنی", value: formatDate(record.GerminationRoomExitDate) },
                        { label: "تاریخ ورود به گلخانه-نرسری", value: formatDate(record.GreenhouseEntryDate) },
                        { label: "تاریخ خروج از اتاق نرسری", value: formatDate(record.GreenhouseExitDate) },
                    ]}
                />

                {/* Losses & Stats */}
                <InfoCard
                    title="آمار و تلفات"
                    icon={<HistoryOutlined />}
                    color="#f43f5e"
                    items={[
                        { label: "تعداد تلفات بعد از خروج از اتاق جوانه زنی", value: record.NumberOfLostSeedlingFromGermination?.toLocaleString() || "0" },
                        { label: "تعداد تلفات بعد از خروج از گلخانه", value: record.NumberOfLostSeedlingFromGreenhouse?.toLocaleString() || "0" },
                        // { label: "تاریخ ایجاد رکورد", value: "---" }, // Assuming system fields might be added later
                    ]}
                />

                {/* QR Code */}
                {qrCodeUrl && (
                    <InfoCard
                        title="کد QR سفارش"
                        icon={<BarcodeOutlined />}
                        color="#8b5cf6"
                        items={[
                            {
                                label: "",
                                value: (
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <div className="bg-white p-2 rounded-xl border-2 border-slate-200 shadow-sm">
                                            <img
                                                src={qrCodeUrl}
                                                alt="Order QR Code"
                                                className="w-32 h-32 object-contain"
                                                style={{ imageRendering: "pixelated" }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-slate-500 mt-2 bg-slate-100 px-2 py-0.5 rounded">
                                            {record.Tbl_Orders?.OrderCode}
                                        </span>
                                    </div>
                                ),
                                span: true
                            }
                        ]}
                    />
                )}

            </div>
        </DetailModal>
    );
}
