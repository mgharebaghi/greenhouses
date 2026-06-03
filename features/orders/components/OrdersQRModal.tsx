"use client";

import { Modal, Button, Tooltip, Select } from "antd";
import { CloseOutlined, QrcodeOutlined, DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import { useRef, useEffect, useState } from "react";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import { useReactToPrint } from "react-to-print";
import { getOrderById } from "../services";

interface OrdersQRModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: any | null;
}

const LABEL_SIZES = [
    { label: "تنظیمات پرینتر ", value: "auto" },
    { label: "۱۰ × ۱۰ میلی‌متر (مربعی کوچک)", value: "10mm 10mm" },
    { label: "۱۵ × ۱۵ میلی‌متر (مربعی)", value: "15mm 15mm" },
    { label: "۲۰ × ۲۰ میلی‌متر (مربعی)", value: "20mm 20mm" },
    { label: "۲۵ × ۲۵ میلی‌متر (مربعی استاندارد)", value: "25mm 25mm" },
    { label: "۳۰ × ۳۰ میلی‌متر (مربعی متوسط)", value: "30mm 30mm" },
    { label: "۳۵ × ۳۵ میلی‌متر", value: "35mm 35mm" },
    { label: "۴۰ × ۴۰ میلی‌متر (مربعی بزرگ)", value: "40mm 40mm" },
    { label: "۵۰ × ۵۰ میلی‌متر", value: "50mm 50mm" },
    { label: "۲۰ × ۱۰ میلی‌متر", value: "20mm 10mm" },
    { label: "۲۵ × ۱۵ میلی‌متر", value: "25mm 15mm" },
    { label: "۳۰ × ۲۰ میلی‌متر", value: "30mm 20mm" },
    { label: "۳۵ × ۲۵ میلی‌متر", value: "35mm 25mm" },
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
    { label: "تمام صفحه (Full)", value: "100%" },
];

const PLANT_TYPE_OPTIONS = [
    { label: "—  (بدون انتخاب)", value: "" },
    { label: "گیاه پایه (Root Stock)", value: "rootstock" },
    { label: "پیوندک (Scion)", value: "scion" },
    { label: "نشاء پیوندی (Grafted)", value: "grafted" },
];

function parseLabelSize(value: string): { width: string; height: string } {
    if (value === "auto") return { width: "100mm", height: "100mm" };
    const parts = value.trim().split(/\s+/);
    if (parts.length === 2) return { width: parts[0], height: parts[1] };
    return { width: parts[0], height: parts[0] };
}

