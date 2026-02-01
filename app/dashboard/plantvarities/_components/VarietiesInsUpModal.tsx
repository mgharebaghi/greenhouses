"use client";

import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import type { Plants, PlantVarities } from "@/app/generated/prisma";
import { getPlants } from "@/app/lib/services/plants";
import { getPlantVarieties, updatePlantVariety } from "@/app/lib/services/varities";
import { createPlantVariety } from "@/app/lib/services/varities/create";
import {
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

type SelectOption = { label: string; value: number };

export type VarietiesInsUpModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: any[]) => void;
  isEditMode?: boolean;
  editData?: Partial<PlantVarities> & { VarietyID?: number };
};

export default function VarietiesInsUpModal(props: VarietiesInsUpModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [plantOptions, setPlantOptions] = useState<SelectOption[]>([]);
  const [message, setMessage] = useState<{ status: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!props.isOpen) return;
    setMessage(null);
    void getPlantOptions();
    if (props.isEditMode && props.editData) {
      form.setFieldsValue(props.editData);
    } else {
      form.resetFields();
    }
  }, [props.isOpen, props.isEditMode, props.editData, form]);

  const getPlantOptions = async () => {
    setSelectLoading(true);
    const plants: Plants[] = await getPlants();
    const options = (plants || []).map((p) => ({ label: p.CommonName || "بدون نام", value: p.PlantID }));
    setPlantOptions(options);
    setSelectLoading(false);
  };

  const fields: Array<{
    name: keyof PlantVarities | "Notes";
    label: string;
    placeholder: string;
    type: "text" | "number" | "select";
    required: boolean;
    options?: SelectOption[];
    icon: string;
  }> = [
      {
        name: "VarietyName",
        label: "نام گونه",
        placeholder: "نام گونه را وارد کنید",
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
      // { name: "SeedCompany", label: "شرکت توزیع کننده بذر", placeholder: "نام شرکت بذر", type: "text", required: false, icon: "🏢" },
      {
        name: "DaysToGermination",
        label: "تعداد روز تا جوانه زنی",
        placeholder: "تعداد روز",
        type: "number",
        required: true,
        icon: "🌱",
      },
      {
        name: "DaysToSprout",
        label: "تعداد روز تا رویش",
        placeholder: "تعداد روز",
        type: "number",
        required: true,
        icon: "🌿",
      },
      {
        name: "DaysToSeedling",
        label: "تعداد روز تا نشاء",
        placeholder: "تعداد روز",
        type: "number",
        required: true,
        icon: "🪴",
      },
      {
        name: "DaysToMaturity",
        label: "تعداد روز تا بلوغ",
        placeholder: "تعداد روز",
        type: "number",
        required: true,
        icon: "🌳",
      },
      {
        name: "TypicalYieldKgPerM2",
        label: "محصول (کیلوگرم/متر مربع)",
        placeholder: "محصول",
        type: "number",
        required: true,
        icon: "📊",
      },
      {
        name: "IdealTempMin",
        label: "حداقل دمای ایده‌آل",
        placeholder: "درجه سانتیگراد",
        type: "number",
        required: true,
        icon: "🌡️",
      },
      {
        name: "IdealTempMax",
        label: "حداکثر دمای ایده‌آل",
        placeholder: "درجه سانتیگراد",
        type: "number",
        required: true,
        icon: "🌡️",
      },
      {
        name: "IdealHumidityMin",
        label: "حداقل رطوبت ایده‌آل",
        placeholder: "درصد",
        type: "number",
        required: true,
        icon: "💧",
      },
      {
        name: "IdealHumidityMax",
        label: "حداکثر رطوبت ایده‌آل",
        placeholder: "درصد",
        type: "number",
        required: true,
        icon: "💧",
      },
      {
        name: "LightRequirement",
        label: "نیاز نوری",
        placeholder: "نیاز نوری",
        type: "text",
        required: true,
        icon: "☀️",
      },
      {
        name: "GrowthCycleDays",
        label: "دوره رشد (روز)",
        placeholder: "تعداد روز",
        type: "number",
        required: true,
        icon: "🔄",
      },
    ];

  const handleSubmit = async (values: PlantVarities) => {
    setLoading(true);
    setMessage(null);
    const ok = props.isEditMode
      ? await updatePlantVariety({ id: props.editData?.VarietyID || 0, data: values })
      : await createPlantVariety(values);

    if (ok) {
      setMessage({
        status: "ok",
        text: props.isEditMode ? "اطلاعات گونه گیاهی با موفقیت ویرایش شد" : "گونه گیاهی با موفقیت افزوده شد",
      });
      props.setMainLoading?.(true);
      const newData = await getPlantVarieties();
      props.setMainData?.(newData);
      props.setMainLoading?.(false);
      form.resetFields();
      setTimeout(() => {
        props.onClose?.();
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ status: "error", text: "خطا در ثبت گونه گیاهی!" });
    }
    setLoading(false);
  };

  const handleClose = () => {
    props.onClose?.();
    setMessage(null);
    form.resetFields();
  };

  return (
    <Modal
      open={props.isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={null}
      centered
      width={780}
      className="!p-0"
      styles={{
        content: {
          padding: 0,
          borderRadius: "1.25rem",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Header */}
      <div
        className={`relative px-6 py-6 bg-gradient-to-br border-b ${props.isEditMode
            ? "from-amber-50 via-orange-50/80 to-white border-amber-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-slate-700"
            : "from-emerald-50 via-lime-50/80 to-white border-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-slate-700"
          }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border transition-all flex items-center justify-center shadow-sm hover:shadow ${props.isEditMode
              ? "hover:bg-amber-50 border-amber-200 hover:border-amber-300 text-amber-600 hover:text-amber-700 dark:border-slate-600 dark:hover:border-amber-700 dark:hover:bg-amber-900/20 dark:text-amber-500"
              : "hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300 text-emerald-600 hover:text-emerald-700 dark:border-slate-600 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20 dark:text-emerald-500"
            }`}
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${props.isEditMode
                  ? "from-amber-500 via-amber-600 to-orange-600"
                  : "from-emerald-500 via-emerald-600 to-emerald-700"
                }`}
            >
              {props.isEditMode ? <EditOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-800 ${props.isEditMode ? "bg-orange-400" : "bg-lime-400"
                }`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${props.isEditMode ? "text-amber-900 dark:text-slate-100" : "text-emerald-900 dark:text-slate-100"}`}>
              {props.isEditMode ? "ویرایش اطلاعات گونه گیاهی" : "افزودن گونه گیاهی جدید"}
            </h3>
            <p
              className={`text-sm mt-1 flex items-center gap-1.5 ${props.isEditMode ? "text-amber-600/80 dark:text-slate-400" : "text-emerald-600/80 dark:text-slate-400"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${props.isEditMode ? "bg-amber-400" : "bg-emerald-400"
                  }`}
              ></span>
              {props.isEditMode ? "اطلاعات گونه گیاهی را ویرایش کنید" : "اطلاعات گونه گیاهی را با دقت وارد کنید"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[70vh] overflow-y-auto">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {fields.map((field) => (
              <Form.Item
                key={field.name as string}
                label={
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="text-base">{field.icon}</span>
                    {field.label}
                    {field.required && <span className="text-rose-500 text-xs">*</span>}
                  </span>
                }
                name={field.name as string}
                rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                className="mb-0"
              >
                {field.type === "number" ? (
                  <InputNumber
                    onChange={() => setMessage(null)}
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    controls={false}
                    className={`!w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all shadow-sm hover:shadow ${props.isEditMode
                        ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600"
                        : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"
                      }`}
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
                    className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all shadow-sm hover:shadow ${props.isEditMode
                        ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600"
                        : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"
                      }`}
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
              className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all ${props.isEditMode
                  ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600"
                  : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"
                }`}
              style={{ resize: "none" }}
            />
          </Form.Item>

          {message && (
            <div
              className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${message.status === "ok"
                  ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                  : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                }`}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${message.status === "ok" ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"
                  }`}
              >
                {message.status === "ok" ? (
                  <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
                ) : (
                  <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5">{message.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                <p className="text-sm leading-relaxed opacity-90">{message.text}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto min-w-[140px] h-11"
            />
            <GreenhouseButton
              text={
                loading
                  ? props.isEditMode
                    ? "در حال ویرایش..."
                    : "در حال ثبت..."
                  : props.isEditMode
                    ? "ویرایش گونه گیاهی"
                    : "ثبت گونه گیاهی"
              }
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
