"use client";
import { Modal, List, Empty, Space, Tag, Button, Tooltip, Input, Alert } from "antd";
import {
  PlusOutlined,
  QrcodeOutlined,
  ReloadOutlined,
  CopyOutlined,
  SearchOutlined,
  CloseOutlined,
  IdcardOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import QRCodeModal from "../../_components/UI/QRCodeModal";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import type { PlantingSamples } from "@/app/generated/prisma";
import { getSamples } from "@/app/lib/services/plantingsamples";
import { createSample } from "@/app/lib/services/plantingsamples";

export default function SamplesModal({
  plantingId,
  open,
  onClose,
}: {
  plantingId: number;
  open: boolean;
  onClose: () => void;
}) {
  const [samples, setSamples] = useState<PlantingSamples[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [qrVisible, setQrVisible] = useState<boolean>(false);
  const [qrSerial, setQrSerial] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [notice, setNotice] = useState<{
    type: "success" | "info" | "warning" | "error";
    text: string;
  } | null>(null);

  // تبدیل ارقام فارسی/عربی به انگلیسی برای نمایش محلی این کامپوننت
  const toEn = (val: string | number | null | undefined) => {
    const s = String(val ?? "");
    const map: Record<string, string> = {
      "۰": "0",
      "۱": "1",
      "۲": "2",
      "۳": "3",
      "۴": "4",
      "۵": "5",
      "۶": "6",
      "۷": "7",
      "۸": "8",
      "۹": "9",
      "٠": "0",
      "١": "1",
      "٢": "2",
      "٣": "3",
      "٤": "4",
      "٥": "5",
      "٦": "6",
      "٧": "7",
      "٨": "8",
      "٩": "9",
    };
    return s.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d);
  };

  useEffect(() => {
    if (open && plantingId) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, plantingId]);

  const getData = async () => {
    try {
      setLoading(true);
      const data = await getSamples(plantingId);
      setSamples(data || []);
    } catch (e) {
      console.error(e);
      showNotice("خطا در دریافت نمونه‌ها", "error");
    } finally {
      setLoading(false);
    }
  };

  // محاسبه شماره بعدی نمونه برای این کاشت
  const nextSerial = useMemo(() => {
    // فیلتر نمونه‌هایی که سریال‌شان با plantingId شروع می‌شود
    const prefix = `${plantingId}_`;
    const indices = samples
      .map((s) => s.SerialID ?? "")
      .filter((s) => s.startsWith(prefix))
      .map((s) => {
        const parts = s.split("_");
        const n = Number(parts[1] ?? 0);
        return Number.isFinite(n) ? n : 0;
      });
    const lastIndex = indices.length ? Math.max(...indices) : 0;
    return `${plantingId}_${lastIndex + 1}`;
  }, [samples, plantingId]);

  const handleAdd = async () => {
    try {
      setAdding(true);
      // ایجاد نمونه با سریال محاسبه‌شده
      await createSample({
        SerialID: nextSerial,
        PlantingID: BigInt(plantingId),
      } as unknown as PlantingSamples);
      showNotice("نمونه با موفقیت ثبت شد", "success");
      await getData();
    } catch (e) {
      console.error(e);
      showNotice("خطا در ثبت نمونه", "error");
    } finally {
      setAdding(false);
    }
  };

  const openQR = (serial?: string | null) => {
    if (!serial) return;
    setQrSerial(toEn(serial));
    setQrVisible(true);
  };

  const copySerial = async (serial?: string | null) => {
    if (!serial) return;
    try {
      await navigator.clipboard.writeText(toEn(serial));
      showNotice("سریال نمونه کپی شد", "success");
    } catch {
      showNotice("امکان کپی وجود ندارد", "warning");
    }
  };

  const showNotice = (text: string, type: "success" | "info" | "warning" | "error" = "info") => {
    setNotice({ text, type });
    window.clearTimeout((showNotice as any)._t);
    (showNotice as any)._t = window.setTimeout(() => setNotice(null), 3500);
  };

  const filteredSamples = useMemo(() => {
    if (!filter.trim()) return samples;
    const term = filter.trim().toLowerCase();
    return samples.filter((s) => (s.SerialID || "").toLowerCase().includes(term));
  }, [samples, filter]);

  const total = samples?.length || 0;
  const displayed = filteredSamples?.length || 0;

  // فقط یک دکمه افزودن داریم (پایین مودال)

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closeIcon={null}
      className="!p-0"
      width={"clamp(360px, 90vw, 900px)"}
      styles={{
        content: {
          padding: 0,
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Header Section */}
      <div
        data-latin-digits
        className="relative px-6 py-5 bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-white border-b border-slate-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center text-slate-600 hover:text-slate-700"
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-xl text-slate-900">نمونه‌های پایش</h3>
            <p className="text-sm text-slate-600 mt-0.5">مدیریت و مشاهده نمونه‌های ثبت‌شده برای این کاشت</p>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div data-latin-digits className="px-6 py-6 space-y-5 bg-white">
        {/* Inline Notice */}
        {notice && (
          <Alert
            showIcon
            closable
            type={notice.type}
            message={notice.text}
            onClose={() => setNotice(null)}
            className="text-[13px]"
          />
        )}
        {/* Header info */}
        <div className="flex flex-wrap items-center justify-between rounded-lg border bg-gradient-to-l from-slate-50 to-white px-3 py-3">
          <Space size={8} wrap>
            <Tag color="green">شناسه کاشت: {toEn(plantingId)}</Tag>
            <Tag color="blue">سریال بعدی: {toEn(nextSerial)}</Tag>
          </Space>
          <span className="text-sm text-slate-600">سریال نمونه‌ها بر اساس شناسه کاشت و شماره ترتیبی ساخته می‌شود</span>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-2">
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="جست‌وجو بر اساس سریال"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Tooltip title="بروزرسانی">
              <Button icon={<ReloadOutlined />} onClick={getData} disabled={loading} />
            </Tooltip>
          </div>
          <div className="text-sm text-slate-600" dir="ltr">
            نمایش {toEn(displayed)} از {toEn(total)}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-3 border-slate-200"></div>
              <div className="absolute inset-0 h-12 w-12 rounded-full border-3 border-emerald-300 border-t-transparent animate-spin"></div>
            </div>
            <span className="text-slate-600 font-medium">در حال بارگذاری...</span>
          </div>
        ) : !samples || samples.length === 0 ? (
          <div className="py-10">
            <Empty description="هنوز نمونه‌ای ثبت نشده" styles={{ image: { height: 56 } }}>
              <GreenhouseButton text="ثبت اولین نمونه" icon={<PlusOutlined />} onClick={handleAdd} loading={adding} />
            </Empty>
          </div>
        ) : (
          <>
            <List
              dataSource={filteredSamples}
              rowKey={(item) => String((item as any).ID ?? item.SerialID ?? Math.random())}
              renderItem={(item, index) => (
                <List.Item className="!px-0 py-1">
                  <div className="w-full flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-white/90 px-3 py-2.5 hover:bg-emerald-50/60 transition-colors">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-[11px] leading-6 text-center font-bold ring-1 ring-emerald-200 select-none">
                        {toEn(index + 1)}
                      </div>
                      <span className="hidden sm:inline text-xs text-slate-400">|</span>
                      <span className="text-sm text-slate-600 hidden md:inline-flex items-center gap-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>سریال</span>
                      </span>
                      <span
                        dir="ltr"
                        className="truncate inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-[13px] text-emerald-700"
                        title={item.SerialID || undefined}
                      >
                        {toEn(item.SerialID || "—")}
                      </span>
                      <span className="hidden sm:inline text-xs text-slate-400">•</span>
                      <span className="hidden sm:inline-flex text-sm text-slate-600 items-center gap-1">
                        <IdcardOutlined className="text-blue-500" />
                        <span>شناسه:</span>
                        {toEn(String((item as any).ID ?? "-"))}
                      </span>
                      {item.PlantingID != null && (
                        <span className="hidden md:inline-flex text-sm text-slate-600 items-center gap-1">
                          <BranchesOutlined className="text-emerald-500" />
                          <span>کاشت:</span>
                          {toEn(String(item.PlantingID))}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Tooltip title="نمایش کد QR">
                        <Button
                          size="small"
                          type="text"
                          icon={<QrcodeOutlined style={{ color: "#10b981" }} />}
                          onClick={() => openQR(item.SerialID ?? undefined)}
                        >
                          QR
                        </Button>
                      </Tooltip>
                      <Tooltip title="کپی سریال">
                        <Button
                          size="small"
                          type="text"
                          icon={<CopyOutlined style={{ color: "#3b82f6" }} />}
                          onClick={() => copySerial(item.SerialID)}
                        >
                          کپی
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            {/* Footer actions: only button on the right */}
            <div className="w-full pt-3 mt-2 flex items-center">
              <GreenhouseButton
                text="افزودن نمونه"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                loading={adding}
                className="min-w-[140px]"
              />
            </div>
          </>
        )}
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        visible={qrVisible}
        onClose={() => setQrVisible(false)}
        url={`https://mygreenhouses.ir/planting/${plantingId}`}
        serial={qrSerial}
        title="QR کد نمونه"
      />
    </Modal>
  );
}
