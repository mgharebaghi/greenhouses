import { CloseOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
type HeaderTheme = {
  gradient: string;
  border: string;
  iconBg: string;
  iconDot: string;
  textMain: string;
  textSub: string;
  accent: string;
};
export default function FormModalHeader({
  theme,
  icon,
  modalTitle,
  modalSubTitle,
  onClose,
  padding = "relative px-6 py-6",
}: {
  theme: HeaderTheme;
  icon: ReactNode;
  modalTitle: string;
  modalSubTitle: string;
  onClose: () => void;
  padding?: string;
}) {
  return (
    <div
      className={`${padding} bg-gradient-to-br ${theme.gradient} border-b ${theme.border}`}
    >
      <button
        onClick={onClose}
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
            {icon}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${theme.iconDot} border-2 border-white dark:border-slate-800`}
          ></div>
        </div>
        <div>
          <h3 className={`font-bold text-2xl ${theme.textMain}`}>
            {modalTitle}
          </h3>
          <p
            className={`text-sm ${theme.textSub} mt-1 flex items-center gap-1.5`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full bg-${theme.accent}-400 animate-pulse`}
            ></span>
            {modalSubTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
