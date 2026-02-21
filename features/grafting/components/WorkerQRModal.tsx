"use client";

import { Modal, Button, Tooltip, Select } from "antd";
import { CloseOutlined, QrcodeOutlined, DownloadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import { useReactToPrint } from "react-to-print";

interface WorkerQRModalProps {
    open: boolean;
    onClose: () => void;
    workerData: {
        workerName: string;
        personCode: string;
        orderCode: string;
        orderID: number;
    } | null;
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
    { label: "۷۰ × ۵۰ میلی‌mت", value: "70mm 50mm" },
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

export default function WorkerQRModal({ open, onClose, workerData }: WorkerQRModalProps) {
    const [labelSize, setLabelSize] = useState("auto");
    const [qrSize, setQrSize] = useState("100%");
    const labelRef = useRef<HTMLDivElement>(null);

    const handlePrintLabel = useReactToPrint({
        contentRef: labelRef,
        documentTitle: `Worker-Label-${workerData?.personCode || ''}`,
        pageStyle: `
            @page { 
                size: ${labelSize === 'auto' ? 'auto' : labelSize}; 
                margin: 0; 
            }
            @media print {
                html, body {
                    width: 100%;
                    height: 100%;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: visible;
                }
            }
        `
    });

    const handleDownloadQR = () => {
        const canvas = document.querySelector(".worker-qr-canvas") as HTMLCanvasElement;
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `QR-Worker-${workerData?.personCode || "worker"}.png`;
            link.href = url;
            link.click();
        }
    };

    if (!open) return null;

    // Content: https://mygreenhouses.ir/public/scan/orders/{orderID}
    const qrUrl = workerData ? `https://mygreenhouses.ir/public/scan/orders/${workerData.orderID}` : "#";

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={<CloseOutlined className="text-slate-400 hover:text-red-500 transition-colors" />}
            width={500}
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
            <div className="flex flex-col items-center p-8 bg-white">
                <h3 className="text-xl font-extrabold text-slate-800 mb-8 mt-2">چاپ برچسب پیوندزن</h3>

                {/* QR Display */}
                <div className="relative group mb-8">
                    <div className="p-4 bg-white border-[3px] border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <QRCodeCanvas value={qrUrl} size={200} className="worker-qr-canvas" />
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">کد سفارش</span>
                            <span className="text-sm font-bold text-slate-800 font-mono">{workerData?.orderCode || "—"}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">کد پیوندزن</span>
                            <span className="text-sm font-bold text-slate-800 font-mono">{workerData?.personCode || "—"}</span>
                        </div>
                        <div className="col-span-2 flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نام پیوندزن</span>
                            <span className="text-sm font-bold text-slate-800">{workerData?.workerName || "—"}</span>
                        </div>
                    </div>
                </div>

                {/* Print Settings */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 w-full shadow-sm">
                    <div className="grid grid-cols-2 gap-5 mb-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">سایز کاغذ</label>
                            <Select
                                value={labelSize}
                                onChange={setLabelSize}
                                options={LABEL_SIZES}
                                className="w-full dir-rtl"
                                size="large"
                                showSearch
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">سایز QR</label>
                            <Select
                                value={qrSize}
                                onChange={setQrSize}
                                options={QR_LABLE_SIZE}
                                className="w-full dir-rtl"
                                size="large"
                            />
                        </div>
                    </div>

                    <Button
                        icon={<QrcodeOutlined className="text-lg" />}
                        onClick={() => handlePrintLabel && handlePrintLabel()}
                        className="w-full h-12 text-sm font-bold bg-slate-800 text-white border-none hover:!bg-slate-700 hover:!text-white shadow-lg shadow-slate-200 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        چاپ برچسب (QR Code)
                    </Button>
                </div>

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
                            <div style={{ marginBottom: "0.2mm" }}>{workerData?.orderCode}</div>
                            <div>کد پیوندزن: {workerData?.personCode}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
