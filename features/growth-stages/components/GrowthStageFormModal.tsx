import { loadFormOptions } from "@/shared/forms/load-options";

import {
  Form,
  FormActions,
  FormGrid,
  FormItem,
  Input,
  InputNumber,
  Select,
} from "@/shared/components/FormControls";
import {
  createGrowthStage,
  getGrowthStages,
  updateGrowthStage,
} from "@/features/growth-stages/actions";
import type { GrowthStageRecord } from "@/features/growth-stages/types/record";
import { getPlantVarieties } from "@/features/plant-varieties/actions";
import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";
import useSavedForm from "@/shared/forms/useSavedForm";

import { useEffect, useState } from "react";

export type GrowthStageFormModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: GrowthStageRecord[]) => void;
  record?: GrowthStageRecord | null;
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

export default function GrowthStageFormModal({
  isOpen,
  onClose,
  setMainLoading,
  setMainData,
  record,
}: GrowthStageFormModalProps) {
  const savedForm = useSavedForm();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [submitMessage, setSubmitMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);
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
    let cancelOptions: (() => void) | undefined;
    if (isOpen) {
      cancelOptions = loadFormOptions(getVarityOptions, setSubmitMessage, () =>
        setVarityLoading(false),
      );
      setSubmitMessage(null);
      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
    return cancelOptions;
  }, [isOpen, record, form]);

  const getVarityOptions = async (isCurrent: () => boolean) => {
    setVarityLoading(true);
    // Note: getPlantVarieties returns formatted objects with decimal conversions, but base struct has ID and VarietyName
    const varities = await getPlantVarieties();
    const options = varities.map((v) => ({
      label: v.VarietyName || "بدون نام",
      value: v.ID,
    }));
    if (!isCurrent()) return;
    setVarityOptions(options);
  };

  const fields = [
    {
      name: "VarietyID",
      label: "واریته - رقم",
      placeholder: "واریته را انتخاب کنید",
      type: "select",
      required: true,
      options: varityOptions,
    },
    {
      name: "StageOrder",
      label: "مرحله رشد",
      placeholder: "مرحله را انتخاب کنید",
      type: "select",
      required: true,
      options: stageOrderOptions,
    },
    {
      name: "EntryCriteria",
      label: "علایم ورود به این مرحله",
      placeholder: "علایم ورود را شرح دهید",
      type: "textArea",
      required: false,
    },
    {
      name: "ExitCriteria",
      label: "علائم خروج از این مرحله",
      placeholder: "علائم خروج را شرح دهید",
      type: "textArea",
      required: false,
    },
    {
      name: "StartDay",
      label: "تعداد روز ورود به این مرحله",
      placeholder: "تعداد روز",
      type: "number",
      required: false,
    },
    {
      name: "EndDay",
      label: "تعداد روز خروج از این مرحله",
      placeholder: "تعداد روز",
      type: "number",
      required: false,
    },
    {
      name: "StageName",
      label: "عنوان مرحله",
      placeholder: "عنوان مرحله را انتخاب کنید",
      type: "select",
      required: true,
      options: stageNameOptions,
    },
  ];

  const handleSubmit = async (values: GrowthStageRecord) => {
    if (loading || savedForm.saved) return;
    setLoading(true);
    setSubmitMessage(null);
    await submitForm(
      async () => {
        const result = record
          ? await updateGrowthStage(record.ID, values)
          : await createGrowthStage(values);
        applyFieldErrors(form, result);
        if (result.status === "ok") {
          await savedForm.complete(
            result.message,
            async () => setMainData?.(await getGrowthStages()),
            handleClose,
            setMainLoading,
          );
        } else {
          setSubmitMessage(result);
        }
      },
      setSubmitMessage,
      () => {
        setLoading(false);
      },
    );
  };

  const handleClose = () => {
    onClose?.();
    setSubmitMessage(null);
    form.resetFields();
  };

  const renderField = (field: (typeof fields)[number]) => (
    <FormItem
      key={field.name}
      label={
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-rose-500 text-xs">*</span>}
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
      {field.type === "select" ? (
        <Select
          options={field.options}
          loading={field.name === "VarietyID" ? varityLoading : false}
          showSearch
          allowClear
          optionFilterProp="label"
          placeholder={field.placeholder}
          disabled={loading}

          onChange={() => setSubmitMessage(null)}
        />
      ) : field.type === "textArea" ? (
        <Input.TextArea
          placeholder={field.placeholder}
          disabled={loading}
          rows={3}
          onChange={() => setSubmitMessage(null)}
        />
      ) : field.type === "number" ? (
        <InputNumber
          placeholder={field.placeholder}
          disabled={loading}

          controls={false}
          onChange={() => setSubmitMessage(null)}
        />
      ) : (
        <Input
          placeholder={field.placeholder}
          disabled={loading}

          onChange={() => setSubmitMessage(null)}
        />
      )}
    </FormItem>
  );

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      busy={loading}
      savedForm={savedForm}
      heading={isEdit ? "ویرایش مرحله رشد" : "افزودن مرحله رشد جدید"}
      description={
        isEdit
          ? "اطلاعات مرحله رشد را ویرایش کنید"
          : "اطلاعات مرحله رشد را با دقت وارد کنید"
      }
      editing={isEdit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        actions={
          <FormActions
            message={submitMessage}
            onCancel={handleClose}
            loading={loading}
            editing={isEdit}
          />
        }
      >
        <FormGrid title="مشخصات مرحله" columns={3}>
          {fields
            .filter((field) =>
              ["VarietyID", "StageOrder", "StageName"].includes(field.name),
            )
            .map(renderField)}
        </FormGrid>

        <FormGrid title="زمان‌بندی">
          {fields
            .filter((field) => ["StartDay", "EndDay"].includes(field.name))
            .map(renderField)}
        </FormGrid>

        <FormGrid title="علائم و توضیحات">
          {fields
            .filter((field) =>
              ["EntryCriteria", "ExitCriteria"].includes(field.name),
            )
            .map(renderField)}
          <FormItem
            className="record-form-wide"
            label="توضیحات (یادداشت)"
            name="note"
          >
            <Input.TextArea
              placeholder="توضیحات اضافی"
              disabled={loading}
              rows={3}
            />
          </FormItem>
        </FormGrid>
      </Form>
    </Modal>
  );
}
