import { Modal } from "antd";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import { useEffect } from "react";

export type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  id?: number;
  name?: string;
  onDelete?: (id: number) => void;
  deleteLoading?: boolean;
  msg?: string;
  setMsg?: (msg: string) => void;
};

export default function DeleteModal({
  open,
  onClose,
  id,
  name,
  onDelete,
  deleteLoading,
  msg,
  setMsg,
}: DeleteModalProps) {
  useEffect(() => {
    if (!open) return;
    // Reset any state or perform any actions when the modal opens
    setMsg?.("");
  }, [open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closeIcon={null}
      title={null}
      width={480}
      className="!p-0"
      styles={{
        content: {
          padding: 0,
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Header Section */}
      <div className="relative px-6 py-5 bg-gradient-to-br from-rose-50/60 via-orange-50/40 to-white border-b border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center text-slate-600 hover:text-slate-700"
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 shadow-md flex items-center justify-center text-white">
            <ExclamationCircleOutlined className="text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">تأیید حذف</h3>
            <p className="text-sm text-slate-600 mt-0.5">این عملیات برگشت‌ناپذیر است</p>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="px-6 py-6 bg-white">
        <div className="mb-4">
          <p className="text-slate-700 text-base leading-relaxed">
            آیا از حذف <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{name}</span> اطمینان
            دارید؟
          </p>
          <p className="text-slate-500 text-sm mt-3">
            با تأیید این عملیات، تمامی داده‌های مرتبط به صورت دائمی از سیستم پاک خواهند شد.
          </p>
        </div>

        {msg && (
          <div className="mb-4 p-3 bg-rose-50/60 border border-rose-200/70 rounded-lg">
            <p className="text-sm text-rose-700 font-medium">{msg}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <GreenhouseButton
            text="انصراف"
            variant="secondary"
            onClick={onClose}
            disabled={deleteLoading}
            className="min-w-[120px]"
          />
          <GreenhouseButton
            text={deleteLoading ? "در حال حذف..." : "حذف کامل"}
            variant="primary"
            loading={deleteLoading}
            onClick={() => onDelete?.(id!)}
            className="min-w-[120px]"
            style={{
              background: deleteLoading ? undefined : "linear-gradient(135deg, #be123c 0%, #e11d48 100%)",
              borderColor: "#be123c",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
