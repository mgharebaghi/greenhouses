"use client";

import { loadFormOptions } from "@/shared/forms/load-options";

import {
  Checkbox,
  DatePicker,
  Form,
  FormActions,
  FormGrid,
  FormItem,
  InputNumber,
  Select,
} from "@/shared/components/FormControls";
import QrImage from "@/shared/components/QrImage";

import { seedPlantingInputSchema } from "../schema";

import { publicOrderUrl } from "@/shared/config/public-urls";

import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { refreshSavedForm, submitForm } from "@/shared/forms/submit";

import { getGreenhouses } from "@/features/greenhouses/actions";
import {
  createSeedPlanting,
  getOrdersForDropdown,
  getTechnicians,
  updateSeedPlanting,
} from "@/features/seed-planting/actions";
import type { SeedPlantingRecord } from "@/features/seed-planting/types/record";

import { ExperimentOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";

import QRCodeLib from "qrcode";

// Types
type SelectOption = {
  label: import("react").ReactNode;
  value: string | number;
};

type OrderData = Awaited<ReturnType<typeof getOrdersForDropdown>>[number] & {
  generatedQRCode?: string;
};

type SeedVariety = NonNullable<
  OrderData["Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage"]
>["Tbl_plantVariety"];

function VarietyLabel({ variety }: { variety: SeedVariety | undefined }) {
  const plant = variety?.Tbl_Plants?.CommonName?.trim();
  return (
    <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-sm text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">
      <bdi>{variety?.VarietyName || "—"}</bdi>
      {plant && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ({plant})
        </span>
      )}
    </div>
  );
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

  useEffect(() => {
    let cancelOptions: (() => void) | undefined;
    const fetchInitialData = async (isCurrent: () => boolean) => {
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

      if (!isCurrent()) return;
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
      setModalMsg(null);
      cancelOptions = loadFormOptions(fetchInitialData, setModalMsg);
      if (record) {
        // Populate form
        form.setFieldsValue({
          ...record,
          PlantingDate: record.PlantingDate ?? null,
          GerminationDate: record.GerminationDate ?? null,
        });
        setSeedType(record.SeedType ?? null);
      } else {
        form.resetFields();
        setSeedType(null);
        setSelectedOrder(null);
        setShowVarietyInfo(false);
      }
    }
    return cancelOptions;
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

  const handleClose = () => {
    setModalMsg(null);
    setModalOpen(false);
  };

  const handleSubmit = async (
    values: import("zod").input<typeof seedPlantingInputSchema>,
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
          await refreshSavedForm(refreshData);
          setTimeout(() => {
            handleClose();
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
      onClose={handleClose}
      heading={modalTitle}
      description={modalSubTitle}
      icon={<ExperimentOutlined />}
      editing={isEdit}
    >
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
              <FormItem
                label={
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    📦 کد سفارش
                  </span>
                }
                name="OrderID"
                rules={[{ required: true, message: "انتخاب سفارش الزامی است" }]}
                className="mb-0"
              >
                <Select
                  placeholder="جستجو و انتخاب سفارش"

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
              </FormItem>

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
                      <span className="flex flex-wrap items-baseline gap-x-1 font-semibold text-slate-700 dark:text-slate-200">
                        گیاه پایه
                        <bdi lang="en" className="text-xs font-normal">
                          (ROOTSTOCK)
                        </bdi>
                      </span>
                      <Checkbox checked={seedType === false} />
                    </div>
                    <VarietyLabel
                      variety={
                        selectedOrder
                          .Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage
                          ?.Tbl_plantVariety
                      }
                    />
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
                      <span className="flex flex-wrap items-baseline gap-x-1 font-semibold text-slate-700 dark:text-slate-200">
                        پیوندک
                        <bdi lang="en" className="text-xs font-normal">
                          (SCION)
                        </bdi>
                      </span>
                      <Checkbox checked={seedType === true} />
                    </div>
                    <VarietyLabel
                      variety={
                        selectedOrder
                          .Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage
                          ?.Tbl_plantVariety
                      }
                    />
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
                <span className="text-xs font-mono font-bold text-slate-600 mt-2 bg-slate-100 px-2 py-0.5 rounded dark:bg-slate-800 dark:text-slate-200">
                  {selectedOrder.OrderCode}
                </span>
              </div>
            )}
          </div>

          {/* Planting Date & Count */}
          <FormGrid className="mt-5">
            <FormItem
              label={
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  📅 تاریخ کاشت
                </span>
              }
              name="PlantingDate"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </FormItem>
            <FormItem
              label={
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  🔢 تعداد بذر کاشته شده
                </span>
              }
              name="SeedPlantingNumber"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} />
            </FormItem>
          </FormGrid>
        </div>

        {/* Section 2: Tray Info & Location */}
        <FormGrid title="اطلاعات سینی و گلخانه" columns={3}>
          <FormItem label="🏠 نام گلخانه" name="GreenhouseID">
            <Select
              options={greenhouses}

              placeholder="انتخاب گلخانه"
            />
          </FormItem>

          <FormItem
            label="👨‍🔧 تکنسین مسئول"
            name="TechnicianID"
            rules={[{ required: true }]}
          >
            <Select
              options={technicians}

              placeholder="انتخاب تکنسین"
            />
          </FormItem>

          <FormItem
            label="📥 تعداد سینی"
            name="TrayNumber"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} />
          </FormItem>

          <FormItem
            label="تعداد حفره"
            name="CellPerTrayNumber"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: "24", value: 24 },
                { label: "45", value: 45 },
                { label: "52", value: 52 },
                { label: "72", value: 72 },
                { label: "105", value: 105 },
                { label: "128", value: 128 },
              ]}
            />
          </FormItem>

          <FormItem
            label="ابعاد حفره (cm)"
            name="CellHeight"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}

              suffix="cm"
            />
          </FormItem>

          <FormItem label="جنس سینی" name="TrayMaterial">
            <Select
              options={[
                { label: "پلی اتیلن", value: "پلی اتیلن" },
                { label: "پلی استیرن", value: "پلی استیرن" },
              ]}
            />
          </FormItem>
        </FormGrid>

        {/* Section 3: Bedding Info */}
        <FormGrid title="اطلاعات بستر کشت" columns={3}>
          <FormItem label="بستر کشت" name="PlantingBed">
            <Select
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
          </FormItem>
          <FormItem label="نسبت مخلوط" name="PlantingBedRatio">
            <InputNumber placeholder="مثلا 1.7" step={0.1} />
          </FormItem>
          <FormItem label="تاریخ ورود به اتاق جوانه زنی" name="GerminationDate">
            <DatePicker />
          </FormItem>
        </FormGrid>

        {/* Actions */}
        <FormActions
          message={modalMsg}
          onCancel={handleClose}
          loading={loading}
          editing={isEdit}
        />
      </Form>
    </Modal>
  );
}
