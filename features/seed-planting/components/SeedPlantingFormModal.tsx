"use client";
import QrImage from "@/shared/components/QrImage";

import { toDate } from "@/shared/forms/date-value";

import type { FormValues } from "@/shared/forms/types";
import { seedPlantingInputSchema } from "../schema";

import { publicOrderUrl } from "@/shared/config/public-urls";

import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";

import { getGreenhouses } from "@/features/greenhouses/actions";
import {
  createSeedPlanting,
  getOrdersForDropdown,
  getTechnicians,
  updateSeedPlanting,
} from "@/features/seed-planting/actions";
import type { SeedPlantingRecord } from "@/features/seed-planting/types/record";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DatePicker from "@/shared/components/PersianDatePicker";
import {
  CheckCircleOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Checkbox, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

import QRCodeLib from "qrcode";

// Types
type SelectOption = {
  label: import("react").ReactNode;
  value: string | number;
};

interface OrderData {
  ID: number;
  OrderCode: string | null;
  OrderCount: number | null;
  QRCode: string | null;
  generatedQRCode?: string; // New field for client-side generated QR
  Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: {
    Tbl_plantVariety: { VarietyName: string | null } | null;
  } | null;
  Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: {
    Tbl_plantVariety: { VarietyName: string | null } | null;
  } | null;
}

export default function SeedPlantingFormModal({
  modalOpen,
  setModalOpen,
  setMainLoading,
  record,
  refreshData,
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  setMainData?: (data: SeedPlantingRecord[]) => void;
  setMainLoading?: (loading: boolean) => void;
  record?: SeedPlantingRecord | null;
  refreshData: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [technicians, setTechnicians] = useState<SelectOption[]>([]);
  const [greenhouses, setGreenhouses] = useState<SelectOption[]>([]);
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);

  // State for the custom logic
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [seedType, setSeedType] = useState<boolean | null>(null); // true = Scion, false = Rootstock
  const [, setShowVarietyInfo] = useState(false);

  const isEdit = !!record;
  const modalTitle = isEdit ? "ویرایش کشت بذر" : "کاشت بذور";
  const modalSubTitle = "اطلاعات مربوط به کشت بذر را وارد کنید";

  const theme = isEdit
    ? {
        gradient:
          "from-amber-50 via-orange-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-amber-100 dark:border-slate-700",
        iconBg: "from-amber-500 via-amber-600 to-orange-600",
        iconDot: "bg-orange-400",
        textMain: "text-amber-900 dark:text-slate-100",
        textSub: "text-amber-600/80 dark:text-slate-400",
        accent: "amber",
        primaryBtn: "bg-amber-600 hover:bg-amber-700",
        secondaryBtn:
          "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
      }
    : {
        gradient:
          "from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-emerald-100 dark:border-slate-700",
        iconBg: "from-emerald-500 via-emerald-600 to-emerald-700",
        iconDot: "bg-lime-400",
        textMain: "text-emerald-900 dark:text-slate-100",
        textSub: "text-emerald-600/80 dark:text-slate-400",
        accent: "emerald",
        primaryBtn: "bg-emerald-600 hover:bg-emerald-700",
        secondaryBtn:
          "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
      };

  useEffect(() => {
    const fetchInitialData = async () => {
      const [ordersData, techniciansData, greenhousesData] = await Promise.all([
        getOrdersForDropdown(),
        getTechnicians(),
        getGreenhouses(),
      ]);

      const ordersWithQR = await Promise.all(
        ordersData.map(async (o) => {
          try {
            const url = publicOrderUrl(o.ID);
            const qrDataUrl = await QRCodeLib.toDataURL(url, {
              margin: 1,
              width: 64,
            });
            return { ...o, generatedQRCode: qrDataUrl };
          } catch (e) {
            console.error("QR Gen Error", e);
            return o;
          }
        }),
      );

      setOrders(ordersWithQR);
      setTechnicians(
        techniciansData.map((t) => ({
          label: `${t.FirstName} ${t.LastName}`,
          value: t.ID,
        })),
      );
      setGreenhouses(
        greenhousesData.map((g) => ({ label: g.GreenhouseName, value: g.ID })),
      );

      if (record && record.OrderID) {
        const ord = ordersWithQR.find((o) => o.ID === record.OrderID);
        if (ord) {
          setSelectedOrder(ord);
          setShowVarietyInfo(true);
        }
      }
    };

    setMounted(true);
    if (modalOpen) {
      fetchInitialData();
      if (record) {
        // Populate form
        form.setFieldsValue({
          ...record,
          PlantingDate: record.PlantingDate
            ? new Date(record.PlantingDate)
            : null,
          GerminationDate: record.GerminationDate
            ? new Date(record.GerminationDate)
            : null,
        });
        setSeedType(record.SeedType ?? null);
      } else {
        form.resetFields();
        setSeedType(null);
        setSelectedOrder(null);
        setShowVarietyInfo(false);
      }
    }
  }, [modalOpen, record, form]);

  const handleOrderChange = (orderId: number) => {
    const ord = orders.find((o) => o.ID === orderId);
    if (ord) {
      setSelectedOrder(ord);
      setShowVarietyInfo(true);
    } else {
      setSelectedOrder(null);
      setShowVarietyInfo(false);
    }
  };

  const handleSeedTypeChange = (type: boolean) => {
    setSeedType(type);
    form.setFieldValue("SeedType", type);
  };

  const handleSubmit = async (
    values: FormValues<import("zod").infer<typeof seedPlantingInputSchema>>,
  ) => {
    await submitForm(
      async () => {
        if (seedType === null) {
          setModalMsg({
            status: "error",
            message: "لطفاً نوع بذر (پایه یا پیوندی) را مشخص کنید",
          });
          return;
        }

        setLoading(true);
        setModalMsg(null);

        const dataToSubmit = {
          ...values,
          SeedType: seedType,
          PlantingDate: values.PlantingDate
            ? toDate(values.PlantingDate)
            : null,
          GerminationDate: values.GerminationDate
            ? toDate(values.GerminationDate)
            : null,
        };

        let res;
        if (isEdit && record) {
          res = await updateSeedPlanting(record.ID, dataToSubmit);
        } else {
          res = await createSeedPlanting(dataToSubmit);
        }

        setModalMsg({
          status: res.status as "ok" | "error",
          message: res.message,
        });

        applyFieldErrors(form, res);
        if (res.status === "ok") {
          await refreshData();
          setTimeout(() => {
            setModalOpen(false);
            form.resetFields();
          }, 1000);
        }
        setLoading(false);
      },
      (feedback) => setModalMsg(feedback),
      () => {
        setLoading(false);
        setMainLoading?.(false);
      },
    );
  };

  if (!mounted) return null;

  return (
    <Modal
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      width={850}
      className="!p-0"
      styles={{
        content: {
          padding: 0,
          borderRadius: "1.25rem",
          overflow: "hidden",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Header */}
      <div
        className={`relative px-6 py-6 bg-gradient-to-br border-b ${theme.gradient} ${theme.border}`}
      >
        <button
          onClick={() => setModalOpen(false)}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white/50 hover:bg-white transition-all flex items-center justify-center text-slate-500 hover:text-rose-500 shadow-sm`}
        >
          <CloseOutlined />
        </button>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${theme.iconBg}`}
            >
              <ExperimentOutlined className="text-2xl" />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-800 ${theme.iconDot}`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${theme.textMain}`}>
              {modalTitle}
            </h3>
            <p className={`text-sm ${theme.textSub} mt-1`}>{modalSubTitle}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[75vh] overflow-y-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-5"
        >
          {/* Order & Seed Type Section - Card Style */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex flex-col-reverse md:flex-row gap-6">
              {/* Inputs Column */}
              <div className="flex-1 space-y-5">
                <Form.Item
                  label={
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      📦 کد سفارش
                    </span>
                  }
                  name="OrderID"
                  rules={[
                    { required: true, message: "انتخاب سفارش الزامی است" },
                  ]}
                  className="mb-0"
                >
                  <Select
                    placeholder="جستجو و انتخاب سفارش"
                    className="w-full text-right"
                    size="large"
                    onChange={handleOrderChange}
                    options={orders.map((o) => ({
                      label: o.OrderCode,
                      value: o.ID,
                    }))}
                    showSearch
                    optionFilterProp="label"
                    allowClear
                    disabled={isEdit}
                  />
                </Form.Item>

                {/* Variety & Seed Type Selection */}
                {selectedOrder && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Rootstock Box */}
                    <div
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                        seedType === false
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                          : "border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50 dark:bg-slate-900"
                      }`}
                      onClick={() => handleSeedTypeChange(false)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          🌱 واریته گیاه پایه
                        </span>
                        <Checkbox
                          checked={seedType === false}
                          className="scale-110"
                        />
                      </div>
                      <div
                        className="text-sm text-slate-600 dark:text-slate-400 font-mono truncate"
                        title={
                          selectedOrder
                            .Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
                            ?.Tbl_plantVariety?.VarietyName || ""
                        }
                      >
                        {selectedOrder
                          .Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
                          ?.Tbl_plantVariety?.VarietyName || "---"}
                      </div>
                    </div>

                    {/* Scion Box */}
                    <div
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                        seedType === true
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                          : "border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50 dark:bg-slate-900"
                      }`}
                      onClick={() => handleSeedTypeChange(true)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          🌿 واریته پیوندک
                        </span>
                        <Checkbox
                          checked={seedType === true}
                          className="scale-110"
                        />
                      </div>
                      <div
                        className="text-sm text-slate-600 dark:text-slate-400 font-mono truncate"
                        title={
                          selectedOrder
                            .Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
                            ?.Tbl_plantVariety?.VarietyName || ""
                        }
                      >
                        {selectedOrder
                          .Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
                          ?.Tbl_plantVariety?.VarietyName || "---"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code Column */}
              {selectedOrder && selectedOrder.generatedQRCode && (
                <div className="flex flex-col items-center justify-start py-1 animate-in zoom-in-90 duration-300">
                  <div className="bg-white p-2 rounded-xl border-2 border-slate-200 shadow-sm">
                    <QrImage
                      src={selectedOrder.generatedQRCode}
                      alt="Order QR Code"
                      className="w-28 h-28 md:w-32 md:h-32 object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 mt-2 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedOrder.OrderCode}
                  </span>
                </div>
              )}
            </div>

            {/* Planting Date & Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <Form.Item
                label={
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    📅 تاریخ کاشت
                  </span>
                }
                name="PlantingDate"
                rules={[{ required: true }]}
              >
                <DatePicker
                  containerClassName="w-full"
                  inputClass={`w-full h-[40px] px-3 border-2 rounded-xl outline-none transition-all border-slate-200 dark:border-slate-700 focus:border-emerald-400 dark:focus:border-emerald-600 dark:bg-slate-800 dark:text-white`}
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    🔢 تعداد بذر کاشته شده
                  </span>
                }
                name="SeedPlantingNumber"
                rules={[{ required: true }]}
              >
                <Input
                  type="number"
                  size="large"
                  className="rounded-xl border-2 border-slate-200 dark:border-slate-700"
                />
              </Form.Item>
            </div>
          </div>

          {/* Section 2: Tray Info & Location */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xl">🧺</span>
              <h4 className="font-bold text-slate-700 dark:text-slate-200">
                اطلاعات سینی و گلخانه
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Form.Item label="🏠 نام گلخانه" name="GreenhouseID">
                <Select
                  options={greenhouses}
                  size="large"
                  className="rounded-xl"
                  placeholder="انتخاب گلخانه"
                />
              </Form.Item>

              <Form.Item
                label="👨‍🔧 تکنسین مسئول"
                name="TechnicianID"
                rules={[{ required: true }]}
              >
                <Select
                  options={technicians}
                  size="large"
                  className="rounded-xl"
                  placeholder="انتخاب تکنسین"
                />
              </Form.Item>

              <Form.Item
                label="📥 تعداد سینی"
                name="TrayNumber"
                rules={[{ required: true }]}
              >
                <Input type="number" size="large" className="rounded-xl" />
              </Form.Item>

              <Form.Item
                label="تعداد حفره"
                name="CellPerTrayNumber"
                rules={[{ required: true }]}
              >
                <Select
                  size="large"
                  className="rounded-xl"
                  options={[
                    { label: "24", value: 24 },
                    { label: "45", value: 45 },
                    { label: "52", value: 52 },
                    { label: "72", value: 72 },
                    { label: "105", value: 105 },
                    { label: "128", value: 128 },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="ابعاد حفره (cm)"
                name="CellHeight"
                rules={[{ required: true }]}
              >
                <Input
                  type="number"
                  size="large"
                  className="rounded-xl"
                  suffix="cm"
                />
              </Form.Item>

              <Form.Item label="جنس سینی" name="TrayMaterial">
                <Select
                  size="large"
                  className="rounded-xl"
                  options={[
                    { label: "پلی اتیلن", value: "پلی اتیلن" },
                    { label: "پلی استیرن", value: "پلی استیرن" },
                  ]}
                />
              </Form.Item>
            </div>
          </div>

          {/* Section 3: Bedding Info */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xl">🌱</span>
              <h4 className="font-bold text-slate-700 dark:text-slate-200">
                اطلاعات بستر کشت
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Form.Item label="بستر کشت" name="PlantingBed">
                <Select
                  size="large"
                  className="rounded-xl"
                  options={[
                    { label: "کوکوپیت خالص", value: "کوکوپیت خالص" },
                    {
                      label: "مخلوط کوکوپیت و پرلیت",
                      value: "مخلوط کوکوپیت و پرلیت",
                    },
                    {
                      label: "مخلوط پیت ماس و پرلیت",
                      value: "مخلوط پیت ماس و پرلیت",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label="نسبت مخلوط" name="PlantingBedRatio">
                <Input
                  size="large"
                  className="rounded-xl"
                  placeholder="مثلا 1.7"
                  type="number"
                  step="0.1"
                />
              </Form.Item>
              <Form.Item
                label="تاریخ ورود به اتاق جوانه زنی"
                name="GerminationDate"
              >
                <DatePicker
                  containerClassName="w-full"
                  inputClass={`w-full h-[40px] px-3 border-2 rounded-xl outline-none transition-all border-slate-200 dark:border-slate-700 focus:border-emerald-400 dark:focus:border-emerald-600 dark:bg-slate-800 dark:text-white`}
                />
              </Form.Item>
            </div>
          </div>

          {modalMsg && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${modalMsg.status === "ok" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"}`}
            >
              {modalMsg.status === "ok" ? (
                <CheckCircleOutlined className="text-xl" />
              ) : (
                <ExclamationCircleOutlined className="text-xl" />
              )}
              <span className="font-medium">{modalMsg.message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={loading}
              className="w-full sm:w-auto min-w-[140px] h-11"
            />
            <GreenhouseButton
              text={loading ? "در حال ثبت..." : isEdit ? "ویرایش" : "ثبت"}
              variant="primary"
              type="submit"
              loading={loading}
              className="w-full sm:w-auto min-w-[140px] h-11 shadow-lg hover:shadow-xl"
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
}
