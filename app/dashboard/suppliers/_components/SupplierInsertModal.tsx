import { Modal, Form, Input, Switch } from "antd";
import { useState } from "react";
import { CloseOutlined, UserAddOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import type { SupplierDTO } from "../types";
import { createSupplier, getSuppliers } from "@/app/lib/services/suppliers";

type SupplierInsertModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setMainData: (data: SupplierDTO[]) => void;
  setMainLoading: (loading: boolean) => void;
};

export default function SupplierInsertModal({
  isOpen,
  setIsOpen,
  setMainData,
  setMainLoading,
}: SupplierInsertModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);
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

  const handleSubmit = async (values: any) => {
    setMessage(null);
    setLoading(true);
    const ok = await createSupplier(values);
    if (ok) {
      setMessage({ status: "ok", message: "تامین‌کننده با موفقیت افزوده شد" });
      setMainLoading(true);
      const fresh = await getSuppliers();
      setMainData(fresh);
      setMainLoading(false);
      form.resetFields();
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ status: "error", message: "خطا در افزودن تامین‌کننده" });
    }
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage(null);
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
      {/* Header */}
      <div className="relative px-6 py-6 bg-gradient-to-br from-emerald-50 via-lime-50/80 to-white border-b border-emerald-100">
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-all flex items-center justify-center text-emerald-600 hover:text-emerald-700 shadow-sm hover:shadow"
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 shadow-lg flex items-center justify-center text-white">
              <UserAddOutlined className="text-2xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-lime-400 border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-emerald-900">افزودن تامین‌کننده جدید</h3>
            <p className="text-sm text-emerald-600/80 mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              اطلاعات تامین‌کننده را با دقت وارد کنید
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field, index) => (
              <Form.Item
                key={field.name}
                label={
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
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
                  <Switch onChange={() => setMessage(null)} />
                ) : (
                  <Input
                    onChange={() => setMessage(null)}
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    className="rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-400 transition-all shadow-sm hover:shadow"
                    style={{ height: "46px", fontSize: "14px" }}
                  />
                )}
              </Form.Item>
            ))}
          </div>

          {message && (
            <div
              className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${
                message.status === "ok"
                  ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300 text-emerald-900"
                  : "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-300 text-rose-900"
              }`}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${
                  message.status === "ok" ? "bg-emerald-200/50" : "bg-rose-200/50"
                }`}
              >
                {message.status === "ok" ? (
                  <CheckCircleOutlined className="text-lg text-emerald-700" />
                ) : (
                  <ExclamationCircleOutlined className="text-lg text-rose-700" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5">{message.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                <p className="text-sm leading-relaxed opacity-90">{message.message}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto min-w-[140px] h-11"
            />
            <GreenhouseButton
              text={loading ? "در حال ثبت..." : "ثبت اطلاعات"}
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
