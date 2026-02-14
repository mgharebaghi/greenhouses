"use client";

import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import {
    ShoppingOutlined,
    UserOutlined,
    SolutionOutlined,
    ExperimentOutlined,
} from "@ant-design/icons";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";

interface OrdersDetailModalProps {
    open: boolean;
    onClose: () => void;
    data: any | null;
}

export default function OrdersDetailModal({ open, onClose, data }: OrdersDetailModalProps) {
    if (!data) return null;

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("fa-IR");
    };

    const rootstockIdx = data.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage;
    const scionIdx = data.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage;

    const getSeedInfo = (pkg: any) => {
        if (!pkg) return { variety: "—", producer: "—", packageCode: "—" };
        const variety = pkg.Tbl_plantVariety?.VarietyName || "—";
        const plant = pkg.Tbl_plantVariety?.Tbl_Plants?.CommonName || "";
        const producer = pkg.ProducerCompany || (pkg.Tbl_suppliers ? (pkg.Tbl_suppliers.Legal ? pkg.Tbl_suppliers.CompanyName : `${pkg.Tbl_suppliers.FirstName} ${pkg.Tbl_suppliers.LastName}`) : "—");

        return {
            variety: plant ? `${plant} - ${variety}` : variety,
            producer,
            packageCode: pkg.SerialNumber || String(pkg.ID)
        };
    };

    const rootstock = getSeedInfo(rootstockIdx);
    const scion = getSeedInfo(scionIdx);

    return (
        <DetailModal
            open={open}
            onClose={onClose}
            title="جزئیات سفارش"
            icon={<ShoppingOutlined />}
            gradientFrom="emerald"
            gradientTo="teal"
            width={800} // Ensuring enough width for the new layout
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* Right Side: Info Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* اطلاعات سفارش */}
                    <InfoCard
                        title="اطلاعات سفارش"
                        icon={<ShoppingOutlined />}
                        color="#10b981"
                        items={[
                            { label: "تعداد سفارش", value: data.OrderCount ? `${data.OrderCount.toLocaleString()} عدد` : "—" },
                            { label: "تاریخ ثبت", value: formatDate(data.OrderDate) },
                        ]}
                    />

                    {/* افراد مرتبط */}
                    <InfoCard
                        title="افراد مرتبط"
                        icon={<UserOutlined />}
                        color="#3b82f6"
                        items={[
                            {
                                label: "مشتری",
                                value: data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People
                                    ? `${data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${data.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}`
                                    : "—"
                            },
                            {
                                label: "مدیر پروژه",
                                value: data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People
                                    ? `${data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${data.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}`
                                    : "—"
                            },
                            {
                                label: "نام مجری",
                                value: data.Tbl_suppliers
                                    ? (data.Tbl_suppliers.Legal ? data.Tbl_suppliers.CompanyName : `${data.Tbl_suppliers.FirstName} ${data.Tbl_suppliers.LastName}`)
                                    : "—"
                            },
                        ]}
                    />

                    {/* بذر پایه */}
                    <InfoCard
                        title="بذر پایه (Rootstock)"
                        icon={<ExperimentOutlined />}
                        color="#f59e0b"
                        items={[
                            { label: "کد بسته", value: rootstock.packageCode },
                            { label: "واریته - رقم", value: rootstock.variety },
                            { label: "تولید کننده", value: rootstock.producer },
                        ]}
                    />

                    {/* بذر پیوندک */}
                    <InfoCard
                        title="بذر پیوندک (Scion)"
                        icon={<ExperimentOutlined />}
                        color="#8b5cf6"
                        items={[
                            { label: "کد بسته", value: scion.packageCode },
                            { label: "واریته - رقم", value: scion.variety },
                            { label: "تولید کننده", value: scion.producer },
                        ]}
                    />
                </div>

                {/* Left Side: Identity Card (QR + Codes) */}
                <div className="hidden md:flex flex-col items-center justify-center bg-white border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm w-full md:w-72 text-center order-first md:order-last">
                    <div className="mb-2">
                        <QRCodeCanvas value={`https://mygreenhouses.ir/public/scan/orders/${data.ID}`} size={160} />
                    </div>

                    <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-4 mb-1 dir-ltr font-mono tracking-tight">
                        {data.OrderCode}
                    </h4>
                    <span className="text-slate-400 dark:text-slate-500 text-sm font-medium bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                        شناسه سیستم: {data.ID}
                    </span>
                </div>

                {/* Mobile View Identity (visible only on small screens) */}
                <div className="md:hidden flex items-center justify-between bg-white border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm mb-2">
                    <div>
                        <h4 className="text-lg font-bold text-slate-800">{data.OrderCode}</h4>
                        <span className="text-slate-400 text-xs">شناسه: {data.ID}</span>
                    </div>
                    <QRCodeCanvas value={`https://mygreenhouses.ir/public/scan/orders/${data.ID}`} size={60} />
                </div>
            </div>
        </DetailModal>
    );
}
