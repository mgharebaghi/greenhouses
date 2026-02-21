"use client";

import { useEffect, useState } from "react";
import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import { GraftingOperationWithDetails } from "../types";
import {
    CalendarOutlined,
    UserOutlined,
    ExperimentOutlined,
    HistoryOutlined,
    BarcodeOutlined,
    ToolOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";

interface Props {
    open: boolean;
    onCancel: () => void;
    record: GraftingOperationWithDetails | null;
}

export default function GraftingDetailModal({ open, onCancel, record }: Props) {

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "---";
        return new DateObject(date).convert(persian, persian_fa).format("YYYY/MM/DD");
    };

    if (!record) return null;

    return (
        <DetailModal
            open={open}
            onClose={onCancel}
            title={`جزئیات عملیات پیوند - ${record.Tbl_Orders?.OrderCode || ""}`}
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
                        { label: "نام تکنسین", value: record.Tbl_People ? `${record.Tbl_People.FirstName} ${record.Tbl_People.LastName}` : "---" },
                        { label: "تعداد کارگران", value: `${record.Tbl_GraftWorkers.length} نفر` },
                        { label: "تاریخ پیوند", value: formatDate(record.GraftingDate) },
                        { label: "تاریخ خروج سردخانه", value: formatDate(record.ColdRoomExitDate) },
                    ]}
                />

                {/* Tray & Bed Info */}
                <InfoCard
                    title="مشخصات کشت"
                    icon={<ExperimentOutlined />}
                    color="#0ea5e9"
                    items={[
                        { label: "تعداد سینی", value: record.TrayNumber?.toLocaleString() || "---" },
                        { label: "تعداد حفره", value: record.CellPerTrayNumber?.toLocaleString() || "---" },
                        { label: "ارتفاع حفره", value: `${record.CellHeight} cm` },
                        { label: "جنس سینی", value: record.TrayMaterial },
                        { label: "بستر کشت", value: record.PlantingBed },
                        { label: "نسبت مخلوط", value: record.PlantingBedRatio ? record.PlantingBedRatio.toString() : "---" },
                    ]}
                />

                {/* Tools Info */}
                <InfoCard
                    title="ابزار و تجهیزات"
                    icon={<ToolOutlined />}
                    color="#f59e0b"
                    items={[
                        { label: "نوع گیره", value: record.GraftingClamp },
                        { label: "نوع قیم (Stick)", value: record.GraftingStick },
                    ]}
                />
                {/* QR Code (If available) */}
                {record.Tbl_Orders ? (
                    <InfoCard
                        title="کد QR سفارش"
                        icon={<BarcodeOutlined />}
                        color="#64748b"
                        items={[
                            {
                                label: "",
                                value: (
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-1 rounded-lg border border-slate-200">
                                            <QRCodeCanvas value={`https://mygreenhouses.ir/public/scan/orders/${record.Tbl_Orders.ID}`} size={64} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 mb-1">کد رهگیری:</span>
                                            <span className="font-mono font-bold text-slate-700 text-lg">
                                                {record.Tbl_Orders?.OrderCode}
                                            </span>
                                        </div>
                                    </div>
                                ),
                                span: true
                            }
                        ]}
                    />
                ) : (
                    <div></div>
                )}


                {/* Workers List - Full Width */}
                <div className="md:col-span-2">
                    <InfoCard
                        title={`لیست پیوند‌زنان (${record.Tbl_GraftWorkers.length} نفر)`}
                        icon={<UsergroupAddOutlined />}
                        color="#8b5cf6"
                        items={[
                            {
                                label: "",
                                value: (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mt-2">
                                        {record.Tbl_GraftWorkers.map((w, idx) => (
                                            <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 px-3 py-2.5 rounded-xl text-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-slate-700 dark:text-slate-200 font-medium">{w.Tbl_People?.FirstName} {w.Tbl_People?.LastName}</span>
                                                </div>
                                                <span className="font-mono text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs border border-slate-200 dark:border-slate-600">{w.Tbl_People?.PersonCode}</span>
                                            </div>
                                        ))}
                                    </div>
                                ),
                                span: true
                            }
                        ]}
                    />
                </div>
            </div>
        </DetailModal>
    );
}
