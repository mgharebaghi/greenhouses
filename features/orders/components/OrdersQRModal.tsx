"use client";

import { formatPersianDate } from "@/shared/dates/calendar";

import PrintQrLabel from "@/shared/components/PrintQrLabel";
import {
  LABEL_SIZES,
  PLANT_TYPE_OPTIONS,
  QR_LABEL_SIZES,
  parseLabelSize,
} from "../domain/print-settings";
import OrderCertificate from "./printing/OrderCertificate";

import type { OrderDetails } from "../types/details";

import { publicOrderUrl } from "@/shared/config/public-urls";

import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DataLoadError from "@/shared/components/DataLoadError";
import {
  CloseOutlined,
  DownloadOutlined,
  FileTextOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import Modal from "@/shared/components/ResponsiveModal";
import { Select, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getOrderById } from "../actions";

interface OrdersQRModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: Pick<OrderDetails, "ID"> | null;
}

function isAndroidTablet(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & {
    userAgentData?: { mobile?: boolean; platform?: string };
  };
  const userAgent = nav.userAgent || "";
  const platform = nav.userAgentData?.platform || nav.platform || "";
  const isAndroid = /Android/i.test(`${userAgent} ${platform}`);
  const hasTabletViewport =
    Math.min(window.screen.width, window.screen.height) >= 600;
  const reportsAsTablet =
    nav.userAgentData?.mobile === false || !/Mobile/i.test(userAgent);

  return isAndroid && hasTabletViewport && reportsAsTablet;
}

