"use client";

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

import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";
import useSavedForm from "@/shared/forms/useSavedForm";

import {
  createPlantVariety,
  getPlantVarieties,
  updatePlantVariety,
} from "@/features/plant-varieties/actions";
import type { PlantVarietyRecord } from "@/features/plant-varieties/types/record";
import { getPlants } from "@/features/plants/actions";
import type { PlantRecord } from "@/features/plants/types/record";

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
  const savedForm = useSavedForm();
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [plantOptions, setPlantOptions] = useState<SelectOption[]>([]);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  const isEdit = !!record;

  useEffect(() => {
    let cancelOptions: (() => void) | undefined;
    setMounted(true);
    if (isOpen) {
      setMessage(null);
      cancelOptions = loadFormOptions(getPlantOptions, setMessage, () =>
        setSelectLoading(false),
      );
      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
    return cancelOptions;
  }, [isOpen, record, form]);

  const getPlantOptions = async (isCurrent: () => boolean) => {
    setSelectLoading(true);
    const plants: PlantRecord[] = await getPlants();
    const options = (plants || []).map((p) => ({
      label: p.CommonName || "بدون نام",
      value: p.ID,
    }));
    if (!isCurrent()) return;
    setPlantOptions(options);
  };

  const fields = [
    {
      name: "VarietyName",
      label: "واریته",
      placeholder: "واریته را وارد کنید",
      type: "text",
      required: true,
    },
    {
      name: "PlantID",
      label: "نام گیاه",
      placeholder: "گیاه را انتخاب کنید",
      type: "select",
      required: true,
      options: plantOptions,
    },
    {
      name: "DaysToGermination",
      label: "روز تا جوانه زنی",
      placeholder: "روز",
      type: "number",
      required: false,
    },
    {
      name: "DaysToSprout",
      label: "روز تا رویش",
      placeholder: "روز",
      type: "number",
      required: false,
    },
    {
      name: "DaysToSeedling",
      label: "روز تا نشاء",
      placeholder: "روز",
      type: "number",
      required: false,
    },
    {
      name: "DaysToMaturity",
      label: "روز تا بلوغ",
      placeholder: "روز",
      type: "number",
      required: false,
    },
    {
      name: "IdealTempMin",
      label: "حداقل دما (°C)",
      placeholder: "دما",
      type: "number",
      required: false,
    },
    {
      name: "IdealTempMax",
      label: "حداکثر دما (°C)",
      placeholder: "دما",
      type: "number",
      required: false,
    },
    {
      name: "IdealHumidityMin",
      label: "حداقل رطوبت (%)",
      placeholder: "رطوبت",
      type: "number",
      required: false,
    },
    {
      name: "IdealHumidityMax",
      label: "حداکثر رطوبت (%)",
      placeholder: "رطوبت",
      type: "number",
      required: false,
    },
    {
      name: "LightRequirement",
      label: "نیاز نوری",
      placeholder: "نیاز نوری",
      type: "text",
      required: false,
    },
  ];

  const handleSubmit = async (values: PlantVarietyRecord) => {
    if (loading || savedForm.saved) return;
    await submitForm(
      async () => {
        setLoading(true);
        setMessage(null);
        const ok = isEdit
          ? await updatePlantVariety({ id: record?.ID || 0, data: values })
          : await createPlantVariety(values);

        applyFieldErrors(form, ok);
        if (ok.status === "ok") {
          await savedForm.complete(
            ok.message,
            async () => setMainData?.(await getPlantVarieties()),
            handleClose,
            setMainLoading,
          );
        } else {
          setMessage(ok);
        }
      },
      (feedback) =>
        setMessage({ status: feedback.status, message: feedback.message }),
      () => {
        setLoading(false);
      },
    );
  };

  const handleClose = () => {
    onClose?.();
    setMessage(null);
    form.resetFields();
  };

  if (!mounted) return null;

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
      {field.type === "number" ? (
        <InputNumber
          onChange={() => setMessage(null)}
          placeholder={field.placeholder}
          disabled={loading}

          controls={false}
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

          onChange={() => setMessage(null)}
        />
      ) : (
        <Input
          type={field.type}
          onChange={() => setMessage(null)}
          placeholder={field.placeholder}
          disabled={loading}
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
      heading={isEdit ? "ویرایش واریته" : "افزودن واریته"}
      description={
        isEdit
          ? "اطلاعات واریته را ویرایش کنید"
          : "اطلاعات واریته جدید را وارد کنید"
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
            message={message}
            onCancel={handleClose}
            loading={loading}
            editing={isEdit}
          />
        }
      >
        <FormGrid title="مشخصات رقم">
          {fields
            .filter((field) => ["VarietyName", "PlantID"].includes(field.name))
            .map(renderField)}
        </FormGrid>

        <FormGrid title="زمان رشد">
          {fields
            .filter((field) =>
              [
                "DaysToGermination",
                "DaysToSprout",
                "DaysToSeedling",
                "DaysToMaturity",
              ].includes(field.name),
            )
            .map(renderField)}
        </FormGrid>

        <FormGrid title="شرایط محیطی">
          {fields
            .filter((field) =>
              [
                "IdealTempMin",
                "IdealTempMax",
                "IdealHumidityMin",
                "IdealHumidityMax",
                "LightRequirement",
              ].includes(field.name),
            )
            .map(renderField)}
          <FormItem className="record-form-wide" label="یادداشت" name="Notes">
            <Input.TextArea
              placeholder="یادداشت‌های اضافی"
              disabled={loading}
              rows={3}
            />
          </FormItem>
        </FormGrid>
      </Form>
    </Modal>
  );
}
