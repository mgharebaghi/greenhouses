"use client";

import { Modal, Button } from "antd";
import { PrinterOutlined, CloseOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

interface GraftedSeedlingPrintModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: any | null;
}

export default function GraftedSeedlingPrintModal({ open, setOpen, data }: GraftedSeedlingPrintModalProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: data ? `GraftedSeedling-${data.GraftedPlantID}` : "GraftedSeedling",
    });

    const handleClose = () => {
        setOpen(false);
    };

    if (!data) return null;

    const qrSrc = data.GraftingOperation?.NurserySeed?.SeedPackage?.QRCode;

    const methodMap: Record<string, string> = {
        'Hole Insertion': 'پیوند حفره‌ای',
        'Tongue Approach': 'پیوند نیم‌نیم',
        'Splice': 'پیوند اسپلایس',
        'Other': 'سایر'
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closeIcon={
                <div
                    className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                    title="بستن"
                >
                    <CloseOutlined className="text-slate-500 dark:text-slate-400" />
                </div>
            }
            width={600}
            centered
            className="print-modal"
        >
            <div className="flex flex-col gap-6 p-2">
                {/* Print Preview Area */}
                <div
                    ref={componentRef}
                    className="bg-white p-8 border-2 border-slate-100 dark:border-slate-800 rounded-xl relative z-10"
                    dir="rtl"
                >
                    <div className="border-4 border-double border-emerald-800 p-6 relative overflow-hidden">
                        {/* Watermark/Background decoration */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-100/50 -translate-x-12 -translate-y-12 rotate-45"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-100/50 translate-x-12 translate-y-12 rotate-45"></div>

                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 border-b-2 border-emerald-800/20 pb-4">
                            <div>
                                <h1 className="text-2xl font-black text-emerald-900 mb-1 font-Iransans">شناسنامه نشاء پیوندی</h1>
                                <p className="text-emerald-700 text-sm font-semibold">فکور پیوند آریا</p>
                            </div>
                            {qrSrc && (
                                <div className="border-2 border-emerald-900 p-1 bg-white rounded-lg">
                                    <img src={qrSrc} alt="QR" className="w-24 h-24 object-contain" />
                                </div>
                            )}
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                            <PrintRow label="شناسه پیوند" value={`#${data.GraftedPlantID}`} />
                            <PrintRow label="والد (بذر)" value={data.GraftingOperation?.NurserySeed?.SeedPackage?.SeedBatch?.PlantVarities?.VarietyName} />
                            <PrintRow label="پایه (Rootstock)" value={data.GraftingOperation?.RootStockPlant?.PlantVarities?.VarietyName} />
                            <PrintRow label="روش پیوند" value={methodMap[data.GraftingOperation?.GraftingMethod] || data.GraftingOperation?.GraftingMethod} />
                            <PrintRow label="اپراتور" value={data.GraftingOperation?.OperatorName} />
                            <PrintRow
                                label="تاریخ آماده‌سازی"
                                value={data.ReadyForSaleDate ? dayjs(data.ReadyForSaleDate).calendar("jalali").format("YYYY/MM/DD") : "-"}
                            />
                            <PrintRow label="درجه کیفی" value={data.QualityGrade} />
                            <PrintRow label="نرخ بقا" value={data.SurvivalRate ? `${data.SurvivalRate}%` : "-"} />
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 border-t-2 border-emerald-800/20 flex justify-between items-end">
                            <div className="text-xs text-slate-500">
                                <p>تاریخ چاپ: {new Date().toLocaleDateString('fa-IR')}</p>
                                <p>این برگه به منزله سند اصالت نشاء می‌باشد.</p>
                            </div>
                            <div className="text-center">
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                                    تایید شده
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CSS for Print Only */}
                    <style type="text/css" media="print">
                        {`
                            @media print {
                                @page { size: A4; margin: 10mm; }
                                body { 
                                    -webkit-print-color-adjust: exact; 
                                    print-color-adjust: exact;
                                }
                                html, body {
                                    margin: 0 !important;
                                    padding: 0 !important;
                                    height: 100%;
                                }
                                .print-content {
                                    width: 100% !important;
                                    max-width: 100% !important;
                                    box-shadow: none !important;
                                    border: none !important;
                                    page-break-inside: avoid !important;
                                    break-inside: avoid !important;
                                }
                            }
                        `}
                    </style>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <Button onClick={handleClose} size="large" className="dark:text-slate-300 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:text-slate-100">انصراف</Button>
                    <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        size="large"
                        className="bg-emerald-600 hover:bg-emerald-500"
                        onClick={() => handlePrint && handlePrint()}
                    >
                        چاپ شناسنامه
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

function PrintRow({ label, value }: { label: string; value: string | number | undefined | null }) {
    if (!value) return null;
    return (
        <div className="flex flex-col border-b border-dashed border-emerald-900/10 pb-1">
            <span className="text-xs text-emerald-700/70 mb-0.5">{label}</span>
            <span className="text-sm font-bold text-slate-800 font-Iransans">{value}</span>
        </div>
    );
}
