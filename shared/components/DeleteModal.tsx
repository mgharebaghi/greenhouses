import { Modal } from "antd";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
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
      <div className="relative px-6 py-5 bg-gradient-to-br from-rose-50/60 via-orange-50/40 to-white dark:from-rose-950 dark:via-rose-900/50 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-all flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 shadow-md flex items-center justify-center text-white">
            <ExclamationCircleOutlined className="text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">تأیید حذف</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">این عملیات برگشت‌ناپذیر است</p>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="px-6 py-6 bg-white dark:bg-slate-900">
        <div className="mb-4">
          <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
            آیا از حذف <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{name}</span> اطمینان
            دارید؟
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">
            با تأیید این عملیات، تمامی داده‌های مرتبط به صورت دائمی از سیستم پاک خواهند شد.
          </p>
        </div>

        {msg && (
          <div className="mb-4 p-3 bg-rose-50/60 dark:bg-rose-900/20 border border-rose-200/70 dark:border-rose-800/50 rounded-lg">
            <p className="text-sm text-rose-700 dark:text-rose-400 font-medium">{msg}</p>
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
