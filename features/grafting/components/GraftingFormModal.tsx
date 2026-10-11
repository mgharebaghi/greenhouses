"use client";

import { submitForm } from "@/shared/forms/submit";

import { publicOrderUrl } from "@/shared/config/public-urls";

import Modal from "@/shared/components/FormModal";

import GreenhouseButton from "@/shared/components/GreenhouseButton";
import DatePicker from "@/shared/components/PersianDatePicker";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import DateObject from "react-date-object";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { createGraftingOperation, updateGraftingOperation } from "../actions";
import { createGraftingOperationSchema } from "../schema";
import {
  GraftingCreateDTO,
  GraftingFormData,
  GraftingOperationWithDetails,
} from "../types";
import GraftingWorkers from "./GraftingWorkers";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  formData: GraftingFormData;
  initialData?:
    Partial<GraftingCreateDTO> | GraftingOperationWithDetails | null;
}

export default function GraftingFormModal({
  open,
  onCancel,
  onSuccess,
  formData,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [messageState, setMessageState] = useState<{
    status: "ok" | "error";
    text: string;
  } | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // Wizard Step State

  const isEdit = !!initialData;

  const methods = useForm<GraftingCreateDTO>({
    resolver: zodResolver(createGraftingOperationSchema),
    defaultValues: {
      Workers: [],
      // No other defaults as requested
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = methods;

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setMessageState(null);
      setStep(1);
      if (initialData) {
        // Populate for edit
        // We need to map initialData to form structure, especially Workers
        const workers =
          ("Tbl_GraftWorkers" in initialData
            ? initialData.Tbl_GraftWorkers
            : []
          )
            ?.map((w) => ({
              PersonID: w.GraftWorkerID ?? w.Tbl_People?.ID,
            }))
            .filter((w): w is { PersonID: number } => w.PersonID != null) || [];

        reset({
          OrderID: initialData.OrderID ?? undefined,
          ColdRoomExitDate: initialData.ColdRoomExitDate
            ? new Date(initialData.ColdRoomExitDate)
            : undefined,
          GraftingDate: initialData.GraftingDate
            ? new Date(initialData.GraftingDate)
            : undefined,
          TrayNumber: initialData.TrayNumber ?? undefined, // Handle both for safety/migration
          CellPerTrayNumber: initialData.CellPerTrayNumber ?? undefined,
          CellHeight: initialData.CellHeight ?? undefined,
          TrayMaterial: initialData.TrayMaterial ?? undefined,
          PlantingBed: initialData.PlantingBed ?? undefined,
          PlantingBedRatio: initialData.PlantingBedRatio ?? undefined,
          GraftingClamp: initialData.GraftingClamp ?? undefined,
          GraftingStick: initialData.GraftingStick ?? undefined,
          GraftingTechnicianID: initialData.GraftingTechnicianID ?? undefined,
          Workers: workers,
        });
      } else {
        reset({
          Workers: [],
        });
      }
    }
  }, [open, initialData, reset]);

  // Auto-sync GraftingDate with ColdRoomExitDate if unset
  const coldRoomExitDate = watch("ColdRoomExitDate");
  const graftingDate = watch("GraftingDate");
  useEffect(() => {
    if (coldRoomExitDate && !graftingDate && !isEdit) {
      setValue("GraftingDate", coldRoomExitDate);
    }
  }, [coldRoomExitDate, graftingDate, setValue, isEdit]);

  const selectedOrderId = watch("OrderID");
  const selectedOrder = formData.orders.find((o) => o.ID === selectedOrderId);
  // Correct QR URL Format
  const orderQrContent = selectedOrder ? publicOrderUrl(selectedOrder.ID) : "";

  const handleNext = async () => {
    // Validate Step 1 fields before moving to Step 2
    const step1Valid = await trigger([
      "OrderID",
      "ColdRoomExitDate",
      "GraftingDate",
      "GraftingDate",
      "TrayNumber",
      "CellPerTrayNumber",
      "CellHeight",
      "TrayMaterial",
      "PlantingBed",
      "PlantingBedRatio",
      "GraftingClamp",
      "GraftingStick",
      "GraftingTechnicianID",
    ]);

    if (step1Valid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const onSubmit = async (data: GraftingCreateDTO) => {
    await submitForm(
      async () => {
        setLoading(true);
        setMessageState(null);

        let res;
        if (isEdit && (initialData as GraftingOperationWithDetails)?.ID) {
          res = await updateGraftingOperation(
            (initialData as GraftingOperationWithDetails).ID,
            data,
          );
        } else {
          res = await createGraftingOperation(data);
        }

        setLoading(false);
        if (res.status === "ok") {
          setMessageState({
            status: "ok",
            text: res.message || "عملیات با موفقیت انجام شد",
          });
          if (!isEdit) {
            reset();
            setStep(1);
          }
          setTimeout(() => {
            onSuccess();
            setMessageState(null);
          }, 1000);
        } else {
          setMessageState({
            status: "error",
            text: res.message || "خطا در انجام عملیات",
          });
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
      };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
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
                <ExperimentOutlined className="text-2xl" />
              )}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-800 ${theme.iconDot}`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${theme.textMain}`}>
              {step === 1
                ? isEdit
                  ? "ویرایش عملیات پیوند"
                  : "ثبت عملیات پیوند"
                : "لیست پیوند‌زنان"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`h-2 w-8 rounded-full ${step === 1 ? `bg-${theme.accent}-500` : "bg-slate-200 dark:bg-slate-700"}`}
              />
              <div
                className={`h-2 w-8 rounded-full ${step === 2 ? `bg-${theme.accent}-500` : "bg-slate-200 dark:bg-slate-700"}`}
              />
              <p className={`text-sm tracking-wide mr-2 ${theme.textSub}`}>
                {step === 1 ? "مرحله ۱: اطلاعات پایه" : "مرحله ۲: نیروی کار"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[75vh] overflow-y-auto">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* STEP 1: Operation Details */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Order Section */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex flex-col-reverse md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                        📦 کد سفارش <span className="text-rose-500">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="OrderID"
                        render={({ field }) => (
                          <Select
                            {...field}
                            showSearch
                            placeholder="انتخاب کد سفارش"
                            optionFilterProp="label"
                            size="large"
                            className="w-full"
                            status={errors.OrderID ? "error" : ""}
                            options={formData.orders.map((o) => ({
                              value: o.ID,
                              label: o.OrderCode,
                            }))}
                            disabled={isEdit}
                          />
                        )}
                      />
                      {errors.OrderID && (
                        <p className="text-rose-500 text-xs mt-1">
                          {errors.OrderID.message}
                        </p>
                      )}
                    </div>

                    {/* QR Code Display (Only if selected) */}
                    {selectedOrder && (
                      <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl shadow-inner min-w-[100px]">
                        <QRCodeCanvas value={orderQrContent} size={64} />
                        <span className="text-[10px] text-slate-400 mt-1 font-mono">
                          {selectedOrder.OrderCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* ... Dates (Same as before) ... */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      📅 تاریخ خروج از سردخانه{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="ColdRoomExitDate"
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          ref={field.ref}
                          containerClassName="w-full"
                          inputClass={`w-full h-[46px] px-3 border-2 rounded-xl outline-none transition-all ${
                            errors.ColdRoomExitDate
                              ? "border-rose-300 focus:border-rose-400 dark:border-rose-800"
                              : "border-slate-200 dark:border-slate-700 focus:border-emerald-400 dark:focus:border-emerald-600"
                          } dark:bg-slate-800 dark:text-white`}
                          placeholder="انتخاب تاریخ"
                          value={field.value ? new Date(field.value) : ""}
                          onChange={(date) => {
                            field.onChange(
                              date instanceof DateObject ? date.toDate() : date,
                            );
                          }}
                        />
                      )}
                    />
                    {errors.ColdRoomExitDate && (
                      <span className="text-rose-500 text-xs">
                        {errors.ColdRoomExitDate.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      🗓️ تاریخ پیوند <span className="text-rose-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="GraftingDate"
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          ref={field.ref}
                          containerClassName="w-full"
                          inputClass={`w-full h-[46px] px-3 border-2 rounded-xl outline-none transition-all ${
                            errors.GraftingDate
                              ? "border-rose-300 focus:border-rose-400 dark:border-rose-800"
                              : "border-slate-200 dark:border-slate-700 focus:border-emerald-400 dark:focus:border-emerald-600"
                          } dark:bg-slate-800 dark:text-white`}
                          placeholder="انتخاب تاریخ"
                          value={field.value ? new Date(field.value) : ""}
                          onChange={(date) => field.onChange(date?.toDate())}
                        />
                      )}
                    />
                    {errors.GraftingDate && (
                      <span className="text-rose-500 text-xs">
                        {errors.GraftingDate.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tray Info */}
                <div className="bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full bg-${theme.accent}-500`}
                    ></span>
                    اطلاعات سینی کاشت
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">
                        تعداد سینی
                      </label>
                      <Controller
                        control={control}
                        name="TrayNumber"
                        render={({ field }) => (
                          <InputNumber
                            {...field}
                            size="large"
                            className="w-full rounded-xl"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">
                        تعداد حفره
                      </label>
                      <Controller
                        control={control}
                        name="CellPerTrayNumber"
                        render={({ field }) => (
                          <InputNumber
                            {...field}
                            size="large"
                            className="w-full rounded-xl"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">
                        ابعاد حفره (cm)
                      </label>
                      <Controller
                        control={control}
                        name="CellHeight"
                        render={({ field }) => (
                          <InputNumber
                            {...field}
                            size="large"
                            className="w-full rounded-xl"
                            suffix="cm"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-slate-500 mb-2 block">
                      جنس سینی
                    </label>
                    <Controller
                      control={control}
                      name="TrayMaterial"
                      render={({ field }) => (
                        <div className="flex gap-4 items-center">
                          <Checkbox
                            checked={field.value === "پلی استیرن"}
                            onChange={() => field.onChange("پلی استیرن")}
                          >
                            پلی استیرن
                          </Checkbox>
                          <Checkbox
                            checked={field.value === "پلی اتیلن"}
                            onChange={() => field.onChange("پلی اتیلن")}
                          >
                            پلی اتیلن
                          </Checkbox>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* ... Other inputs same as before but removed defaults ... */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      بستر کشت
                    </label>
                    <Controller
                      control={control}
                      name="PlantingBed"
                      render={({ field }) => (
                        <Select
                          {...field}
                          mode="tags"
                          maxCount={1}
                          size="large"
                          className="w-full"
                          placeholder="انتخاب یا تایپ بستر کشت"
                          options={[
                            {
                              label: "مخلوط کوکوپیت و پرلیت",
                              value: "مخلوط کوکوپیت و پرلیت",
                            },
                            { label: "پیت ماس", value: "پیت ماس" },
                          ]}
                          value={field.value ? [field.value] : []}
                          onChange={(val) =>
                            field.onChange(val[val.length - 1])
                          }
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      نسبت مخلوط
                    </label>
                    <Controller
                      control={control}
                      name="PlantingBedRatio"
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          size="large"
                          className="w-full rounded-xl"
                          placeholder="مثلا 1/7"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      نوع گیره
                    </label>
                    <Controller
                      control={control}
                      name="GraftingClamp"
                      render={({ field }) => (
                        <Select
                          {...field}
                          mode="tags"
                          maxCount={1}
                          size="large"
                          className="w-full"
                          placeholder="انتخاب یا تایپ نوع گیره"
                          options={[
                            { label: "سیلیکونی", value: "سیلیکونی" },
                            {
                              label: "پلاستیکی U شکل",
                              value: "پلاستیکی U شکل",
                            },
                            {
                              label: "پلاستیکی O شکل",
                              value: "پلاستیکی O شکل",
                            },
                            { label: "فلزی ساده", value: "فلزی ساده" },
                            { label: "فنری", value: "فنری" },
                            { label: "نایلونی", value: "نایلونی" },
                            { label: "کششی", value: "کششی" },
                            { label: "کلیپس", value: "کلیپس" },
                          ]}
                          value={field.value ? [field.value] : []}
                          onChange={(val) =>
                            field.onChange(val[val.length - 1])
                          }
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      نوع قیم (Stick)
                    </label>
                    <Controller
                      control={control}
                      name="GraftingStick"
                      render={({ field }) => (
                        <Select
                          {...field}
                          mode="tags"
                          maxCount={1}
                          size="large"
                          className="w-full"
                          placeholder="انتخاب یا تایپ نوع قیم"
                          options={[
                            { label: "بامبو", value: "بامبو" },
                            { label: "پلاستیکی", value: "پلاستیکی" },
                            { label: "فلزی", value: "فلزی" },
                          ]}
                          value={field.value ? [field.value] : []}
                          onChange={(val) =>
                            field.onChange(val[val.length - 1])
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      نام تکنسین پیوند
                    </label>
                    <Controller
                      control={control}
                      name="GraftingTechnicianID"
                      render={({ field }) => (
                        <Select
                          {...field}
                          showSearch
                          optionFilterProp="label"
                          size="large"
                          className="w-full"
                          placeholder="انتخاب تکنسین فنی"
                          options={formData.people.map((p) => ({
                            value: p.ID,
                            label: `${p.FirstName} ${p.LastName} - ${p.NationalCode || "بدون کد ملی"}`,
                          }))}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Workers List */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Top Info Bar (Order & Main QR) */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
                  <div className="flex-1 text-center">
                    <span className="block text-sm text-slate-500 mb-1">
                      کد سفارش
                    </span>
                    <span className="block text-2xl font-bold text-slate-800 dark:text-white tracking-wider">
                      {selectedOrder?.OrderCode}
                    </span>
                  </div>
                  <div className="relative group">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <QRCodeCanvas value={orderQrContent} size={80} />
                    </div>
                    <div className="absolute top-1/2 right-full mr-4 -translate-y-1/2 hidden group-hover:block transition-all bg-white p-2 rounded-lg shadow-xl z-50">
                      <QRCodeCanvas value={orderQrContent} size={150} />
                    </div>
                  </div>
                </div>

                <GraftingWorkers
                  people={formData.people}
                  loading={loading}
                  orderCode={selectedOrder?.OrderCode || ""}
                />
              </div>
            )}

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

            {/* Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
              <GreenhouseButton
                text="انصراف"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
                className="w-full sm:w-auto min-w-[140px] h-11"
              />

              <div className="flex gap-3 w-full sm:w-auto">
                {step === 2 && (
                  <Button
                    onClick={handleBack}
                    size="large"
                    className="w-full sm:w-auto h-11 px-6 rounded-xl border-slate-300 text-slate-600 hover:text-slate-800 hover:border-slate-400"
                  >
                    <ArrowRightOutlined /> مرحله قبل
                  </Button>
                )}

                {step === 1 ? (
                  <Button
                    type="primary"
                    onClick={handleNext}
                    size="large"
                    className={`w-full sm:w-auto min-w-[140px] h-11 rounded-xl shadow-lg hover:shadow-xl bg-${theme.accent}-600 hover:bg-${theme.accent}-700 border-none`}
                  >
                    مرحله بعد <ArrowLeftOutlined />
                  </Button>
                ) : (
                  <GreenhouseButton
                    text={
                      loading
                        ? "در حال ثبت..."
                        : isEdit
                          ? "ویرایش نهایی"
                          : "ثبت نهایی"
                    }
                    variant="primary"
                    type="submit"
                    loading={loading}
                    className="w-full sm:w-auto min-w-[140px] h-11 shadow-lg hover:shadow-xl"
                  />
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
}
