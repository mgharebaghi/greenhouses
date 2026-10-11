import {
  createSupplier,
  getSuppliers,
  updateSupplier,
} from "@/features/suppliers/actions";
import FormFeedback from "@/shared/components/FormFeedback";
import Modal from "@/shared/components/FormModal";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { submitForm } from "@/shared/forms/submit";
import type { FormValues } from "@/shared/forms/types";
import {
  CloseOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Form, Input, Switch } from "antd";
import { useEffect, useState } from "react";
import { supplierInputSchema } from "../schema";
import type { SupplierDTO } from "../types";

type SupplierFormModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  record?: SupplierDTO | null;
  setMainData: (data: SupplierDTO[]) => void;
  setMainLoading: (loading: boolean) => void;
};

export default function SupplierFormModal({
  isOpen,
  setIsOpen,
  record,
  setMainData,
  setMainLoading,
}: SupplierFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);
  const [form] = Form.useForm();
  const isLegal = Form.useWatch("Legal", form);

  const isEdit = !!record;

  const fields = [
    {
      name: "Legal",
      label: "شخص حقوقی؟",
      type: "switch",
      required: false,
      colSpan: 2,
    },
    // Row 1: Company + Brand
    {
      name: "CompanyName",
      label: "نام شرکت",
      required: false,
      placeholder: "شرکت...",
      icon: "🏢",
      colSpan: 1,
    },
    {
      name: "BrandName",
      label: "نام برند",
      required: false,
      placeholder: "برند...",
      icon: "🏷️",
      colSpan: 1,
    },
    // Row 2: Name + Last Name
    {
      name: "FirstName",
      label: "نام",
      required: false,
      placeholder: "نام...",
      icon: "👤",
      colSpan: 1,
    },
    {
      name: "LastName",
      label: "نام خانوادگی",
      required: false,
      placeholder: "نام خانوادگی...",
      icon: "👥",
      colSpan: 1,
    },
    // Row 3: Phone + Email
    {
      name: "ContactTel",
      label: "تلفن",
      required: true,
      placeholder: "0912...",
      icon: "📱",
      colSpan: 1,
    },
    {
      name: "ContactEmail",
      label: "ایمیل",
      required: false,
      placeholder: "email@...",
      icon: "✉️",
      colSpan: 1,
    },
    // Row 4: Country + City + License
    {
      name: "SupplierCountry",
      label: "کشور",
      required: false,
      placeholder: "کشور...",
      icon: "🌍",
      colSpan: 1,
    },
    {
      name: "SupplierCity",
      label: "شهر",
      required: false,
      placeholder: "شهر...",
      icon: "🏙️",
      colSpan: 1,
    },
    {
      name: "LicenseNumber",
      label: "شماره مجوز",
      required: false,
      placeholder: "مجوز...",
      icon: "📜",
      colSpan: 2,
    }, // Full width on small screens if needed
    // Row 5: Address (Full Width)
    {
      name: "CompanyAddress",
      label: "آدرس",
      required: false,
      placeholder: "آدرس کامل...",
      icon: "📍",
      colSpan: 2,
      textArea: true,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
      setMessage(null);
    }
  }, [isOpen, record, form]);

  const handleSubmit = async (
    values: FormValues<import("zod").infer<typeof supplierInputSchema>>,
  ) => {
    await submitForm(
      async () => {
        setMessage(null);
        setLoading(true);

        let result;
        if (isEdit && record) {
          result = await updateSupplier({ id: record.ID, data: values });
        } else {
          result = await createSupplier(values);
        }

        applyFieldErrors(form, result);
        if (result.status === "ok") {
          setMessage({
            status: "ok",
            message: isEdit
              ? "ویرایش با موفقیت انجام شد"
              : "افزودن با موفقیت انجام شد",
          });
          setMainLoading(true);
          const fresh = await getSuppliers();
          setMainData(fresh);
          setMainLoading(false);

          if (!isEdit) form.resetFields();

          setTimeout(() => {
            setIsOpen(false);
            setMessage(null);
          }, 1500);
        } else {
          setMessage({
            status: "error",
            message: isEdit ? "خطا در ویرایش اطلاعات" : "خطا در ثبت اطلاعات",
          });
        }
        setLoading(false);
      },
      (feedback) => setMessage(feedback),
      () => {
        setLoading(false);
        setMainLoading?.(false);
      },
    );
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage(null);
    form.resetFields();
  };

  // Theme configuration based on mode
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
        btnSecondary: "secondary",
        btnPrimary: "primary",
        accent: "amber",
        successBg: "bg-emerald-200/50 dark:bg-emerald-800/50",
        errorBg: "bg-rose-200/50 dark:bg-rose-800/50",
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
        btnSecondary: "secondary",
        btnPrimary: "primary",
        accent: "emerald",
        successBg: "bg-emerald-200/50 dark:bg-emerald-800/50",
        errorBg: "bg-rose-200/50 dark:bg-rose-800/50",
      };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      width={650} // Slightly wider for better grid
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
        className={`relative px-6 py-5 bg-gradient-to-br ${theme.gradient} border-b ${theme.border}`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-${theme.accent}-50 dark:hover:bg-${theme.accent}-900/20 border border-${theme.accent}-200 dark:border-slate-600 hover:border-${theme.accent}-300 dark:hover:border-${theme.accent}-700 transition-all flex items-center justify-center text-${theme.accent}-600 dark:text-${theme.accent}-500 hover:text-${theme.accent}-700 shadow-sm hover:shadow`}
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${theme.iconBg} shadow-lg flex items-center justify-center text-white`}
            >
              {isEdit ? (
                <EditOutlined className="text-2xl" />
              ) : (
                <UserAddOutlined className="text-2xl" />
              )}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${theme.iconDot} border-2 border-white dark:border-slate-800`}
            ></div>
          </div>
          <div>
            <h3 className={`font-bold text-2xl ${theme.textMain}`}>
              {isEdit ? "ویرایش تامین‌کننده" : "افزودن تامین‌کننده جدید"}
            </h3>
            <p
              className={`text-sm ${theme.textSub} mt-1 flex items-center gap-1.5`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full bg-${theme.accent}-400 animate-pulse`}
              ></span>
              {isEdit
                ? "اطلاعات تامین‌کننده را ویرایش کنید"
                : "اطلاعات تامین‌کننده را با دقت وارد کنید"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {fields.map((field) => (
              <Form.Item
                key={field.name}
                label={
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                    {field.icon && (
                      <span className="text-sm opacity-80">{field.icon}</span>
                    )}
                    {field.name === "FirstName" && isLegal
                      ? "نام مدیرعامل"
                      : field.name === "LastName" && isLegal
                        ? "نام خانوادگی مدیرعامل"
                        : field.label}
                    {field.required && (
                      <span className="text-rose-500 text-[10px]">*</span>
                    )}
                  </span>
                }
                name={field.name}
                rules={[{ required: field.required, message: "الزامی" }]}
                className={`mb-1 ${field.colSpan === 2 ? "col-span-2" : "col-span-2 sm:col-span-1"}`}
                valuePropName={field.type === "switch" ? "checked" : undefined}
              >
                {field.type === "switch" ? (
                  <Switch onChange={() => setMessage(null)} />
                ) : field.textArea ? (
                  <Input.TextArea
                    onChange={() => setMessage(null)}
                    placeholder={field.placeholder}
                    disabled={loading}
                    rows={2}
                    className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 ${theme.fieldHover} ${theme.fieldFocus} transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 text-sm`}
                  />
                ) : (
                  <Input
                    onChange={() => setMessage(null)}
                    placeholder={field.placeholder}
                    disabled={
                      loading ||
                      (field.name === "CompanyName" && !isLegal) ||
                      (field.name === "BrandName" && !isLegal)
                    }
                    className={`rounded-xl border-2 border-slate-200 dark:border-slate-700 ${theme.fieldHover} ${theme.fieldFocus} transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 h-10 text-sm`}
                  />
                )}
              </Form.Item>
            ))}
          </div>

          <FormFeedback message={message} />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto min-w-[100px] h-10 text-sm"
            />
            <GreenhouseButton
              text={loading ? "..." : isEdit ? "ویرایش" : "ثبت"}
              variant="primary"
              type="submit"
              loading={loading}
              className="w-full sm:w-auto min-w-[100px] h-10 shadow-md hover:shadow-lg text-sm"
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
}