export default function OrdersQRModal({
  open,
  setOpen,
  data,
}: OrdersQRModalProps) {
  const [fullData, setFullData] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [labelSize, setLabelSize] = useState("auto");
  const [qrSize, setQrSize] = useState("100%");
  const [plantType, setPlantType] = useState<string>("");

  const certificateRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    if (open && data?.ID) {
      setLoading(true);
      setFullData(null);
      setLoadError(false);
      getOrderById(data.ID)
        .then((res) => {
          if (active) {
            setFullData(res);
            setLoadError(!res);
          }
        })
        .catch(() => {
          if (active) setLoadError(true);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }
    return () => {
      active = false;
    };
  }, [open, data?.ID, retry]);

  const handlePrintCertificate = useReactToPrint({
    contentRef: certificateRef,
    documentTitle: `Order-Certificate-${fullData?.OrderCode || ""}`,
    pageStyle: `
            @page { size: A4 portrait; margin: 0; }
            @media print { 
                body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; background: white; }
            }
        `,
  });

  const { width: labelW, height: labelH } = parseLabelSize(labelSize);

  const handlePrintLabel = useReactToPrint({
    contentRef: labelRef,
    preserveAfterPrint: true,
    documentTitle: `Order-Label-${fullData?.OrderCode || ""}`,
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
        `,
  });

  const handleTabletPrintLabel = () => {
    const source = labelRef.current;
    if (!source) {
      handlePrintLabel();
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      handlePrintLabel();
      return;
    }

    try {
      printWindow.opener = null;

      const printableContent = source.cloneNode(true) as HTMLDivElement;
      const sourceCanvases = source.querySelectorAll("canvas");
      const clonedCanvases = printableContent.querySelectorAll("canvas");

      sourceCanvases.forEach((canvas, index) => {
        const clonedCanvas = clonedCanvases[index];
        if (!clonedCanvas) return;

        const qrImage = document.createElement("img");
        qrImage.src = canvas.toDataURL("image/png");
        qrImage.alt = "QR Code";
        qrImage.className = canvas.className;
        qrImage.setAttribute("style", canvas.getAttribute("style") || "");
        qrImage.style.imageRendering = "pixelated";
        clonedCanvas.replaceWith(qrImage);
      });

      const pageSize = labelSize === "auto" ? "auto" : `${labelW} ${labelH}`;
      const printDocument = printWindow.document;
      printDocument.open();
      printDocument.write(`<!doctype html>
                <html dir='rtl'>
                    <head>
                        <meta charset='utf-8' />
                        <meta name='viewport' content='width=device-width, initial-scale=1' />
                        <title>Order-Label</title>
                        <style>
                            @page { size: ${pageSize}; margin: 0; }
                            html, body {
                                width: 100%;
                                height: 100%;
                                margin: 0;
                                padding: 0;
                                overflow: hidden;
                                background: white;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            body {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        </style>
                    </head>
                    <body></body>
                </html>`);
      printDocument.close();
      printDocument.title = `Order-Label-${fullData?.OrderCode || ""}`;
      printDocument.body.appendChild(
        printDocument.importNode(printableContent, true),
      );

      const images = Array.from(printDocument.images);
      Promise.all(
        images.map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                image.onload = () => resolve();
                image.onerror = () => resolve();
              }),
        ),
      ).then(() => {
        printWindow.requestAnimationFrame(() => {
          printWindow.requestAnimationFrame(() => {
            printWindow.focus();
            printWindow.print();
          });
        });
      });
    } catch {
      printWindow.close();
      handlePrintLabel();
    }
  };

  const handlePrintLabelClick = () => {
    if (isAndroidTablet()) {
      handleTabletPrintLabel();
      return;
    }

    handlePrintLabel();
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector(
      ".qr-code-canvas",
    ) as HTMLCanvasElement;
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

  const qrUrl = fullData?.ID ? publicOrderUrl(fullData.ID) : "#";

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
      closeIcon={
        <CloseOutlined className="text-slate-400 hover:text-red-500 transition-colors" />
      }
      width={580}
      centered
      className="qr-modal font-iransans"
      styles={{
        content: { borderRadius: "24px", padding: "0", overflow: "hidden" },
      }}
    >
      <div className="flex min-w-0 flex-col items-center p-4 sm:p-8 bg-white">
        {loadError && (
          <DataLoadError onRetry={() => setRetry((value) => value + 1)} />
        )}
        <h3 className="text-center text-lg sm:text-xl font-extrabold text-slate-800 mb-5 sm:mb-8 mt-2">
          گواهی دیجیتال سفارش
        </h3>

        {/* QR Display */}
        <div className="relative group mb-6 w-fit max-w-full">
          <div className="p-4 bg-white border-[3px] border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <QRCodeCanvas value={qrUrl} size={220} className="qr-code-canvas" />
          </div>
          <Tooltip title="دانلود تصویر QR">
            <GreenhouseButton
              onClick={handleDownloadQR}
              aria-label="دانلود تصویر QR"
              className="absolute end-1 bottom-1 z-10 sm:-end-3 sm:-bottom-3"
              variant="secondary"
              icon={<DownloadOutlined />}
            />
          </Tooltip>
        </div>

        {/* Data Display */}
        <div className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-3 sm:rounded-3xl sm:p-6 mb-5 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                کد سفارش
              </span>
              <span className="text-sm font-bold text-slate-800 dir-ltr">
                {fullData?.OrderCode || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                تاریخ سفارش
              </span>
              <span className="text-sm font-bold text-slate-800">
                {fullData?.OrderDate
                  ? formatPersianDate(fullData.OrderDate)
                  : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                مشتری
              </span>
              <span className="text-sm font-bold text-slate-800 [overflow-wrap:anywhere]">
                {fullData?.Tbl_People_Tbl_Orders_CustomerIDToTbl_People
                  ? `${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}`
                  : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                مدیر پروژه
              </span>
              <span className="text-sm font-bold text-slate-800 [overflow-wrap:anywhere]">
                {fullData?.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People
                  ? `${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${fullData.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}`
                  : "—"}
              </span>
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center justify-between gap-3 flex-wrap bg-white/60 rounded-xl p-3 border border-slate-100">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  بذر پایه (Rootstock)
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {fullData
                    ?.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
                    ?.Tbl_plantVariety?.VarietyName || "—"}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>
              <div className="flex flex-col gap-0.5 md:text-left">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  بذر پیوندک (Scion)
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {fullData?.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
                    ?.Tbl_plantVariety?.VarietyName || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full mb-2">
          {/* Certificate */}
          <GreenhouseButton
            text="چاپ گواهی دیجیتال (Full Page)"
            fullWidth
            icon={<FileTextOutlined />}
            onClick={() => handlePrintCertificate && handlePrintCertificate()}
            loading={loading}
          />

          {/* Label */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3 sm:rounded-3xl sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Plant Type Dropdown */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <label className="text-[11px] font-black uppercase tracking-wider">
                    نوع گیاه
                  </label>
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
                  <label className="text-[11px] font-black uppercase tracking-wider">
                    سایز کاغذ (برچسب)
                  </label>
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
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </div>

              {/* QR Size */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <label className="text-[11px] font-black uppercase tracking-wider">
                    سایز کد QR
                  </label>
                </div>
                <Select
                  value={qrSize}
                  onChange={setQrSize}
                  options={QR_LABEL_SIZES}
                  className="w-full dir-rtl"
                  popupClassName="dir-rtl font-iransans"
                  size="large"
                  popupMatchSelectWidth={false}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </div>
            </div>
            <GreenhouseButton
              text="چاپ برچسب (QR Code)"
              fullWidth
              variant="secondary"
              icon={<QrcodeOutlined />}
              onClick={handlePrintLabelClick}
              loading={loading}
            />
          </div>
        </div>

        {/* ===== HIDDEN PRINT AREAS ===== */}

        {/* 1. Certificate — A4 */}
        <div className="dialog-print-only">
          <style>{`
                        @media print {
                            @page { margin: 0; size: A4 portrait; }
                        }
                    `}</style>
          <div
            style={{
              width: "210mm",
              height: "297mm",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
            }}
          >
            <OrderCertificate
              certificateRef={certificateRef}
              fullData={fullData}
              qrUrl={qrUrl}
            />
          </div>
        </div>

        {/* 2. Label — Dynamic Size */}
        {/* Hidden Print Content */}
        <div className="hidden">
          <PrintQrLabel
            labelRef={labelRef}
            qrUrl={qrUrl}
            qrSize={qrSize}
            printOrderLabel={printOrderLabel}
          />
        </div>
      </div>
    </Modal>
  );
}
