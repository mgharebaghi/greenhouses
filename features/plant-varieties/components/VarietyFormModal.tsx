"use client";

import FormFeedback from "@/shared/components/FormFeedback";
import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";

import {
  createPlantVariety,
  getPlantVarieties,
  updatePlantVariety,
} from "@/features/plant-varieties/actions";
import type { PlantVarietyRecord } from "@/features/plant-varieties/types/record";
import { getPlants } from "@/features/plants/actions";
import type { PlantRecord } from "@/features/plants/types/record";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import { CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import type { PlantVarietyDTO } from "../types";

type SelectOption = { label: string; value: number };

export type VarietyFormModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: PlantVarietyDTO[]) => void;
  record?: PlantVarietyRecord | null;
};

export default function VarietyFormModal({
  isOpen,
  onClose,
  setMainLoading,
  setMainData,
  record,
}: VarietyFormModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [plantOptions, setPlantOptions] = useState<SelectOption[]>([]);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    text: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  const isEdit = !!record;

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      setMessage(null);
      void getPlantOptions();
      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, record, form]);

  const getPlantOptions = async () => {
    setSelectLoading(true);
    try {
      const plants: PlantRecord[] = await getPlants();
      const options = (plants || []).map((p) => ({
        label: p.CommonName || "بدون نام",
        value: p.ID,
      }));
      setPlantOptions(options);
    } catch (e) {
      console.error(e);
    }
    setSelectLoading(false);
  };

  const fields = [
    {
      name: "VarietyName",
      label: "واریته",
      placeholder: "واریته را وارد کنید",
      type: "text",
      required: true,
      icon: "🌾",
    },
    {
      name: "PlantID",
      label: "نام گیاه",
      placeholder: "گیاه را انتخاب کنید",
      type: "select",
      required: true,
      options: plantOptions,
      icon: "🌱",
    },
    {
      name: "DaysToGermination",
      label: "روز تا جوانه زنی",
      placeholder: "روز",
      type: "number",
      required: false,
      icon: "🌱",
    },
    {
      name: "DaysToSprout",
      label: "روز تا رویش",
      placeholder: "روز",
      type: "number",
      required: false,
      icon: "🌿",
    },
    {
      name: "DaysToSeedling",
      label: "روز تا نشاء",
      placeholder: "روز",
      type: "number",
      required: false,
      icon: "🪴",
    },
    {
      name: "DaysToMaturity",
      label: "روز تا بلوغ",
      placeholder: "روز",
      type: "number",
      required: false,
      icon: "🌳",
    },
    {
      name: "IdealTempMin",
      label: "حداقل دما (°C)",
      placeholder: "دما",
      type: "number",
      required: false,
      icon: "🌡️",
    },
    {
      name: "IdealTempMax",
      label: "حداکثر دما (°C)",
      placeholder: "دما",
      type: "number",
      required: false,
      icon: "🌡️",
    },
    {
      name: "IdealHumidityMin",
      label: "حداقل رطوبت (%)",
      placeholder: "رطوبت",
      type: "number",
      required: false,
      icon: "💧",
    },
    {
      name: "IdealHumidityMax",
      label: "حداکثر رطوبت (%)",
      placeholder: "رطوبت",
      type: "number",
      required: false,
      icon: "💧",
    },
    {
      name: "LightRequirement",
      label: "نیاز نوری",
      placeholder: "نیاز نوری",
      type: "text",
      required: false,
      icon: "☀️",
    },
  ];

  const handleSubmit = async (values: PlantVarietyRecord) => {
    await submitForm(
      async () => {
        setLoading(true);
        setMessage(null);
        const ok = isEdit
          ? await updatePlantVariety({ id: record?.ID || 0, data: values })
          : await createPlantVariety(values);

        applyFieldErrors(form, ok);
        if (ok.status === "ok") {
          setMessage({
            status: "ok",
            text: isEdit
              ? "اطلاعات واریته با موفقیت ویرایش شد"
              : "واریته جدید با موفقیت افزوده شد",
          });
          setMainLoading?.(true);
          const newData = await getPlantVarieties();
          setMainData?.(newData);
          setMainLoading?.(false);

          if (!isEdit) form.resetFields();

          setTimeout(() => {
            onClose?.();
            setMessage(null);
          }, 1500);
        } else {
          setMessage({ status: "error", text: "خطا در انجام عملیات!" });
        }
        setLoading(false);
      },
      (feedback) =>
        setMessage({ status: feedback.status, text: feedback.message }),
      () => {
        setLoading(false);
        setMainLoading?.(false);
      },
    );
  };

  const handleClose = () => {
    onClose?.();
    setMessage(null);
    form.resetFields();
  };

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

  if (!mounted) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      width={780}
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
          onClick={handleClose}
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
              {isEdit ? "ویرایش واریته" : "افزودن واریته"}
            </h3>
            <p
              className={`text-sm mt-1 flex items-center gap-1.5 ${theme.textSub}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse bg-${theme.accent}-400`}
              ></span>
              {isEdit
                ? "اطلاعات واریته را ویرایش کنید"
                : "اطلاعات واریته جدید را وارد کنید"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[70vh] overflow-y-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {fields.map((field) => (
              <Form.Item
                key={field.name}
                label={
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="text-base">{field.icon}</span>
                    {field.label}
                    {field.required && (
                      <span className="text-rose-500 text-xs">*</span>
                    )}
                  </span>
                }
                name={field.name}
                rules={[
                  {
                    required: field.required,
                    message: `لطفاً ${field.label} را وارد کنید`,
                  },
                ]}
                className="mb-0"
              >
                {field.type === "number" ? (
                  <InputNumber
                    onChange={() => setMessage(null)}
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    controls={false}
                    className={`!w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all shadow-sm hover:shadow hover:border-${theme.accent}-300 focus:border-${theme.accent}-400 dark:hover:border-${theme.accent}-700 dark:focus:border-${theme.accent}-600`}
                    style={{ width: "100%", height: "46px", fontSize: "14px" }}
                  />
                ) : field.type === "select" ? (
                  <Select
                    options={field.options}
                    optionFilterProp="label"
                    showSearch
                    allowClear
                    loading={selectLoading}
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    className="rounded-xl"
                    onChange={() => setMessage(null)}
                  />
                ) : (
                  <Input
                    type={field.type}
                    onChange={() => setMessage(null)}
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all shadow-sm hover:shadow hover:border-${theme.accent}-300 focus:border-${theme.accent}-400 dark:hover:border-${theme.accent}-700 dark:focus:border-${theme.accent}-600`}
                    style={{ height: "46px", fontSize: "14px" }}
                  />
                )}
              </Form.Item>
            ))}
          </div>

          <Form.Item
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="text-base">📝</span>
                یادداشت
              </span>
            }
            name="Notes"
            className="mt-5"
          >
            <Input.TextArea
              placeholder="یادداشت‌های اضافی"
              disabled={loading}
              rows={3}
              className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all hover:border-${theme.accent}-300 focus:border-${theme.accent}-400 dark:hover:border-${theme.accent}-700 dark:focus:border-${theme.accent}-600`}
              style={{ resize: "none" }}
            />
          </Form.Item>

          <FormFeedback
            message={{
              status: message?.status ?? "error",
              message: message?.text ?? "",
            }}
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={handleClose}
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
