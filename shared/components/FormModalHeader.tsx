import { CloseOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import GreenhouseButton from "./GreenhouseButton";

export default function FormModalHeader({
  heading,
  description,
  icon,
  editing,
  onClose,
}: {
  heading: ReactNode;
  description?: ReactNode;
  icon: ReactNode;
  editing?: boolean;
  onClose: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 sm:px-5 dark:border-slate-700 dark:bg-slate-900">
      <div
        aria-hidden="true"
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-lg ${editing ? "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"}`}
      >
        {icon}
      </div>
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
        icon={<CloseOutlined />}
      />
    </header>
  );
}
