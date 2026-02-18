import { Tbl_PlantGrowthStage, Tbl_PlantVariety } from "@/app/generated/prisma";
import { getGrowthStages } from "@/features/growthstages/services";
import { createGrowthStage } from "@/features/growthstages/services/create";
import { updateGrowthStage } from "@/features/growthstages/services/update";
import { getPlantVarieties } from "@/features/varities/services";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import {
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";

export type GrowthStageFormModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: any[]) => void;
  record?: Tbl_PlantGrowthStage | null;
};

type SelectOption = {
  label: string;
  value: number | string;
};

export const stageNameOptions: SelectOption[] = [
  { label: "جوانه زنی", value: "جوانه زنی" },
  { label: "نهال", value: "نهال" },
  { label: "رشد رویشی", value: "رشد رویشی" },
  { label: "گلدهی", value: "گلدهی" },
  { label: "میوه دهی", value: "میوه دهی" },
  { label: "رسیدگی میوه", value: "رسیدگی میوه" },
  { label: "برداشت", value: "برداشت" },
  { label: "نشاء", value: "نشاء" },
];

export default function GrowthStageFormModal({ isOpen, onClose, setMainLoading, setMainData, record }: GrowthStageFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [submitMessage, setSubmitMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);
  const [varityOptions, setVarityOptions] = useState<SelectOption[]>([]);
  const [varityLoading, setVarityLoading] = useState<boolean>(false);

  const isEdit = !!record;

  const stageOrderOptions: SelectOption[] = [
    { label: "مرحله 1", value: 1 },
    { label: "مرحله 2", value: 2 },
    { label: "مرحله 3", value: 3 },
    { label: "مرحله 4", value: 4 },
    { label: "مرحله 5", value: 5 },
    { label: "مرحله 6", value: 6 },
    { label: "مرحله 7", value: 7 },
    { label: "مرحله 8", value: 8 },
  ];

  useEffect(() => {
    if (isOpen) {
      getVarityOptions();
      setSubmitMessage(null);
      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, record, form]);

  const getVarityOptions = async () => {
    setVarityLoading(true);
    // Note: getPlantVarieties returns formatted objects with decimal conversions, but base struct has ID and VarietyName
    const varities: any[] = await getPlantVarieties();
    const options = varities.map((v) => ({ label: v.VarietyName || "بدون نام", value: v.ID }));
    setVarityOptions(options);
    setVarityLoading(false);
  };

  const fields = [
    {
      name: "VarietyID",
      label: "واریته - رقم",
      placeholder: "واریته را انتخاب کنید",
      type: "select",
      required: true,
      options: varityOptions,
      icon: "🌱",
    },
    {
      name: "StageOrder",
      label: "مرحله رشد",
      placeholder: "مرحله را انتخاب کنید",
      type: "select",
      required: true,
      options: stageOrderOptions,
      icon: "🔢",
    },
    {
      name: "StageName",
      label: "عنوان مرحله",
      placeholder: "عنوان مرحله را انتخاب کنید",
      type: "select",
      required: true,
      options: stageNameOptions,
      icon: "📋",
    },
    {
      name: "EntryCriteria",
      label: "علایم ورود به این مرحله",
      placeholder: "علایم ورود را شرح دهید",
      type: "textArea",
      required: false,
      icon: "🚪",
    },
    {
      name: "StartDay",
      label: "تعداد روز ورود به این مرحله",
      placeholder: "تعداد روز",
      type: "number",
      required: false,
      icon: "📅",
    },
    {
      name: "ExitCriteria",
      label: "علائم خروج از این مرحله",
      placeholder: "علائم خروج را شرح دهید",
      type: "textArea",
      required: false,
      icon: "🚶",
    },
    {
      name: "EndDay",
      label: "تعداد روز خروج از این مرحله",
      placeholder: "تعداد روز",
      type: "number",
      required: false,
      icon: "📅",
    },
  ];

  const handleSubmit = async (values: Tbl_PlantGrowthStage) => {
    setLoading(true);
    setSubmitMessage(null);
    const res = isEdit
      ? await updateGrowthStage(record?.ID || 0, values)
      : await createGrowthStage(values);

    if (res) {
      setSubmitMessage({
        status: "ok",
        message: isEdit ? "مرحله رشد با موفقیت ویرایش شد" : "مرحله رشد با موفقیت افزوده شد",
      });
      setMainLoading?.(true);
      const newData = await getGrowthStages();
      setMainData?.(newData);
      setMainLoading?.(false);

      if (!isEdit) form.resetFields();

      setTimeout(() => {
        onClose?.();
        setSubmitMessage(null);
      }, 1500);
    } else {
      setSubmitMessage({ status: "error", message: "خطا در ثبت مرحله رشد!" });
    }
    setLoading(false);
  };

  const handleClose = () => {
    onClose?.();
    setSubmitMessage(null);
    form.resetFields();
  };

  return (
    <Modal
      open={isOpen}
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
        className={`relative px-6 py-6 bg-gradient-to-br border-b ${isEdit
          ? "from-amber-50 via-orange-50/80 to-white border-amber-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-slate-700"
          : "from-emerald-50 via-lime-50/80 to-white border-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-slate-700"
          }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border transition-all flex items-center justify-center shadow-sm hover:shadow ${isEdit
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
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white ${isEdit
                ? "from-amber-500 via-amber-600 to-orange-600"
                : "from-emerald-500 via-emerald-600 to-emerald-700"
                }`}
            >
              {isEdit ? <EditOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-800 ${isEdit ? "bg-orange-400" : "bg-lime-400"
                }`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${isEdit ? "text-amber-900 dark:text-slate-100" : "text-emerald-900 dark:text-slate-100"}`}>
              {isEdit ? "ویرایش مرحله رشد" : "افزودن مرحله رشد جدید"}
            </h3>
            <p
              className={`text-sm mt-1 flex items-center gap-1.5 ${isEdit ? "text-amber-600/80 dark:text-slate-400" : "text-emerald-600/80 dark:text-slate-400"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${isEdit ? "bg-amber-400" : "bg-emerald-400"
                  }`}
              ></span>
              {isEdit ? "اطلاعات مرحله رشد را ویرایش کنید" : "اطلاعات مرحله رشد را با دقت وارد کنید"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[70vh] overflow-y-auto">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field) => (
              <Form.Item
                key={field.name}
                label={
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="text-base">{field.icon}</span>
                    {field.label}
                    {field.required && <span className="text-rose-500 text-xs">*</span>}
                  </span>
                }
                name={field.name}
                rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                className="mb-0"
              >
                {field.type === "select" ? (
                  <Select
                    options={field.options}
                    loading={field.name === "VarietyID" ? varityLoading : false}
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    className="rounded-xl"
                    onChange={() => setSubmitMessage(null)}
                  />
                ) : field.type === "textArea" ? (
                  <Input.TextArea
                    placeholder={field.placeholder}
                    disabled={loading}
                    rows={3}
                    onChange={() => setSubmitMessage(null)}
                    className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all ${isEdit
                      ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600"
                      : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"
                      }`}
                    style={{ resize: "none" }}
                  />
                ) : field.type === "number" ? (
                  <InputNumber
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    controls={false}
                    onChange={() => setSubmitMessage(null)}
                    className={`!w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all shadow-sm hover:shadow ${isEdit
                      ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600"
                      : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"
                      }`}
                    style={{ width: "100%", height: "46px", fontSize: "14px" }}
                  />
                ) : (
                  <Input
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    onChange={() => setSubmitMessage(null)}
                    className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all shadow-sm hover:shadow ${isEdit
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
                توضیحات (یادداشت)
              </span>
            }
            name="note"
            className="mt-5"
          >
            <Input.TextArea
              placeholder="توضیحات اضافی"
              disabled={loading}
              rows={3}
              className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition-all ${isEdit
                ? "hover:border-amber-300 focus:border-amber-400 dark:hover:border-amber-700 dark:focus:border-amber-600"
                : "hover:border-emerald-300 focus:border-emerald-400 dark:hover:border-emerald-700 dark:focus:border-emerald-600"
                }`}
              style={{ resize: "none" }}
            />
          </Form.Item>

          {/* Message Display */}
          {submitMessage && (
            <div
              className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${submitMessage.status === "ok"
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                }`}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${submitMessage.status === "ok" ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"
                  }`}
              >
                {submitMessage.status === "ok" ? (
                  <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
                ) : (
                  <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5">{submitMessage.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                <p className="text-sm leading-relaxed opacity-90">{submitMessage.message}</p>
              </div>
            </div>
          )}

          {/* Actions */}
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
                  ? isEdit
                    ? "در حال ویرایش..."
                    : "در حال ثبت..."
                  : isEdit
                    ? "ویرایش مرحله رشد"
                    : "ثبت مرحله رشد"
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
