"use client";

import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import { CopyOutlined, CheckCircleOutlined, UsergroupAddOutlined, BarcodeOutlined, ExperimentOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { RecoveryRoomListItem } from "../types";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";

interface RecoveryRoomDetailModalProps {
    open: boolean;
    onClose: () => void;
    data: RecoveryRoomListItem | null;
}

export default function RecoveryRoomDetailModal({ open, onClose, data }: RecoveryRoomDetailModalProps) {
    if (!data) return null;

    const op = data.Tbl_GraftingOperation;
    const customer = op?.Tbl_Orders?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People;
    const customerName = customer ? `${customer.FirstName} ${customer.LastName}` : "—";

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("fa-IR");
    };

    return (
        <DetailModal
            open={open}
            onClose={onClose}
            title={`جزئیات اتاق ریکاوری - ${op?.Tbl_Orders?.OrderCode || "—"}`}
            icon={<CheckCircleOutlined />}
            gradientFrom="orange"
            gradientTo="amber"
            width={850}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Right Side: Info Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* اطلاعات پایه */}
                        <InfoCard
                            title="اطلاعات سفارش"
                            icon={<ExperimentOutlined />}
                            color="#f59e0b"
                            items={[
                                { label: "کد سفارش", value: op?.Tbl_Orders?.OrderCode || "—" },
                                { label: "نام مشتری", value: customerName },
                                { label: "تعداد سینی", value: op?.TrayNumber ? op.TrayNumber.toLocaleString() : "—" },
                                { label: "تاریخ پیوند‌زنی", value: formatDate(op?.GraftingDate) },
                            ]}
                        />

                        {/* اطلاعات ریکاوری */}
                        <InfoCard
                            title="وضعیت ریکاوری"
                            icon={<CalendarOutlined />}
                            color="#10b981"
                            items={[
                                { label: "تاریخ ورود", value: formatDate(data.RecoveryEntryDate) },
                                { label: "تاریخ خروج", value: formatDate(data.RecoveryExitDate) },
                                {
                                    label: "مجموع کل تلفات",
                                    value: <span className="text-xl font-bold px-3 py-1 bg-rose-50 text-rose-500 rounded-lg">{data.GraftedLossCount || 0}</span>
                                },
                            ]}
                        />
                    </div>

                    {/* Left Side: Identity Card (QR + Codes) */}
                    {op?.OrderID && (
                        <div className="hidden md:flex flex-col items-center justify-center bg-white border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm w-full md:w-72 text-center order-first md:order-last">
                            <div className="mb-2">
                                <QRCodeCanvas value={`https://mygreenhouses.ir/public/scan/orders/${op.OrderID}`} size={160} />
                            </div>

                            <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-4 mb-1 dir-ltr font-mono tracking-tight">
                                {op.Tbl_Orders?.OrderCode || "—"}
                            </h4>
                            <span className="text-slate-400 dark:text-slate-500 text-sm font-medium bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                                شناسه سیستم: {data.ID}
                            </span>
                        </div>
                    )}
                </div>

                {/* Mobile View Identity (visible only on small screens) */}
                {op?.OrderID && (
                    <div className="md:hidden flex items-center justify-between bg-white border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                        <div>
                            <h4 className="text-lg font-bold text-slate-800">{op.Tbl_Orders?.OrderCode}</h4>
                            <span className="text-slate-400 text-xs text-rose-500">تلفات کل: {data.GraftedLossCount || 0}</span>
                        </div>
                        <QRCodeCanvas value={`https://mygreenhouses.ir/public/scan/orders/${op.OrderID}`} size={60} />
                    </div>
                )}

                {/* Workers List - Full Width */}
                {op?.Tbl_GraftWorkers && op.Tbl_GraftWorkers.length > 0 && (
                    <div className="w-full">
                        <InfoCard
                            title={`جزئیات تلفات به تفکیک پیوندزن (${op.Tbl_GraftWorkers.length} نفر)`}
                            icon={<UsergroupAddOutlined />}
                            color="#8b5cf6"
                            items={[
                                {
                                    label: "",
                                    value: (
                                        <div className="flex flex-col gap-2 w-full mt-2">
                                            {op.Tbl_GraftWorkers.map((worker, idx) => {
                                                const person = worker.Tbl_People;
                                                const fullName = person ? `${person.FirstName} ${person.LastName}` : "—";
                                                const nationalCode = person?.NationalCode || "—";

                                                return (
                                                    <div key={worker.ID} className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-xl text-sm border border-slate-100 dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm">
                                                                {idx + 1}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-800 dark:text-slate-200 font-bold">{fullName}</span>
                                                                <span className="text-slate-500 text-xs">کد ملی: <span className="font-mono">{nationalCode}</span></span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full mt-2 sm:mt-0 pl-2 sm:pl-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-600 pt-2 sm:pt-0">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-xs text-slate-500 mb-1">کد افراد</span>
                                                                <span className="font-mono font-bold text-slate-700 bg-white dark:bg-slate-800 px-3 py-1 rounded-md text-xs border border-slate-200 dark:border-slate-500">
                                                                    {person?.PersonCode || "—"}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col items-center border-r border-slate-200 dark:border-slate-600 pr-6">
                                                                <span className="text-xs text-rose-500 mb-1 font-semibold">تلفات فرد</span>
                                                                <span className="text-base font-black text-rose-600 bg-rose-50 dark:bg-rose-900/40 px-3 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800 shadow-sm">
                                                                    {worker.LossPerWorker || 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ),
                                    span: true
                                }
                            ]}
                        />
                    </div>
                )}
            </div>
        </DetailModal>
    );
}
