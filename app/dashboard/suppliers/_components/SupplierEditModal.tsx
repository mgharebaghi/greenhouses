import { Modal, Form, Input, Switch } from "antd";
import { useEffect, useState } from "react";
import { CloseOutlined, EditOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import type { SupplierDTO } from "../types";
import { updateSupplier, getSuppliers } from "@/app/lib/services/suppliers";

export type SupplierEditModalProps = {
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
  record?: SupplierDTO;
  setMainData?: (data: SupplierDTO[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function SupplierEditModal({
  isOpen,
  setIsOpen,
  record,
  setMainData,
  setMainLoading,
}: SupplierEditModalProps) {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fields = [
    { name: "Legal", label: "شخص حقوقی؟", type: "switch", required: false },
    { name: "CompanyName", label: "نام شرکت", required: false, placeholder: "نام شرکت را وارد کنید", icon: "🏢" },
    { name: "CompanyAddress", label: "آدرس شرکت", required: false, placeholder: "آدرس شرکت را وارد کنید", icon: "📍" },
    { name: "FirstName", label: "نام", required: false, placeholder: "نام را وارد کنید", icon: "👤" },
    { name: "LastName", label: "نام خانوادگی", required: false, placeholder: "نام خانوادگی را وارد کنید", icon: "👥" },
    { name: "ContactTel", label: "تلفن", required: true, placeholder: "09123456789", icon: "📱" },
    { name: "ContactEmail", label: "ایمیل", required: false, placeholder: "email@example.com", icon: "✉️" },
  ];

  useEffect(() => {
    if (isOpen && record) {
      form.setFieldsValue(record);
      setMessage("");
      setLoading(false);
    }
  }, [isOpen, record, form]);

  const handleSubmit = async (values: any) => {
    setMessage("");
    setLoading(true);
    const ok = await updateSupplier({ id: record?.ID || 0, data: values });
    if (ok) {
      setMessage("اطلاعات تامین‌کننده با موفقیت ویرایش شد");
      setMainLoading && setMainLoading(true);
      const fresh = await getSuppliers();
      setMainData && setMainData(fresh);
      setMainLoading && setMainLoading(false);
      setTimeout(() => {
        setIsOpen && setIsOpen(false);
        setMessage("");
      }, 1500);
    } else {
      setMessage("خطا در ویرایش تامین‌کننده");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen && setIsOpen(false);
    setMessage("");
    form.resetFields();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={null}
      centered
      width={580}
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
      <div className="relative px-6 py-6 bg-gradient-to-br from-amber-50 via-orange-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-amber-100 dark:border-slate-700">
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-amber-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-700 transition-all flex items-center justify-center text-amber-600 dark:text-amber-500 hover:text-amber-700 shadow-sm hover:shadow"
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 shadow-lg flex items-center justify-center text-white">
              <EditOutlined className="text-2xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-orange-400 border-2 border-white dark:border-slate-800"></div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-amber-900 dark:text-slate-100">ویرایش تامین‌کننده</h3>
            <p className="text-sm text-amber-600/80 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              اطلاعات تامین‌کننده را ویرایش کنید
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
        {record !== undefined ? (
          <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map((field, index) => (
                <Form.Item
                  key={field.name}
                  label={
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      {field.icon && <span className="text-base">{field.icon}</span>}
                      {field.label}
                      {field.required && <span className="text-rose-500 text-xs">*</span>}
                    </span>
                  }
                  name={field.name}
                  rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                  className={`mb-0 ${index >= 2 ? "sm:col-span-2" : ""}`}
                  valuePropName={field.type === "switch" ? "checked" : undefined}
                >
                  {field.type === "switch" ? (
                    <Switch onChange={() => setMessage("")} />
                  ) : (
                    <Input
                      onChange={() => setMessage("")}
                      placeholder={field.placeholder}
                      disabled={loading}
                      size="large"
                      className="rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 focus:border-amber-400 dark:focus:border-amber-600 transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                      style={{ height: "46px", fontSize: "14px" }}
                    />
                  )}
                </Form.Item>
              ))}
            </div>

            {message && (
              <div
                className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${message.includes("موفقیت")
                    ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                    : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                  }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg ${message.includes("موفقیت") ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"
                    }`}
                >
                  {message.includes("موفقیت") ? (
                    <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5">{message.includes("موفقیت") ? "موفقیت‌آمیز" : "خطا"}</p>
                  <p className="text-sm leading-relaxed opacity-90">{message}</p>
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
                text={loading ? "در حال ویرایش..." : "ویرایش اطلاعات"}
                variant="primary"
                type="submit"
                loading={loading}
                className="w-full sm:w-auto min-w-[140px] h-11 shadow-lg hover:shadow-xl"
              />
            </div>
          </Form>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">در حال بارگذاری...</div>
          </div>
        )}
      </div>
    </Modal>
  );
}
