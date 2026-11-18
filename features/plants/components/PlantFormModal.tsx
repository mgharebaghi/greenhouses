import {
  Form,
  FormActions,
  FormGrid,
  FormItem,
  Input,
} from "@/shared/components/FormControls";
import { createPlant, getPlants, updatePlant } from "@/features/plants/actions";
import type { PlantRecord } from "@/features/plants/types/record";
import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";
import useSavedForm from "@/shared/forms/useSavedForm";
import type { FormValues } from "@/shared/forms/types";

import { useEffect, useState } from "react";
import { plantInputSchema } from "../schema";

export type PlantFormModalProps = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  setMainData: (data: PlantRecord[]) => void;
  setMainLoading: (loading: boolean) => void;
  record?: PlantRecord | null;
};

export default function PlantFormModal({
  modalOpen,
  setModalOpen,
  setMainData,
  setMainLoading,
  record,
}: PlantFormModalProps) {
  const savedForm = useSavedForm();
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);

  const isEdit = !!record;
  const modalTitle = isEdit ? "ویرایش اطلاعات گیاه" : "افزودن گیاه جدید";
  const modalSubTitle = isEdit
    ? "اطلاعات گیاه را ویرایش کنید"
    : "اطلاعات گیاه را وارد کنید";

  useEffect(() => {
    setMounted(true);
    if (modalOpen) {
      setModalMsg(null);
      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
  }, [modalOpen, record, form]);

  const fields = [
    {
      name: "CommonName",
      label: "نام رایج",
      placeholder: "نام رایج گیاه",
      type: "text",
      required: true,
    },
    {
      name: "ScientificName",
      label: "نام علمی",
      placeholder: "نام علمی گیاه (لاتین)",
      type: "text",
      required: true,
    },
    {
      name: "PlantFamily",
      label: "خانواده",
      placeholder: "خانواده گیاه",
      type: "text",
      required: true,
    },
  ];

  const handleSubmit = async (
    values: FormValues<import("zod").infer<typeof plantInputSchema>>,
  ) => {
    if (loading || savedForm.saved) return;
    await submitForm(
      async () => {
        setLoading(true);
        setModalMsg(null);

        const result =
          isEdit && record
            ? await updatePlant({ id: record.ID, data: values })
            : await createPlant(values);
        applyFieldErrors(form, result);
        if (result.status === "ok") {
          await savedForm.complete(
            result.message,
            async () => setMainData(await getPlants()),
            handleClose,
            setMainLoading,
          );
        } else {
          setModalMsg(result);
        }
      },
      (feedback) => setModalMsg(feedback),
      () => {
        setLoading(false);
      },
    );
  };

  const handleClose = () => {
    setModalOpen(false);
    setModalMsg(null);
    form.resetFields();
  };

  if (!mounted) return null;

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      busy={loading}
      savedForm={savedForm}
      forceRender
      heading={modalTitle}
      description={modalSubTitle}
      editing={isEdit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        actions={
          <FormActions
            message={modalMsg}
            onCancel={handleClose}
            loading={loading}
            editing={isEdit}
          />
        }
      >
        <FormGrid title="مشخصات گیاه" columns={3}>
          {fields.map((field) => (
            <FormItem
              key={field.name}
              label={
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
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
            >
              <Input
                onChange={() => setModalMsg(null)}
                placeholder={field.placeholder}
                disabled={loading}
              />
            </FormItem>
          ))}
          <FormItem className="record-form-wide" label="توضیحات" name="Notes">
            <Input.TextArea
              placeholder="توضیحات گیاه"
              disabled={loading}
              rows={3}
            />
          </FormItem>
        </FormGrid>
      </Form>
    </Modal>
  );
}
