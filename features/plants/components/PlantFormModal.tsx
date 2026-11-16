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
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { refreshSavedForm, submitForm } from "@/shared/forms/submit";
import type { FormValues } from "@/shared/forms/types";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

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
  const icon = isEdit ? (
    <EditOutlined className="text-2xl" />
  ) : (
    <PlusOutlined className="text-2xl" />
  );

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
      icon: "🌱",
    },
    {
      name: "ScientificName",
      label: "نام علمی",
      placeholder: "نام علمی گیاه (لاتین)",
      type: "text",
      required: true,
      icon: "🔬",
    },
    {
      name: "PlantFamily",
      label: "خانواده",
      placeholder: "خانواده گیاه",
      type: "text",
      required: true,
      icon: "🌿",
    },
    // {name: "Notes", label: "توضیحات", placeholder: "توضیحات", type: "text", required: false, icon: "📝"}
  ];

  const handleSubmit = async (
    values: FormValues<import("zod").infer<typeof plantInputSchema>>,
  ) => {
    await submitForm(
      async () => {
        setLoading(true);
        setModalMsg(null);

        try {
          if (isEdit && record) {
            const result = await updatePlant({ id: record.ID, data: values });
            applyFieldErrors(form, result);
            if (result.status === "error") {
              setModalMsg(result);
              return;
            }
            setModalMsg({
              status: "ok",
              message: "اطلاعات گیاه با موفقیت ویرایش شد",
            });
          } else {
            const result = await createPlant(values);
            applyFieldErrors(form, result);
            if (result.status === "error") {
              setModalMsg(result);
              return;
            }
            setModalMsg({ status: "ok", message: "گیاه با موفقیت افزوده شد" });
          }

          setMainLoading(true);
          await refreshSavedForm(async () => setMainData(await getPlants()));
          setMainLoading(false);

          setTimeout(() => {
            handleClose();
          }, 1500);
        } catch {
          setModalMsg({
            status: "error",
            message: "خطایی رخ داد، لطفا دوباره تلاش کنید.",
          });
        }
        setLoading(false);
      },
      (feedback) => setModalMsg(feedback),
      () => {
        setLoading(false);
        setMainLoading?.(false);
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
      forceRender
      heading={modalTitle}
      description={modalSubTitle}
      icon={icon}
      editing={isEdit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <FormGrid title="مشخصات گیاه" columns={3}>
          {fields.map((field) => (
            <FormItem
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
            >
              <Input
                onChange={() => setModalMsg(null)}
                placeholder={field.placeholder}
                disabled={loading}
              />
            </FormItem>
          ))}
          <FormItem
            className="record-form-wide"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span>📝</span>توضیحات
              </span>
            }
            name="Notes"
          >
            <Input.TextArea
              placeholder="توضیحات گیاه"
              disabled={loading}
              rows={3}
            />
          </FormItem>
        </FormGrid>

        <FormActions message={modalMsg}>
          <GreenhouseButton
            text={
              loading ? "در حال ثبت..." : isEdit ? "ویرایش گیاه" : "ثبت گیاه"
            }
            variant="primary"
            type="submit"
            loading={loading}
          />
        </FormActions>
      </Form>
    </Modal>
  );
}
