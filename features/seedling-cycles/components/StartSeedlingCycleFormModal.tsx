"use client";

import {
  applyHookFormErrors,
  withoutBlankPathErrors,
} from "@/shared/forms/field-errors";

import {
  INVALID_FORM_MESSAGE,
  validationOptions,
} from "@/shared/validation/input";

import {
  FieldFeedback,
  Checkbox,
  DatePicker,
  FormActions,
  FormGrid,
  FormLabel,
  Input,
  InputNumber,
  Select,
} from "@/shared/components/FormControls";
import QrImage from "@/shared/components/QrImage";

import { submitForm } from "@/shared/forms/submit";

import type { CycleGreenhouseOption, CycleOrderOption } from "../types";

import { publicOrderUrl } from "@/shared/config/public-urls";

import Modal from "@/shared/components/FormModal";

import { PlusOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Controller, useController, useForm } from "react-hook-form";
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

const resolveCycle = withoutBlankPathErrors(
  zodResolver(startSeedlingCycleSchema, validationOptions, { raw: true }),
);

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
    message: string;
  } | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const isEdit = !!record;

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    resetField,
    formState: { errors, isSubmitted },
  } = useForm<StartSeedlingCycleFormValues>({
    resolver: resolveCycle,
    defaultValues: {
      SeedType: undefined, // Explicitly undefined to force selection
    },
  });

  const {
    field: seedType,
    fieldState: { error: seedTypeError },
  } = useController({ control, name: "SeedType" });

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
          GerminationRoomExitDate: record.GerminationRoomExitDate ?? undefined,
          NumberOfLostSeedlingFromGermination:
            record.NumberOfLostSeedlingFromGermination ?? undefined,
          GreenhouseEntryDate: record.GreenhouseEntryDate ?? undefined,
          NumberOfTrays: record.NumberOfTrays ?? undefined,
          GreenhouseID: record.GreenhouseID || undefined,
          SalonName: record.SalonName || undefined,
          GreenhouseExitDate: record.GreenhouseExitDate ?? null,
          NumberOfLostSeedlingFromGreenhouse:
            record.NumberOfLostSeedlingFromGreenhouse ?? undefined,
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

  const onSubmit = async (data: StartSeedlingCycleFormValues) => {
    await submitForm(
      async () => {
        setLoading(true);
        setMessageState(null);

        let res;
        if (isEdit && record?.ID) {
          res = await updateStartSeedlingCycle(record.ID, data);
        } else {
          res = await createStartSeedlingCycle(data);
        }

        setLoading(false);
        applyHookFormErrors(setError, res);
        if (res.status === "ok") {
          setMessageState({ status: "ok", message: res.message });
          if (!isEdit) {
            reset();
            setSelectedOrder(null);
          }
          setTimeout(() => {
            onSuccess();
            setMessageState(null);
          }, 1000);
        } else if (
          !Object.values(res.fieldErrors ?? {}).some(
            (messages) => messages.length,
          )
        ) {
          setMessageState({ status: "error", message: res.message });
        }
      },
      (feedback) =>
        setMessageState({ status: "error", message: feedback.message }),
      () => setLoading(false),
    );
  };

  // Theme Configuration

  const handleClose = () => {
    setMessageState(null);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      heading={isEdit ? "ویرایش سیکل نشاء" : "شروع سیکل نشاء"}
      description={
        isEdit
          ? "اطلاعات سیکل را ویرایش کنید"
          : "اطلاعات سیکل جدید را وارد کنید"
      }
      icon={<PlusOutlined />}
      editing={isEdit}
    >
      <form
        onSubmit={handleSubmit(onSubmit, () => setMessageState(null))}
        className="space-y-5"
      >
        {/* Order & Seed Type Section - Card Style */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-300">
          <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* Inputs Column */}
            <div className="flex-1 space-y-5">
              <div>
                <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                  📦 کد سفارش <span className="text-rose-500">*</span>
                </FormLabel>
                <Controller
                  name="OrderID"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        showSearch
                        optionFilterProp="label"
                        options={orders}
                        placeholder="جستجو و انتخاب سفارش"

                        status={fieldState.invalid ? "error" : ""}
                        onChange={(val) => {
                          field.onChange(val);
                          handleOrderChange(val);
                        }}
                        disabled={isEdit} // Disable order change on edit for safety
                      />
                      <FieldFeedback message={fieldState.error?.message} />
                    </>
                  )}
                />
              </div>

              {/* Variety & Seed Type Selection */}
              {selectedOrder && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                      seedType.value === false
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50 dark:bg-slate-900"
                    }`}
                    onClick={() => seedType.onChange(false)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        🌱 واریته گیاه پایه
                      </span>
                      <Checkbox
                        checked={seedType.value === false}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => seedType.onChange(false)}
                        aria-label="واریته گیاه پایه"
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
                      seedType.value === true
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50 dark:bg-slate-900"
                    }`}
                    onClick={() => seedType.onChange(true)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        🌿 واریته پیوندک
                      </span>
                      <Checkbox
                        checked={seedType.value === true}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => seedType.onChange(true)}
                        aria-label="واریته پیوندک"
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
                <span className="text-xs font-mono font-bold text-slate-600 mt-2 bg-slate-100 px-2 py-0.5 rounded dark:bg-slate-800 dark:text-slate-200">
                  {selectedOrder.label}
                </span>
              </div>
            )}
          </div>
          {selectedOrder && seedTypeError && (
            <FieldFeedback
              message={
                seedTypeError.type === "server"
                  ? seedTypeError.message
                  : "لطفاً نوع بذر (پایه یا پیوندک) را انتخاب کنید"
              }
            />
          )}
        </div>

        {/* Dates & Numbers Grid */}
        <FormGrid title="ورود و استقرار در گلخانه">
          {/* Germination Date */}
          <div className="relative">
            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              📅 تاریخ خروج از اتاق جوانه زنی{" "}
              <span className="text-rose-500">*</span>
            </FormLabel>
            <Controller
              name="GerminationRoomExitDate"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <DatePicker
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (!isEdit && value) {
                        setValue("GreenhouseEntryDate", value, {
                          shouldValidate: isSubmitted,
                        });
                      }
                    }}
                  />
                  <FieldFeedback message={fieldState.error?.message} />
                </>
              )}
            />
            <p className="text-[11px] text-slate-600 mt-1 mr-1 dark:text-slate-300">
              بعد از انتخاب، تاریخ ورود به گلخانه بصورت خودکار تکمیل می‌شود
            </p>
          </div>

          {/* Germination Lost */}
          <div>
            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              🥀 تعداد تلفات بعد از خروج از اتاق جوانه زنی
            </FormLabel>
            <Controller
              name="NumberOfLostSeedlingFromGermination"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputNumber
                    {...field}

                    status={fieldState.invalid ? "error" : ""}
                  />
                  <FieldFeedback message={fieldState.error?.message} />
                </>
              )}
            />
          </div>

          {/* Greenhouse Entry Date */}
          <div>
            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              📅 تاریخ ورود به گلخانه (نرسری){" "}
              <span className="text-rose-500">*</span>
            </FormLabel>
            <Controller
              name="GreenhouseEntryDate"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FieldFeedback message={fieldState.error?.message} />
                </>
              )}
            />
          </div>

          {/* Number of Trays */}
          <div>
            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              📥 تعداد سینی
            </FormLabel>
            <Controller
              name="NumberOfTrays"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputNumber {...field} />
                  <FieldFeedback message={fieldState.error?.message} />
                </>
              )}
            />
          </div>

          {/* Greenhouse Select */}
          <div>
            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              🏠 نام گلخانه (نرسری) <span className="text-rose-500">*</span>
            </FormLabel>
            <Controller
              name="GreenhouseID"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={greenhouses}
                    placeholder="انتخاب گلخانه"

                    status={fieldState.invalid ? "error" : ""}
                  />
                  <FieldFeedback message={fieldState.error?.message} />
                </>
              )}
            />
          </div>

          {/* Salon Name */}
          <div>
            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              🏷️ نام سالن
            </FormLabel>
            <Controller
              name="SalonName"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} />
                  <FieldFeedback message={fieldState.error?.message} />
                </>
              )}
            />
          </div>
        </FormGrid>

        {/* Exit Section (Optional) */}
        <FormGrid title="اطلاعات خروج">
          <div>
            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              🚪 تاریخ خروج از اتاق نرسری :{" "}
              <span className="text-[10px] text-rose-600 dark:text-rose-400">
                تاریخ ورود به سردخانه (Cold Room)
              </span>
            </FormLabel>
            <Controller
              name="GreenhouseExitDate"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}

                    placeholder="14..../..../...."
                  />
                  <FieldFeedback message={fieldState.error?.message} />
                </>
              )}
            />
          </div>

          <div>
            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              📉 تلفات بعد از خروج از گلخانه
            </FormLabel>
            <Controller
              name="NumberOfLostSeedlingFromGreenhouse"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputNumber {...field} />
                  <FieldFeedback message={fieldState.error?.message} />
                </>
              )}
            />
          </div>
        </FormGrid>

        {/* Actions */}
        <FormActions
          message={
            messageState ??
            (isSubmitted && Object.keys(errors).length
              ? { status: "error", message: INVALID_FORM_MESSAGE }
              : null)
          }
          onCancel={handleClose}
          loading={loading}
          editing={isEdit}
        />
      </form>
    </Modal>
  );
}
