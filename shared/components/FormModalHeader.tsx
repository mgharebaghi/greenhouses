import { CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import GreenhouseButton from "./GreenhouseButton";
import ModalIcon from "./ModalIcon";

export default function FormModalHeader({
  heading,
  description,
  editing,
  busy,
  onClose,
}: {
  heading: ReactNode;
  description?: ReactNode;
  editing?: boolean;
  busy?: boolean;
  onClose: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 sm:px-5 dark:border-slate-700 dark:bg-slate-900">
      <ModalIcon>{editing ? <EditOutlined /> : <PlusOutlined />}</ModalIcon>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold [overflow-wrap:anywhere] sm:text-lg text-slate-900 dark:text-slate-100">
          {heading}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs [overflow-wrap:anywhere] text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
      </div>
      <GreenhouseButton
        onClick={onClose}
        aria-label="بستن"
        variant="secondary"
        disabled={busy}
        icon={<CloseOutlined />}
      />
    </header>
  );
}
