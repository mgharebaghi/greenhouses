"use client";

import { Modal, Button, Tooltip, Select } from "antd";
import { PrinterOutlined, CloseOutlined, QrcodeOutlined, DownloadOutlined, InfoCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { useRef, useEffect, useState } from "react";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import { useReactToPrint } from "react-to-print";
import { getOrderById } from "../services";

interface OrdersQRModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: any | null; // Partial or full order data
}

const LABEL_SIZES = [
    // Square Sizes
    { label: "۱۰ × ۱۰ میلی‌متر (مربعی کوچک)", value: "10mm 10mm" },
    { label: "۱۵ × ۱۵ میلی‌متر (مربعی)", value: "15mm 15mm" },
    { label: "۲۰ × ۲۰ میلی‌متر (مربعی)", value: "20mm 20mm" },
    { label: "۲۵ × ۲۵ میلی‌متر (مربعی استاندارد)", value: "25mm 25mm" },
    { label: "۳۰ × ۳۰ میلی‌متر (مربعی متوسط)", value: "30mm 30mm" },
    { label: "۳۵ × ۳۵ میلی‌متر", value: "35mm 35mm" },
    { label: "۴۰ × ۴۰ میلی‌متر (مربعی بزرگ)", value: "40mm 40mm" },
    { label: "۵۰ × ۵۰ میلی‌متر", value: "50mm 50mm" },
    // Standard Small Labels
    { label: "۲۰ × ۱۰ میلی‌متر", value: "20mm 10mm" },
    { label: "۲۵ × ۱۵ میلی‌متر", value: "25mm 15mm" },
    { label: "۳۰ × ۲۰ میلی‌متر", value: "30mm 20mm" },
    { label: "۳۵ × ۲۵ میلی‌متر", value: "35mm 25mm" },
    // Standard Medium Labels
    { label: "۴۰ × ۲۰ میلی‌متر", value: "40mm 20mm" },
    { label: "۴۰ × ۳۰ میلی‌متر", value: "40mm 30mm" },
    { label: "۴۰ × ۶۰ میلی‌متر", value: "40mm 60mm" },
    { label: "۴۵ × ۳۰ میلی‌متر", value: "45mm 30mm" },
    { label: "۵۰ × ۲۵ میلی‌متر", value: "50mm 25mm" },
    { label: "۵۰ × ۳۰ میلی‌متر", value: "50mm 30mm" },
    { label: "۵۰ × ۴۰ میلی‌متر", value: "50mm 40mm" },
    { label: "۵۵ × ۳۰ میلی‌متر", value: "55mm 30mm" },
    { label: "۶۰ × ۳۰ میلی‌متر", value: "60mm 30mm" },
    { label: "۶۰ × ۴۰ میلی‌متر", value: "60mm 40mm" },
    // Large Labels
    { label: "۷۰ × ۴۰ میلی‌متر", value: "70mm 40mm" },
    { label: "۷۰ × ۵۰ میلی‌متر", value: "70mm 50mm" },
    { label: "۸۰ × ۵۰ میلی‌متر", value: "80mm 50mm" },
    { label: "۱۰۰ × ۵۰ میلی‌متر", value: "100mm 50mm" },
    { label: "۱۰۰ × ۸۰ میلی‌متر (بزرگ)", value: "100mm 80mm" },
    { label: "۱۰۰ × ۱۵۰ میلی‌متر (لیبل پستی)", value: "100mm 150mm" },
];

const QR_LABLE_SIZE = [
    { label: "۱۰ × ۱۰ میلی‌متر", value: "10mm" },
    { label: "۲۰ × ۲۰ میلی‌متر", value: "20mm" },
    { label: "۳۰ × ۳۰ میلی‌متر", value: "30mm" },
    { label: "۴۰ × ۴۰ میلی‌متر", value: "40mm" },
    { label: "۵۰ × ۵۰ میلی‌متر", value: "50mm" },
    { label: "۶۰ × ۶۰ میلی‌متر", value: "60mm" },
    // گزینه تمام صفحه برای کسانی که حالت قبل را می‌خواهند
    { label: "تمام صفحه (Full)", value: "100%" },
];

