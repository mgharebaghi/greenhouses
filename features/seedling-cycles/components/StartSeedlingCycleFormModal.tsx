"use client";
import QrImage from "@/shared/components/QrImage";

import { submitForm } from "@/shared/forms/submit";

import type { CycleGreenhouseOption, CycleOrderOption } from "../types";

import { publicOrderUrl } from "@/shared/config/public-urls";

import Modal from "@/shared/components/FormModal";

import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DatePicker from "@/shared/components/PersianDatePicker";
import {
  CheckCircleOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Input, InputNumber, Select } from "antd";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createStartSeedlingCycle, updateStartSeedlingCycle } from "../actions";
import {
  StartSeedlingCycleFormValues,
  startSeedlingCycleSchema,
} from "../schema";
import { StartSeedlingCycle } from "../types";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  orders: CycleOrderOption[];
  greenhouses: CycleGreenhouseOption[];
  record?: StartSeedlingCycle | null;
}

export default function StartSeedlingCycleFormModal({
  open,
  onCancel,
  onSuccess,
  orders,
  greenhouses,
  record,
}: Props) {
  const [selectedOrder, setSelectedOrder] = useState<CycleOrderOption | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [messageState, setMessageState] = useState<{
    status: "ok" | "error";
    text: string;
  } | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const isEdit = !!record;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm<
    import("zod").input<typeof startSeedlingCycleSchema>,
    unknown,
    StartSeedlingCycleFormValues
  >({
    resolver: zodResolver(startSeedlingCycleSchema),
    defaultValues: {
      SeedType: undefined, // Explicitly undefined to force selection
    },
  });

  const watchedGerminationExitDate = watch("GerminationRoomExitDate");

  // Auto-fill GreenhouseEntryDate when GerminationRoomExitDate changes
  useEffect(() => {
    if (watchedGerminationExitDate && !isEdit) {
      // Only auto-fill on create
      setValue("GreenhouseEntryDate", watchedGerminationExitDate);
    }
  }, [watchedGerminationExitDate, setValue, isEdit]);

  // Handle Edit Mode Population
  useEffect(() => {
    if (open) {
      setMessageState(null);
      setQrCodeUrl(null); // Reset on open
      if (record) {
        // Populate form for edit
        // Note: This requires mapping the record back to form values.
        // For now, we focus on UI structure as requested.
        // Complex fields like `SeedType` depend on `orders` being loaded.
        // We might need to find the order in `orders` and set it.
        if (record.OrderID && orders.length > 0) {
          const order = orders.find((o) => o.value === record.OrderID);
          if (order) setSelectedOrder(order ?? null);
        }
        // Naive population - might need adjustment for Dates (string vs Date)
        reset({
          OrderID: record.OrderID || undefined,
          SeedType: record.SeedType ?? undefined,
          GerminationRoomExitDate: record.GerminationRoomExitDate
            ? new Date(record.GerminationRoomExitDate)
            : undefined,
          NumberOfLostSeedlingFromGermination:
            record.NumberOfLostSeedlingFromGermination || undefined,
          GreenhouseEntryDate: record.GreenhouseEntryDate
            ? new Date(record.GreenhouseEntryDate)
            : undefined,
          NumberOfTrays: record.NumberOfTrays || undefined,
          GreenhouseID: record.GreenhouseID || undefined,
          SalonName: record.SalonName || undefined,
          GreenhouseExitDate: record.GreenhouseExitDate
            ? new Date(record.GreenhouseExitDate)
            : null,
          NumberOfLostSeedlingFromGreenhouse:
            record.NumberOfLostSeedlingFromGreenhouse || undefined,
        });
      } else {
        reset({ SeedType: undefined });
        setSelectedOrder(null);
      }
    }
  }, [open, record, orders, reset]);

  // Update QR Code when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      // Updated to use the specific URL format as requested by user
      const qrContent = publicOrderUrl(selectedOrder.value);

      QRCode.toDataURL(qrContent, {
        width: 200,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      })
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("QR Generation Error", err);
          setQrCodeUrl(null);
        });
    } else {
      setQrCodeUrl(null);
    }
  }, [selectedOrder]);

  const handleOrderChange = (orderId: number) => {
    const order = orders.find((o) => o.value === orderId);
    setSelectedOrder(order ?? null);
    // Reset seed type when order changes
    resetField("SeedType");
  };

  const handleSeedTypeChange = (type: boolean) => {
    setValue("SeedType", type);
  };

  const onSubmit = async (data: StartSeedlingCycleFormValues) => {
    await submitForm(
      async () => {
        const payload = data as StartSeedlingCycleFormValues;
        setLoading(true);
        setMessageState(null);

        let res;
        if (isEdit && record?.ID) {
          res = await updateStartSeedlingCycle(record.ID, payload);
        } else {
          res = await createStartSeedlingCycle(payload);
        }

        setLoading(false);
        if (res.status === "ok") {
          setMessageState({ status: "ok", text: res.message });
          if (!isEdit) {
            reset();
            setSelectedOrder(null);
          }
          setTimeout(() => {
            onSuccess();
            setMessageState(null);
          }, 1000);
        } else {
          setMessageState({ status: "error", text: res.message });
        }
      },
      (feedback) =>
        setMessageState({ status: "error", text: feedback.message }),
      () => setLoading(false),
    );
  };

  // Theme Configuration
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

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={780} // Increased width slightly to match standard
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
          onClick={onCancel}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border transition-all flex items-center justify-center shadow-sm hover:shadow hover:bg-${theme.accent}-50 border-${theme.accent}-200 hover:border-${theme.accent}-300 text-${theme.accent}-600 hover:text-${theme.accent}-700 dark:border-slate-600 dark:hover:border-${theme.accent}-700 dark:hover:bg-${theme.accent}-900/20 dark:text-${theme.accent}-500`}
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${theme.iconBg}`}
            >
              {isEdit ? (
                <EditOutlined className="text-2xl" />
              ) : (
                <PlusOutlined className="text-2xl" />
              )}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-800 ${theme.iconDot}`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${theme.textMain}`}>
              {isEdit ? "ویرایش سیکل نشاء" : "شروع سیکل نشاء"}
            </h3>
            <p
              className={`text-sm mt-1 flex items-center gap-1.5 ${theme.textSub}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse bg-${theme.accent}-400`}
              ></span>
              {isEdit
                ? "اطلاعات سیکل را ویرایش کنید"
                : "اطلاعات سیکل جدید را وارد کنید"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[75vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Order & Seed Type Section - Card Style */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex flex-col-reverse md:flex-row gap-6">
              {/* Inputs Column */}
              <div className="flex-1 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                    📦 کد سفارش <span className="text-rose-500">*</span>
                  </label>
                  <Controller
                    name="OrderID"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        showSearch
                        optionFilterProp="label"
                        options={orders}
                        placeholder="جستجو و انتخاب سفارش"
                        className="w-full"
                        size="large"
                        status={errors.OrderID ? "error" : ""}
                        onChange={(val) => {
                          field.onChange(val);
                          handleOrderChange(val);
                        }}
                        disabled={isEdit} // Disable order change on edit for safety
                      />
                    )}
                  />
                  {errors.OrderID && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.OrderID.message}
                    </p>
                  )}
                </div>

                {/* Variety & Seed Type Selection */}
                {selectedOrder && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                        watch("SeedType") === false
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
                          checked={watch("SeedType") === false}
                          className="scale-110"
                        />
                      </div>
                      <div
                        className="text-sm text-slate-600 dark:text-slate-400 font-mono truncate"
                        title={selectedOrder.rootstockVariety ?? undefined}
                      >
                        {selectedOrder.rootstockVariety || "---"}
                      </div>
                    </div>

                    <div
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                        watch("SeedType") === true
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
                          checked={watch("SeedType") === true}
                          className="scale-110"
                        />
                      </div>
                      <div
                        className="text-sm text-slate-600 dark:text-slate-400 font-mono truncate"
                        title={selectedOrder.scionVariety ?? undefined}
                      >
                        {selectedOrder.scionVariety || "---"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code Column */}
              {selectedOrder && qrCodeUrl && (
                <div className="flex flex-col items-center justify-start py-1 animate-in zoom-in-90 duration-300">
                  <div className="bg-white p-2 rounded-xl border-2 border-slate-200 shadow-sm">
                    <QrImage
                      src={qrCodeUrl}
                      alt="Order QR Code"
                      className="w-28 h-28 md:w-32 md:h-32 object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 mt-2 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedOrder.label}
                  </span>
                </div>
              )}
            </div>
            {errors.SeedType && (
              <p className="text-red-500 text-xs mt-3 text-center font-medium">
                لطفاً نوع بذر (پایه یا پیوندک) را انتخاب کنید
              </p>
            )}
          </div>

          {/* Dates & Numbers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Germination Date */}
            <div className="relative">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                📅 تاریخ خروج از اتاق جوانه زنی{" "}
                <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="GerminationRoomExitDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date?.toDate())}
                    inputClass={`w-full h-[46px] px-3 border-2 rounded-xl outline-none transition-all ${
                      errors.GerminationRoomExitDate
                        ? "border-rose-300 focus:border-rose-400 dark:border-rose-800"
                        : "border-slate-200 dark:border-slate-700 focus:border-emerald-400 dark:focus:border-emerald-600"
                    } dark:bg-slate-800 dark:text-white`}
                    containerStyle={{ width: "100%" }}
                  />
                )}
              />
              {errors.GerminationRoomExitDate && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.GerminationRoomExitDate.message}
                </p>
              )}
              <p className="text-[11px] text-slate-400 mt-1 mr-1">
                بعد از انتخاب، تاریخ ورود به گلخانه بصورت خودکار تکمیل می‌شود
              </p>
            </div>

            {/* Germination Lost */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                🥀 تعداد تلفات بعد از خروج از اتاق جوانه زنی
              </label>
              <Controller
                name="NumberOfLostSeedlingFromGermination"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    className="!w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm"
                    size="large"
                    status={
                      errors.NumberOfLostSeedlingFromGermination ? "error" : ""
                    }
                  />
                )}
              />
            </div>

            {/* Greenhouse Entry Date */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                📅 تاریخ ورود به گلخانه (نرسری){" "}
                <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="GreenhouseEntryDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date?.toDate())}
                    inputClass={`w-full h-[46px] px-3 border-2 rounded-xl outline-none transition-all ${
                      errors.GreenhouseEntryDate
                        ? "border-rose-300 focus:border-rose-400 dark:border-rose-800"
                        : "border-slate-200 dark:border-slate-700 focus:border-emerald-400 dark:focus:border-emerald-600"
                    } dark:bg-slate-800 dark:text-white`}
                    containerStyle={{ width: "100%" }}
                  />
                )}
              />
              {errors.GreenhouseEntryDate && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.GreenhouseEntryDate.message}
                </p>
              )}
            </div>

            {/* Number of Trays */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                📥 تعداد سینی
              </label>
              <Controller
                name="NumberOfTrays"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    className="!w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm"
                    size="large"
                  />
                )}
              />
            </div>

            {/* Greenhouse Select */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                🏠 نام گلخانه (نرسری) <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="GreenhouseID"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={greenhouses}
                    placeholder="انتخاب گلخانه"
                    className="w-full"
                    size="large"
                    status={errors.GreenhouseID ? "error" : ""}
                  />
                )}
              />
              {errors.GreenhouseID && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.GreenhouseID.message}
                </p>
              )}
            </div>

            {/* Salon Name */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                🏷️ نام سالن
              </label>
              <Controller
                name="SalonName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm"
                    size="large"
                  />
                )}
              />
            </div>
          </div>

          {/* Exit Section (Optional) */}
          <div className="mt-6 pt-6 border-t-2 border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="font-bold text-slate-700 dark:text-slate-200">
                اطلاعات خروج
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  🚪 تاریخ خروج از اتاق نرسری :{" "}
                  <span className="text-[10px] text-rose-600 dark:text-rose-400">
                    تاریخ ورود به سردخانه (Cold Room)
                  </span>
                </label>
                <Controller
                  name="GreenhouseExitDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date?.toDate())}
                      inputClass="w-full h-[46px] px-3 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl outline-none focus:border-rose-400 dark:focus:border-rose-600 transition-all font-mono"
                      placeholder="14..../..../...."
                      containerStyle={{ width: "100%" }}
                    />
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  📉 تلفات بعد از خروج از گلخانه
                </label>
                <Controller
                  name="NumberOfLostSeedlingFromGreenhouse"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      className="!w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm"
                      size="large"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Message Display */}
          {messageState && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${messageState.status === "ok" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"}`}
            >
              {messageState.status === "ok" ? (
                <CheckCircleOutlined className="text-xl" />
              ) : (
                <ExclamationCircleOutlined className="text-xl" />
              )}
              <span className="font-medium">{messageState.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={onCancel}
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
        </form>
      </div>
    </Modal>
  );
}
