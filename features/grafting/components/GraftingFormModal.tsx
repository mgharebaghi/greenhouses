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
  FormFields,
  FormGrid,
  FormLabel,
  InputNumber,
  Select,
} from "@/shared/components/FormControls";

import { submitForm, type RefreshFormList } from "@/shared/forms/submit";
import useSavedForm from "@/shared/forms/useSavedForm";

import { publicOrderUrl } from "@/shared/config/public-urls";

import Modal from "@/shared/components/FormModal";

import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ComponentProps } from "react";
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
  refreshData: RefreshFormList;
  formData: GraftingFormData;
  initialData?:
    Partial<GraftingCreateDTO> | GraftingOperationWithDetails | null;
}

type GraftingFormValues = import("zod").input<
  typeof createGraftingOperationSchema
>;

const resolveGrafting = withoutBlankPathErrors(
  zodResolver(createGraftingOperationSchema, validationOptions, { raw: true }),
);
const operationFields = [
  "OrderID",
  "ColdRoomExitDate",
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
] as const;

const plantingBeds = ["مخلوط کوکوپیت و پرلیت", "پیت ماس"];
const graftingClamps = [
  "سیلیکونی",
  "پلاستیکی U شکل",
  "پلاستیکی O شکل",
  "فلزی ساده",
  "فنری",
  "نایلونی",
  "کششی",
  "کلیپس",
];
const graftingSticks = ["بامبو", "پلاستیکی", "فلزی"];

function GraftingChoice({
  values,
  saved,
  ...props
}: ComponentProps<typeof Select<string>> & {
  values: string[];
  saved?: string | null;
}) {
  const [search, setSearch] = useState("");
  const choices = new Set(values);
  if (saved) choices.add(saved);
  if (props.value) choices.add(props.value);
  const typed = search.trim();
  if (typed) choices.add(typed);
  return (
    <Select<string>
      {...props}
      showSearch
      optionFilterProp="label"
      options={Array.from(choices, (value) => ({ label: value, value }))}
      searchValue={search}
      onSearch={setSearch}
      onOpenChange={(open) => {
        if (!open) setSearch("");
      }}
    />
  );
}

