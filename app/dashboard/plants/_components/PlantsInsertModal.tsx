import { Plants } from "@/app/generated/prisma";
import { getPlants } from "@/app/lib/services/plants";
import { createPlant } from "@/app/lib/services/plants/create";
import { Modal, Form, Input } from "antd";
import { useState } from "react";
import { CloseOutlined, PlusOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

type PlantsInsrtModalProps = {
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
  setMainData?: (data: Plants[]) => void;
  setMainLoading?: (loading: boolean) => void;
};

export default function PlantsInsrtModal({ isOpen, setIsOpen, setMainData, setMainLoading }: PlantsInsrtModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);
  const [form] = Form.useForm();

  const fields = [
    { name: "CommonName", label: "نام رایج", placeholder: "نام رایج گیاه", type: "text", required: true, icon: "🌱" },
    {
      name: "ScientificName",
      label: "نام علمی",
      placeholder: "نام علمی گیاه",
      type: "text",
      required: true,
      icon: "🔬",
    },
    { name: "Family", label: "خانواده", placeholder: "خانواده گیاه", type: "text", required: true, icon: "🌿" },
  ];

  const handleSubmit = async (values: Plants) => {
    setLoading(true);
    setMessage(null);
    const res = await createPlant(values);

    if (res) {
      setMessage({ status: "ok", message: "گیاه با موفقیت افزوده شد" });
      setMainLoading?.(true);
      const updateData = await getPlants();
      setMainData?.(updateData);
      setMainLoading?.(false);
      form.resetFields();
      setTimeout(() => {
        setIsOpen?.(false);
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ status: "error", message: "خطایی در ثبت گیاه رخ داد" });
    }
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen?.(false);
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
              <PlusOutlined className="text-2xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-lime-400 border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-emerald-900">افزودن گیاه جدید</h3>
            <p className="text-sm text-emerald-600/80 mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              اطلاعات گیاه را با دقت وارد کنید
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
                    <span className="text-base">{field.icon}</span>
                    {field.label}
                    {field.required && <span className="text-rose-500 text-xs">*</span>}
                  </span>
                }
                name={field.name}
                rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                className={`mb-0 ${index === 0 ? "sm:col-span-2" : ""}`}
              >
                <Input
                  onChange={() => setMessage(null)}
                  placeholder={field.placeholder}
                  disabled={loading}
                  size="large"
                  className="rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-400 transition-all shadow-sm hover:shadow"
                  style={{
                    height: "46px",
                    fontSize: "14px",
                  }}
                />
              </Form.Item>
            ))}
          </div>

          <Form.Item
            label={
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="text-base">📝</span>
                توضیحات
              </span>
            }
            name="Notes"
            className="mt-5"
          >
            <Input.TextArea
              placeholder="توضیحات گیاه"
              disabled={loading}
              rows={3}
              className="rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-400 transition-all"
              style={{ resize: "none" }}
            />
          </Form.Item>

          {/* Message Display */}
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

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-slate-200">
            <GreenhouseButton
              text="انصراف"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto min-w-[140px] h-11"
            />
            <GreenhouseButton
              text={loading ? "در حال ثبت..." : "ثبت گیاه جدید"}
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
