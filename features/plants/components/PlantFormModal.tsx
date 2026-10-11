import FormModalHeader from "@/shared/components/FormModalHeader";
import { createPlant, getPlants, updatePlant } from "@/features/plants/actions";
import type { PlantRecord } from "@/features/plants/types/record";
import FormFeedback from "@/shared/components/FormFeedback";
import Modal from "@/shared/components/FormModal";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";
import type { FormValues } from "@/shared/forms/types";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
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

  const theme = isEdit
    ? {
        gradient:
          "from-amber-50 via-orange-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        border: "border-amber-100 dark:border-slate-700",
        iconBg: "from-amber-500 via-amber-600 to-orange-600",
        iconDot: "bg-orange-400",
        textMain: "text-amber-900 dark:text-slate-100",
        textSub: "text-amber-600/80 dark:text-slate-400",
        fieldFocus: "focus:border-amber-400 dark:focus:border-amber-600",
        fieldHover: "hover:border-amber-300 dark:hover:border-amber-700",
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
        fieldFocus: "focus:border-emerald-400 dark:focus:border-emerald-600",
        fieldHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
        accent: "emerald",
      };

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
          const newData = await getPlants();
          setMainData(newData);
          setMainLoading(false);

          setTimeout(() => {
            handleClose();
          }, 1500);
        } catch (error) {
          console.error(error);
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
      onCancel={handleClose}
      width={580}
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
      forceRender
    >
      {/* Header */}
      <FormModalHeader
        theme={theme}
        icon={icon}
        modalTitle={modalTitle}
        modalSubTitle={modalSubTitle}
        onClose={handleClose}
        padding="relative px-6 py-6"
      />

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field, index) => (
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
                className={`mb-0 ${index === 0 ? "sm:col-span-2" : ""}`}
              >
                <Input
                  onChange={() => setModalMsg(null)}
                  placeholder={field.placeholder}
                  disabled={loading}
                  size="large"
                  className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 focus:border-${theme.accent}-400 dark:focus:border-${theme.accent}-600 transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500`}
                  style={{ height: "46px", fontSize: "14px" }}
                />
              </Form.Item>
            ))}
          </div>

          <Form.Item
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span>📝</span>توضیحات
              </span>
            }
            name="Notes"
            className="mt-5"
          >
            <Input.TextArea
              placeholder="توضیحات گیاه"
              disabled={loading}
              rows={3}
              className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 focus:border-${theme.accent}-400 dark:focus:border-${theme.accent}-600 transition-all dark:bg-slate-800 dark:text-white`}
              style={{ resize: "none" }}
            />
          </Form.Item>

          <FormFeedback message={modalMsg} />

          <div className="flex justify-end mt-6">
            <GreenhouseButton
              text={
                loading ? "در حال ثبت..." : isEdit ? "ویرایش گیاه" : "ثبت گیاه"
              }
              variant="primary"
              type="submit"
              loading={loading}
              className="min-w-[160px] h-11 shadow-lg hover:shadow-xl"
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
}