export default function OrdersQRModal({ open, setOpen, data }: OrdersQRModalProps) {
    const [fullData, setFullData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [labelSize, setLabelSize] = useState("auto");
    const [qrSize, setQrSize] = useState("100%");
    const [plantType, setPlantType] = useState<string>("");

    const certificateRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

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
        pageStyle: `
            @page { size: A4 portrait; margin: 0; }
            @media print { 
                body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; background: white; }
            }
        `
    });

    const { width: labelW, height: labelH } = parseLabelSize(labelSize);

    const handlePrintLabel = useReactToPrint({
        contentRef: labelRef,
        documentTitle: `Order-Label-${fullData?.OrderCode || ''}`,
        pageStyle: `
            @page { 
                size: ${labelSize === "auto" ? "auto" : `${labelW} ${labelH}`};
                margin: 0; 
            }
            @media print {
                html, body {
                    width: 100%;
                    height: 100%;
                    margin: 0 !important;
                    padding: 0 !important;
                    -webkit-print-color-adjust: exact;
                }
                .print-label-wrapper {
                    position: fixed !important;
                    inset: 0 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    width: 100% !important;
                    height: 100% !important;
                }
            }
        `
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

    const qrUrl = fullData?.ID
        ? `https://mygreenhouses.ir/public/scan/orders/${fullData.ID}`
        : "#";

    const qrFontSize = qrSize === "100%"
        ? "10px"
        : `calc(${qrSize} * 0.14)`;

    const qrCodeWidth = qrSize === "100%" ? "100%" : qrSize;

    // Label text shown under QR in print: OrderCode + (R) or (S) if plantType is selected
    const printOrderLabel = fullData?.OrderCode
        ? plantType
            ? `${fullData.OrderCode} (${plantType === "rootstock" ? "R" : plantType === "scion" ? "S" : "G"})`
            : fullData.OrderCode
        : "";

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
                content: { borderRadius: "24px", padding: "0", overflow: "hidden" }
            }}
        >
            <div className="flex flex-col items-center p-8 bg-white min-h-[600px]">
                <h3 className="text-xl font-extrabold text-slate-800 mb-8 mt-2">گواهی دیجیتال سفارش</h3>

                {/* QR Display */}
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
                            <span className="text-sm font-bold text-slate-800 truncate">
                                {fullData?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People
                                    ? `${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}`
                                    : "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مدیر پروژه</span>
                            <span className="text-sm font-bold text-slate-800 truncate">
                                {fullData?.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People
                                    ? `${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}`
                                    : "—"}
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
                    {/* Certificate */}
                    <Button
                        type="primary"
                        icon={<FileTextOutlined className="text-lg" />}
                        onClick={() => handlePrintCertificate && handlePrintCertificate()}
                        className="w-full h-14 text-base font-black bg-emerald-600 hover:!bg-emerald-500 shadow-xl shadow-emerald-100 rounded-2xl border-none flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:translate-y-0"
                        loading={loading}
                    >
                        چاپ گواهی دیجیتال (Full Page)
                    </Button>

                    {/* Label */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                            {/* Plant Type Dropdown */}
                            <div className="flex flex-col gap-2 sm:col-span-2">
                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    <label className="text-[11px] font-black uppercase tracking-wider">نوع گیاه</label>
                                </div>
                                <Select
                                    value={plantType}
                                    onChange={setPlantType}
                                    options={PLANT_TYPE_OPTIONS}
                                    className="w-full dir-rtl"
                                    popupClassName="dir-rtl font-iransans"
                                    size="large"
                                    popupMatchSelectWidth={false}
                                />
                            </div>

                            {/* Label Paper Size */}
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
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </div>

                            {/* QR Size */}
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
                </div>

                {/* ===== HIDDEN PRINT AREAS ===== */}

                {/* 1. Certificate — A4 */}
                <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
                    <style>{`
                        @media print {
                            @page { margin: 0; size: A4 portrait; }
                        }
                    `}</style>
                    <div style={{
                        width: "210mm", height: "297mm", overflow: "hidden",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "white",
                    }}>
                        <div
                            ref={certificateRef}
                            style={{
                                direction: "rtl", fontFamily: "tahoma",
                                width: "210mm", height: "297mm",
                                background: "white",
                                WebkitPrintColorAdjust: "exact",
                                printColorAdjust: "exact",
                                transform: "scale(0.82)",
                                transformOrigin: "center center",
                                display: "flex", flexDirection: "column",
                                position: "relative", overflow: "hidden",
                                boxSizing: "border-box", padding: "14mm",
                                flexShrink: 0,
                            }}
                        >
                            <div style={{ position: "absolute", top: 0, right: 0, width: "220px", height: "220px", background: "#f8fafc", borderBottomLeftRadius: "100px", opacity: 0.6, zIndex: 0 }} />
                            <div style={{ position: "absolute", bottom: 0, left: 0, width: "180px", height: "180px", background: "#ecfdf5", borderTopRightRadius: "80px", opacity: 0.6, zIndex: 0 }} />
                            <div style={{ position: "absolute", inset: "10px", border: "2px solid #0f172a", pointerEvents: "none", zIndex: 1 }} />
                            <div style={{ position: "absolute", inset: "16px", border: "1px solid #cbd5e1", pointerEvents: "none", zIndex: 1 }} />

                            {/* HEADER */}
                            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #0f172a", paddingBottom: "12px", marginBottom: "14px", flexShrink: 0 }}>
                                <div>
                                    <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#0f172a", margin: 0, lineHeight: 1.2 }}>گواهی سفارش</h1>
                                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#065f46", margin: "6px 0" }}>فکور پیوند آریا</p>
                                    <div style={{ width: "70px", height: "4px", background: "#059669", borderRadius: "999px" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                    <div style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "10px", background: "white" }}>
                                        <QRCodeCanvas value={qrUrl} size={70} level="M" />
                                    </div>
                                    <span style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>{fullData?.OrderCode}</span>
                                </div>
                            </div>

                            {/* MAIN */}
                            <div style={{ position: "relative", zIndex: 2, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                                    <div style={{ borderRight: "4px solid #10b981", paddingRight: "10px" }}>
                                        <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "3px" }}>کد رهگیری</div>
                                        <div style={{ fontSize: "14px", fontWeight: 900 }}>{fullData?.OrderCode || "—"}</div>
                                    </div>
                                    <div style={{ borderRight: "4px solid #94a3b8", paddingRight: "10px" }}>
                                        <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "3px" }}>تاریخ</div>
                                        <div style={{ fontSize: "14px", fontWeight: 900 }}>{fullData?.OrderDate ? new Date(fullData.OrderDate).toLocaleDateString("fa-IR") : "—"}</div>
                                    </div>
                                    <div style={{ borderRight: "4px solid #94a3b8", paddingRight: "10px" }}>
                                        <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "3px" }}>مشتری</div>
                                        <div style={{ fontSize: "13px", fontWeight: 700 }}>
                                            {fullData?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People ? `${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}` : "—"}
                                        </div>
                                    </div>
                                    <div style={{ borderRight: "4px solid #94a3b8", paddingRight: "10px" }}>
                                        <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "3px" }}>مدیر پروژه</div>
                                        <div style={{ fontSize: "13px", fontWeight: 700 }}>
                                            {fullData?.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People ? `${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}` : "—"}
                                        </div>
                                    </div>
                                </div>

                                {/* Rootstock */}
                                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "14px", marginBottom: "12px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                                    <div style={{ position: "absolute", top: 0, right: 0, width: "5px", height: "100%", background: "#10b981" }} />
                                    <h2 style={{ fontSize: "14px", fontWeight: 900, color: "#064e3b", margin: "0 0 10px 0" }}>۱ - بذر پایه</h2>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        <div>
                                            <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px" }}>گیاه / واریته</div>
                                            <div style={{ fontSize: "13px", fontWeight: 700 }}>{fullData?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_plantVariety?.Tbl_Plants?.CommonName || ""} - {fullData?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName || "—"}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px" }}>تامین‌کننده</div>
                                            <div style={{ fontSize: "13px", fontWeight: 700 }}>
                                                {fullData?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.Tbl_suppliers
                                                    ? fullData.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage.Tbl_suppliers.CompanyName || `${fullData.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage.Tbl_suppliers.FirstName} ${fullData.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage.Tbl_suppliers.LastName}`
                                                    : "—"}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px" }}>کد بسته</div>
                                            <div style={{ fontSize: "13px", fontFamily: "monospace" }}>{fullData?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?.SerialNumber || "—"}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scion */}
                                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "14px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                                    <div style={{ position: "absolute", top: 0, right: 0, width: "5px", height: "100%", background: "#3b82f6" }} />
                                    <h2 style={{ fontSize: "14px", fontWeight: 900, color: "#1e3a8a", margin: "0 0 10px 0" }}>۲ - بذر پیوندک</h2>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        <div>
                                            <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px" }}>گیاه / واریته</div>
                                            <div style={{ fontSize: "13px", fontWeight: 700 }}>{fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_plantVariety?.Tbl_Plants?.CommonName || ""} - {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_plantVariety?.VarietyName || "—"}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px" }}>تامین‌کننده</div>
                                            <div style={{ fontSize: "13px", fontWeight: 700 }}>
                                                {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.Tbl_suppliers
                                                    ? fullData.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage.Tbl_suppliers.CompanyName || `${fullData.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage.Tbl_suppliers.FirstName} ${fullData.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage.Tbl_suppliers.LastName}`
                                                    : "—"}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px" }}>کد بسته</div>
                                            <div style={{ fontSize: "13px", fontFamily: "monospace" }}>{fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?.SerialNumber || "—"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px solid #0f172a", paddingTop: "12px", marginTop: "14px", flexShrink: 0 }}>
                                <div style={{ maxWidth: "55%" }}>
                                    <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700, marginBottom: "4px" }}>OFFICIAL DOCUMENT</div>
                                    <div style={{ fontSize: "11px", color: "#475569", lineHeight: 1.6 }}>این سند برای تایید اصالت سفارش صادر شده است.</div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                    <div style={{ width: "120px", height: "40px", borderBottom: "1px dashed #cbd5e1", position: "relative" }}>
                                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.08, transform: "rotate(-12deg)", fontWeight: 900, fontSize: "11px" }}>APPROVED</div>
                                    </div>
                                    <div style={{ fontSize: "11px", fontWeight: 700 }}>امضا و مهر</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Label — Dynamic Size */}
                {/* Hidden Print Content */}
                <div className="hidden">
                    <div ref={labelRef} style={{ width: "100%", height: "100%", padding: "1mm", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
                        <QRCodeCanvas
                            value={qrUrl}
                            size={512}
                            level="L"
                            margin={0}
                            style={{
                                width: qrSize,
                                height: qrSize,
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                imageRendering: "pixelated"
                            }}
                        />
                        <div style={{
                            textAlign: "center",
                            fontWeight: "900",
                            color: "#000",
                            lineHeight: "1.1",
                            marginTop: "0.3mm",
                            width: qrSize,
                            fontSize: qrSize === "100%" ? "8pt" : `${Math.max(3.5, Math.min(16, parseInt(qrSize) * 0.32))}pt`,
                            whiteSpace: "normal",
                            wordBreak: "break-all",
                            fontFamily: "tahoma"
                        }}>
                            <div style={{ marginBottom: "0.2mm" }}>{printOrderLabel}</div>
                        </div>
                    </div>
                </div>

            </div>
        </Modal>
    );
}