export default function GraftingFormModal({
  open,
  onCancel,
  refreshData,
  formData,
  initialData,
}: Props) {
  const savedForm = useSavedForm();
  const [loading, setLoading] = useState(false);
  const [messageState, setMessageState] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // Wizard Step State
  const [validationAttempted, setValidationAttempted] = useState(false);

  const isEdit = !!initialData;

  const methods = useForm<GraftingFormValues>({
    resolver: resolveGrafting,
    mode: "onChange",
    defaultValues: {
      Workers: [],
      // No other defaults as requested
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
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
      setValidationAttempted(false);
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
          ColdRoomExitDate: initialData.ColdRoomExitDate ?? undefined,
          GraftingDate: initialData.GraftingDate ?? undefined,
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
      setValue("GraftingDate", coldRoomExitDate, {
        shouldValidate: validationAttempted,
      });
    }
  }, [coldRoomExitDate, graftingDate, setValue, isEdit, validationAttempted]);

  const selectedOrderId = watch("OrderID");
  const selectedOrder = formData.orders.find((o) => o.ID === selectedOrderId);
  // Correct QR URL Format
  const orderQrContent = selectedOrder ? publicOrderUrl(selectedOrder.ID) : "";

  const handleNext = async () => {
    setValidationAttempted(true);
    setMessageState(null);
    const step1Valid = await trigger(operationFields, { shouldFocus: true });

    if (step1Valid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const onSubmit = async (data: GraftingFormValues) => {
    if (loading || savedForm.saved) return;
    await submitForm(
      async () => {
        setLoading(true);
        setMessageState(null);

        const id = (initialData as GraftingOperationWithDetails | null)?.ID;
        const res = id
          ? await updateGraftingOperation(id, data)
          : await createGraftingOperation(data);

        applyHookFormErrors(setError, res);
        if (res.status === "ok") {
          await savedForm.complete(
            res.message || "عملیات با موفقیت انجام شد",
            refreshData,
            handleClose,
          );
        } else if (
          operationFields.some((name) => res.fieldErrors?.[name]?.[0])
        ) {
          setStep(1);
        } else if (
          !Object.entries(res.fieldErrors ?? {}).some(
            ([path, messages]) => path && messages[0],
          )
        ) {
          setMessageState({
            status: "error",
            message: res.message || "خطا در انجام عملیات",
          });
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
      busy={loading}
      savedForm={savedForm}
      heading={
        step === 1
          ? isEdit
            ? "ویرایش عملیات پیوند"
            : "ثبت عملیات پیوند"
          : "لیست پیوند‌زنان"
      }
      description={step === 1 ? "مرحله ۱: اطلاعات پایه" : "مرحله ۲: نیروی کار"}
      editing={isEdit}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            if (step === 1) {
              event.preventDefault();
              void handleNext();
            } else {
              void handleSubmit(onSubmit, (invalid) => {
                setMessageState(null);
                if (operationFields.some((name) => invalid[name])) setStep(1);
              })(event);
            }
          }}
        >
          <FormFields className="space-y-5">
            {/* STEP 1: Operation Details */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Order Section */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex flex-col-reverse md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full">
                      <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                        کد سفارش <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Controller
                        control={control}
                        name="OrderID"
                        render={({ field, fieldState }) => (
                          <>
                            <Select
                              {...field}
                              showSearch
                              placeholder="انتخاب کد سفارش"
                              optionFilterProp="label"

                              status={fieldState.invalid ? "error" : ""}
                              options={formData.orders.map((o) => ({
                                value: o.ID,
                                label: o.OrderCode,
                              }))}
                              disabled={isEdit}
                            />
                            <FieldFeedback
                              message={fieldState.error?.message}
                            />
                          </>
                        )}
                      />
                    </div>

                    {/* QR Code Display (Only if selected) */}
                    {selectedOrder && (
                      <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl shadow-inner min-w-[100px]">
                        <QRCodeCanvas value={orderQrContent} size={64} />
                        <span className="text-[10px] text-slate-600 mt-1 font-mono dark:text-slate-300">
                          {selectedOrder.OrderCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates Section */}
                <FormGrid title="زمان‌بندی پیوند">
                  {/* ... Dates (Same as before) ... */}
                  <div>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      تاریخ خروج از سردخانه{" "}
                      <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Controller
                      control={control}
                      name="ColdRoomExitDate"
                      render={({ field, fieldState }) => (
                        <>
                          <DatePicker
                            {...field}
                            ref={field.ref}

                            placeholder="انتخاب تاریخ"
                          />
                          <FieldFeedback message={fieldState.error?.message} />
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      تاریخ پیوند <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Controller
                      control={control}
                      name="GraftingDate"
                      render={({ field, fieldState }) => (
                        <>
                          <DatePicker
                            {...field}
                            ref={field.ref}

                            placeholder="انتخاب تاریخ"
                          />
                          <FieldFeedback message={fieldState.error?.message} />
                        </>
                      )}
                    />
                  </div>
                </FormGrid>

                {/* Tray Info */}
                <FormGrid title="اطلاعات سینی کاشت">
                  <div>
                    <FormLabel className="text-xs font-medium text-slate-500 mb-1 block">
                      تعداد سینی
                    </FormLabel>
                    <Controller
                      control={control}
                      name="TrayNumber"
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
                  <div>
                    <FormLabel className="text-xs font-medium text-slate-500 mb-1 block">
                      تعداد حفره
                    </FormLabel>
                    <Controller
                      control={control}
                      name="CellPerTrayNumber"
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
                  <div>
                    <FormLabel className="text-xs font-medium text-slate-500 mb-1 block">
                      ابعاد حفره (cm)
                    </FormLabel>
                    <Controller
                      control={control}
                      name="CellHeight"
                      render={({ field, fieldState }) => (
                        <>
                          <InputNumber
                            {...field}

                            suffix="cm"
                            status={fieldState.invalid ? "error" : ""}
                          />
                          <FieldFeedback message={fieldState.error?.message} />
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <FormLabel className="text-xs font-medium text-slate-500 mb-2 block">
                      جنس سینی
                    </FormLabel>
                    <Controller
                      control={control}
                      name="TrayMaterial"
                      render={({ field, fieldState }) => (
                        <>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
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
                          <FieldFeedback message={fieldState.error?.message} />
                        </>
                      )}
                    />
                  </div>
                </FormGrid>

                {/* Tools */}
                <FormGrid title="بستر، ابزار و تکنسین" columns={3}>
                  <div>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      بستر کشت
                    </FormLabel>
                    <Controller
                      control={control}
                      name="PlantingBed"
                      render={({ field, fieldState }) => (
                        <>
                          <GraftingChoice
                            {...field}
                            placeholder="انتخاب یا تایپ بستر کشت"
                            values={plantingBeds}
                            saved={initialData?.PlantingBed}
                            status={fieldState.invalid ? "error" : ""}
                          />
                          <FieldFeedback message={fieldState.error?.message} />
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      نسبت مخلوط
                    </FormLabel>
                    <Controller
                      control={control}
                      name="PlantingBedRatio"
                      render={({ field, fieldState }) => (
                        <>
                          <InputNumber
                            {...field}

                            placeholder="مثلا 1/7"
                            status={fieldState.invalid ? "error" : ""}
                          />
                          <FieldFeedback message={fieldState.error?.message} />
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      نوع گیره
                    </FormLabel>
                    <Controller
                      control={control}
                      name="GraftingClamp"
                      render={({ field, fieldState }) => (
                        <>
                          <GraftingChoice
                            {...field}
                            placeholder="انتخاب یا تایپ نوع گیره"
                            values={graftingClamps}
                            saved={initialData?.GraftingClamp}
                            status={fieldState.invalid ? "error" : ""}
                          />
                          <FieldFeedback message={fieldState.error?.message} />
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      نوع قیم (Stick)
                    </FormLabel>
                    <Controller
                      control={control}
                      name="GraftingStick"
                      render={({ field, fieldState }) => (
                        <>
                          <GraftingChoice
                            {...field}
                            placeholder="انتخاب یا تایپ نوع قیم"
                            values={graftingSticks}
                            saved={initialData?.GraftingStick}
                            status={fieldState.invalid ? "error" : ""}
                          />
                          <FieldFeedback message={fieldState.error?.message} />
                        </>
                      )}
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      نام تکنسین پیوند
                    </FormLabel>
                    <Controller
                      control={control}
                      name="GraftingTechnicianID"
                      render={({ field, fieldState }) => (
                        <>
                          <Select
                            {...field}
                            showSearch
                            optionFilterProp="label"

                            placeholder="انتخاب تکنسین فنی"
                            status={fieldState.invalid ? "error" : ""}
                            options={formData.people.map((p) => ({
                              value: p.ID,
                              label: `${p.FirstName} ${p.LastName} - ${p.NationalCode || "بدون کد ملی"}`,
                            }))}
                          />
                          <FieldFeedback message={fieldState.error?.message} />
                        </>
                      )}
                    />
                  </div>
                </FormGrid>
              </div>
            )}

            {/* STEP 2: Workers List */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Top Info Bar (Order & Main QR) */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
                  <div className="flex-1 text-center">
                    <span className="block text-sm text-slate-600 mb-1 dark:text-slate-300">
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
                <FieldFeedback
                  message={
                    errors.Workers?.root?.message ?? errors.Workers?.message
                  }
                />
              </div>
            )}
          </FormFields>

          <FormActions
            message={
              messageState ??
              (validationAttempted && Object.keys(errors).length
                ? { status: "error", message: INVALID_FORM_MESSAGE }
                : null)
            }
            onCancel={handleClose}
            loading={loading}
            editing={isEdit}
            nextStep={step === 1}
            onBack={step === 2 ? handleBack : undefined}
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