export default function OrdersQRModal({ open, setOpen, data }: OrdersQRModalProps) {
    const [fullData, setFullData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [certificateSize, setCertificateSize] = useState("A5");
    const [labelSize, setLabelSize] = useState("40mm 40mm");
    const [qrSize, setQrSize] = useState("20mm");

    const certificateRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    // Calculate dynamic QR size for print
    // 1mm approx 3.78px. We generate at 8px per mm for high quality (approx 200 DPI).
    const getPrintQRSize = () => {
        const dimensions = labelSize.split(" ");
        const widthMm = parseInt(dimensions[0]);
        const heightMm = parseInt(dimensions[1] || dimensions[0]);
        const minMm = Math.min(widthMm, heightMm);
        return Math.max(minMm * 10, 150); // Minimum 150px
    };
    const printQrSize = getPrintQRSize();

    // Fetch full data when opening to ensure we have all relations (Rootstock names etc.)
    useEffect(() => {
        if (open && data?.ID) {
            setLoading(true);
            getOrderById(data.ID).then(res => {
                setFullData(res);
                setLoading(false);
            });
        }
    }, [open, data]);

    const handlePrintCertificate = useReactToPrint({
        contentRef: certificateRef,
        documentTitle: `Order-Certificate-${fullData?.OrderCode || ''}`,
    });

    const handlePrintLabel = useReactToPrint({
        contentRef: labelRef,
        documentTitle: `Order-Label-${fullData?.OrderCode || ''}`,
    });

    const handleDownloadQR = () => {
        const canvas = document.querySelector(".qr-code-canvas") as HTMLCanvasElement;
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `QR-${fullData?.OrderCode || "order"}.png`;
            link.href = url;
            link.click();
        }
    };

    const handleClose = () => {
        setOpen(false);
        setFullData(null);
    };

    if (!open) return null;

    const qrUrl = fullData?.ID ? `https://mygreenhouses.ir/public/scan/orders/${fullData.ID}` : "#";

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closeIcon={<CloseOutlined className="text-slate-400 hover:text-red-500 transition-colors" />}
            width={580}
            centered
            className="qr-modal font-iransans"
            styles={{
                content: {
                    borderRadius: "24px",
                    padding: "0",
                    overflow: "hidden"
                }
            }}
        >
            <div className="flex flex-col items-center p-8 bg-white min-h-[600px]">
                <h3 className="text-xl font-extrabold text-slate-800 mb-8 mt-2">گواهی دیجیتال سفارش</h3>

                {/* QR Display with Download */}
                <div className="relative group mb-8">
                    <div className="p-4 bg-white border-[3px] border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <QRCodeCanvas value={qrUrl} size={220} className="qr-code-canvas" />
                    </div>
                    <Tooltip title="دانلود تصویر QR">
                        <button
                            onClick={handleDownloadQR}
                            className="absolute -left-4 -bottom-4 w-12 h-12 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:scale-110 transition-all z-10 cursor-pointer"
                        >
                            <DownloadOutlined className="text-xl" />
                        </button>
                    </Tooltip>
                </div>

                {/* Data Display */}
                <div className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                        <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">کد سفارش</span>
                            <span className="text-sm font-bold text-slate-800 dir-ltr">{fullData?.OrderCode || "—"}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاریخ سفارش</span>
                            <span className="text-sm font-bold text-slate-800">
                                {fullData?.OrderDate ? new Date(fullData.OrderDate).toLocaleDateString("fa-IR") : "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مشتری</span>
                            <span className="text-sm font-bold text-slate-800 truncate" title={fullData?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People ? `${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}` : ""}>
                                {fullData?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People ? `${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}` : "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مدیر پروژه</span>
                            <span className="text-sm font-bold text-slate-800 truncate" title={fullData?.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People ? `${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}` : ""}>
                                {fullData?.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People ? `${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}` : "—"}
                            </span>
                        </div>

                        <div className="col-span-1 md:col-span-2 flex items-center justify-between bg-white/60 rounded-xl p-3 border border-slate-100">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">بذر پایه (Rootstock)</span>
                                <span className="text-sm font-bold text-slate-800">
                                    {fullData?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName || "—"}
                                </span>
                            </div>
                            <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>
                            <div className="flex flex-col gap-0.5 md:text-left">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">بذر پیوندک (Scion)</span>
                                <span className="text-sm font-bold text-slate-800">
                                    {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName || "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full mb-2">
                    {/* Certificate Row */}
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                            <Button
                                type="primary"
                                icon={<FileTextOutlined className="text-lg" />}
                                onClick={() => handlePrintCertificate && handlePrintCertificate()}
                                className="w-full h-14 text-base font-black bg-emerald-600 hover:!bg-emerald-500 shadow-xl shadow-emerald-100 rounded-2xl border-none flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                loading={loading}
                            >
                                چاپ گواهی دیجیتال (Full Page)
                            </Button>
                        </div>
                    </div>

                    {/* Label Row */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                    <label className="text-[11px] font-black uppercase tracking-wider">سایز کاغذ (برچسب)</label>
                                </div>
                                <Select
                                    value={labelSize}
                                    onChange={setLabelSize}
                                    options={LABEL_SIZES}
                                    className="w-full dir-rtl"
                                    popupClassName="dir-rtl font-iransans"
                                    size="large"
                                    popupMatchSelectWidth={false}
                                    showSearch
                                    placeholder="سایز کاغذ را انتخاب کنید"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                    <label className="text-[11px] font-black uppercase tracking-wider">سایز کد QR</label>
                                </div>
                                <Select
                                    value={qrSize}
                                    onChange={setQrSize}
                                    options={QR_LABLE_SIZE}
                                    className="w-full dir-rtl"
                                    popupClassName="dir-rtl font-iransans"
                                    size="large"
                                    popupMatchSelectWidth={false}
                                    showSearch
                                    placeholder="سایز QR را انتخاب کنید"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </div>
                        </div>

                        <Button
                            icon={<QrcodeOutlined className="text-lg" />}
                            onClick={() => handlePrintLabel && handlePrintLabel()}
                            className="w-full h-12 text-sm font-bold bg-slate-800 text-white border-none hover:!bg-slate-700 hover:!text-white shadow-lg shadow-slate-200 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            loading={loading}
                        >
                            چاپ برچسب (QR Code)
                        </Button>
                    </div>

                    {/* Compact Guide */}
                    {/* <div className="mt-8 w-full">
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-[11px] leading-5 text-amber-900 flex gap-2 items-start">
                            <InfoCircleOutlined className="mt-0.5 text-amber-600 shrink-0 text-base" />
                            <div>
                                <span className="font-bold text-amber-700 block mb-1 text-xs">نکته مهم برای چاپ صحیح:</span>
                                <ul className="list-disc list-inside marker:text-amber-400 space-y-1 opacity-90">
                                    <li>در پنجره پرینت (System Dialog)، گزینه <b className="font-mono">Paper Size</b> را دقیقاً هم‌اندازه برچسب انتخابی (مثلاً 10x10) تنظیم کنید.</li>
                                    <li>اگر سایز مورد نظر وجود نداشت، باید <b className="font-mono">User Defined Size</b> بسازید.</li>
                                    <li>گزینه <b className="font-mono">Headers & Footers</b> را خاموش و <b className="font-mono">Margins</b> را روی <b className="font-mono">None</b> بگذارید.</li>
                                </ul>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Hidden Print Components */}
                <div className="hidden">
                    {/* 1. Full Certificate (Premium Redesign) */}
                    <div ref={certificateRef} className="print-certificate dir-rtl font-iransans" style={{ direction: "rtl", fontFamily: "tahoma" }}>
                        <div className="cert-container flex flex-col justify-between h-full bg-white relative overflow-hidden">

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[100px] -z-10 opacity-60"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50 rounded-tr-[80px] -z-10 opacity-60"></div>

                            {/* Double Borders */}
                            <div className="absolute inset-4 border-2 border-slate-900 pointer-events-none"></div>
                            <div className="absolute inset-5 border border-slate-300 pointer-events-none"></div>

                            {/* --- Header Section --- */}
                            <div className="relative z-10 p-12 pb-6 border-b-2 border-slate-900 flex justify-between items-center bg-white/80">
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 mb-2">گواهی سفارش</h1>
                                    <p className="text-xl text-emerald-800 font-bold">فکور پیوند آریا</p>
                                    <div className="h-1 w-32 bg-emerald-600 mt-3 rounded-full"></div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-2 bg-white border-4 border-white shadow-xl rounded-xl">
                                        <QRCodeCanvas value={qrUrl} size={110} level="M" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 font-mono tracking-widest uppercase">{fullData?.OrderCode}</span>
                                </div>
                            </div>

                            {/* --- Main Content Section --- */}
                            <div className="flex-1 p-12 pt-8 relative z-10 overflow-hidden">

                                {/* Order Info Row */}
                                <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12">
                                    <div className="border-r-4 border-emerald-500 pr-4">
                                        <span className="text-xs text-slate-500 font-bold block mb-1">کد رهگیری سفارش:</span>
                                        <span className="text-2xl font-black text-slate-800 font-mono tracking-tighter">{fullData?.OrderCode || "—"}</span>
                                    </div>
                                    <div className="border-r-4 border-slate-400 pr-4">
                                        <span className="text-xs text-slate-500 font-bold block mb-1">تاریخ صدور گواهی:</span>
                                        <span className="text-2xl font-black text-slate-800">
                                            {fullData?.OrderDate ? new Date(fullData.OrderDate).toLocaleDateString("fa-IR") : "—"}
                                        </span>
                                    </div>
                                    <div className="border-r-4 border-slate-400 pr-4">
                                        <span className="text-xs text-slate-500 font-bold block mb-1">نام سفارش دهنده (مشتری):</span>
                                        <span className="text-2xl font-black text-slate-800">
                                            {fullData?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People ? `${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}` : "—"}
                                        </span>
                                    </div>
                                    <div className="border-r-4 border-slate-400 pr-4">
                                        <span className="text-xs text-slate-500 font-bold block mb-1">مدیر فنی پروژه:</span>
                                        <span className="text-2xl font-black text-slate-800">
                                            {fullData?.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People ? `${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}` : "—"}
                                        </span>
                                    </div>
                                </div>

                                {/* Section: Seed Details */}
                                <div className="grid grid-cols-1 gap-8 mt-4">
                                    {/* Rootstock Details */}
                                    <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-200 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
                                        <h2 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">۱</span>
                                            مشخصات بذر پایه (Rootstock)
                                        </h2>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <span className="text-xs text-slate-400 font-bold block">نام گیاه و واریته:</span>
                                                <span className="text-lg font-bold text-slate-800">
                                                    {fullData?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_plantVariety?.Tbl_Plants?.CommonName || ""} - {fullData?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName || "—"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-400 font-bold block">تولیدکننده / تامین‌کننده:</span>
                                                <span className="text-lg font-bold text-slate-800">
                                                    {fullData?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_suppliers ? (fullData.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage.Tbl_suppliers.CompanyName || `${fullData.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage.Tbl_suppliers.FirstName} ${fullData.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage.Tbl_suppliers.LastName}`) : "—"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-400 font-bold block">کد بسته: </span>
                                                <span className="text-lg font-bold text-slate-800 dir-ltr inline-block">
                                                    {fullData?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.SerialNumber || "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scion Details */}
                                    <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-200 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                                        <h2 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">۲</span>
                                            مشخصات بذر پیوندک (Scion)
                                        </h2>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div>
                                                <span className="text-xs text-slate-400 font-bold block">نام گیاه و واریته:</span>
                                                <span className="text-lg font-bold text-slate-800">
                                                    {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_plantVariety?.Tbl_Plants?.CommonName || ""} - {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName || "—"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-400 font-bold block">تولیدکننده / تامین‌کننده:</span>
                                                <span className="text-lg font-bold text-slate-800">
                                                    {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_suppliers ? (fullData.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage.Tbl_suppliers.CompanyName || `${fullData.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage.Tbl_suppliers.FirstName} ${fullData.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage.Tbl_suppliers.LastName}`) : "—"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-400 font-bold block">کد بسته:</span>
                                                <span className="text-lg font-bold text-slate-800 dir-ltr inline-block">
                                                    {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.SerialNumber || "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- Footer Section --- */}
                            <div className="relative z-10 p-12 pt-6 border-t-2 border-slate-900 bg-white/80 flex justify-between items-end">
                                <div className="max-w-md">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 italic">Official Document - Greenhouse Management System</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        این سند به منظور تایید اصالت فرآیند پیوند و مشخصات گیاهی سفارش فوق صادر گردیده است.
                                        برای پیگیری دیجیتال و مشاهده سوابق کامل تولید، کد QR فوق را اسکن نمایید.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-48 h-20 border-b-2 border-slate-300 border-dashed relative">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none -rotate-12">
                                            <span className="text-2xl font-black border-4 border-slate-900 p-2 rounded-xl">APPROVED</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-slate-600">مهر و امضای مدیریت مجموعه</span>
                                </div>
                            </div>
                        </div>

                        <style type="text/css" media="print">
                            {`
                        @media print { 
                            @page { 
                                size: ${certificateSize}; 
                                margin: 0; 
                            }
                            body { 
                                -webkit-print-color-adjust: exact; 
                                margin: 0; 
                                padding: 0; 
                                background: white;
                            }
                            .print-certificate { 
                                width: 100%; 
                                height: 100vh; 
                                box-sizing: border-box; 
                                background: white;
                                padding: 0;
                            }
                            .cert-container { 
                                width: 100%;
                                height: 100%;
                                position: relative;
                            }
                        }
                        `}
                        </style>
                    </div>

                    {/* 2. Small Label (Dynamic Size) */}
                    <div ref={labelRef} className="print-label flex flex-col items-center justify-center bg-white" style={{ width: "100%", height: "100%", overflow: "hidden", padding: "1mm" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 0 }}>
                                <QRCodeCanvas
                                    value={qrUrl}
                                    size={512} // Dynamically calculated high resolution
                                    level="L" // Lowest correction = Largest modules = Best for scanning small sizes
                                    margin={0} // No margin to maximize module size
                                    style={{
                                        width: qrSize,
                                        height: qrSize,
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                        imageRendering: "pixelated" // Critical for sharp edges on thermal printers
                                    }}
                                />
                            </div>
                            {/* کد سفارش زیر QR */}
                            {fullData?.OrderCode && (
                                <div style={{
                                    textAlign: "center",
                                    fontWeight: "900",
                                    color: "#1e293b",
                                    lineHeight: "1.2",
                                    marginTop: "0.5mm", // فاصله خیلی کم و ثابت
                                    width: "100%",
                                    fontSize: "8pt",
                                    whiteSpace: "nowrap"
                                }}>
                                    {fullData.OrderCode}
                                </div>
                            )}
                        </div>
                        {/* Fixed CSS to prevent multi-page print */}
                        <style type="text/css" media="print">
                            {`
                        @page { 
                            size: ${labelSize}; 
                            margin: 0; 
                        }
                        @media print {
                            html, body {
                                width: 100%;
                                height: 100%;
                                margin: 0 !important;
                                padding: 0 !important;
                                overflow: hidden;
                            }
                            .print-label {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                page-break-inside: avoid;
                                page-break-after: avoid;
                                page-break-before: avoid;
                            }
                        }
                        `}
                        </style>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// function PrintRow({ label, value }: { label: string; value: any }) {
//     return (
//         <div className="flex border-b border-dotted border-gray-400 pb-1 mb-1">
//             <span className="font-bold ml-2">{label}:</span>
//             <span>{value || "—"}</span>
//         </div>
//     );
// }
