import { Owner_Observer } from "@/app/generated/prisma";
import { createOwner, OwnerResponse } from "@/app/lib/services/owners";
import { getAllOwners } from "@/app/lib/services/owners/read";
import { Modal, Form, Input } from "antd";
import { useState } from "react";
import { CloseOutlined, UserAddOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

type OwnerInsertModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setMainData: (data: Owner_Observer[]) => void;
  setMainLoading: (loading: boolean) => void;
};

export default function OwnersInsertModal({ isOpen, setIsOpen, setMainData, setMainLoading }: OwnerInsertModalProps) {
  const [message, setMessage] = useState<OwnerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fields = [
    { name: "FirstName", label: "نام", required: true, placeholder: "نام را وارد کنید", icon: "👤" },
    { name: "LastName", label: "نام خانوادگی", required: true, placeholder: "نام خانوادگی را وارد کنید", icon: "👥" },
    { name: "PhoneNumber", label: "شماره تماس", required: true, placeholder: "09123456789", icon: "📱" },
    { name: "Profesion", label: "تخصص", required: true, placeholder: "تخصص را وارد کنید", icon: "💼" },
  ];

  const handleSubmit = async (values: Owner_Observer) => {
    setMessage(null);
    setLoading(true);
    const res: OwnerResponse = await createOwner(values);

    if (res.status === "ok") {
      setMessage(res);
      setMainLoading(true);
      const mainData = await getAllOwners();
      setMainData(mainData);
      setMainLoading(false);
      form.resetFields();
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 1500);
    } else {
      setMessage(res);
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
      <div className="relative px-6 py-6 bg-gradient-to-br from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-emerald-100 dark:border-slate-700">
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-center text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 shadow-sm hover:shadow"
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 shadow-lg flex items-center justify-center text-white">
              <UserAddOutlined className="text-2xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-lime-400 border-2 border-white dark:border-slate-800"></div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-emerald-900 dark:text-slate-100">افزودن مالک جدید</h3>
            <p className="text-sm text-emerald-600/80 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              اطلاعات مالک را با دقت وارد کنید
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field, index) => (
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
                className={`mb-0 ${index >= 2 ? "sm:col-span-2" : ""}`}
              >
                <Input
                  onChange={() => setMessage(null)}
                  placeholder={field.placeholder}
                  disabled={loading}
                  size="large"
                  className="rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all shadow-sm hover:shadow w-full dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  style={{
                    height: "46px",
                    fontSize: "14px",
                  }}
                />
              </Form.Item>
            ))}
          </div>

          {/* Message Display */}
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
                <p className="text-sm leading-relaxed opacity-90">{message.message}</p>
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
