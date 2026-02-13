import { Modal, Card } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { ReactNode } from "react";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  gradientFrom: string;
  gradientTo: string;
  children: ReactNode;
}

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  color: string;
  items: { label: string; value: any; span?: boolean }[];
}

export const InfoCard = ({ title, icon, color, items }: InfoCardProps) => (
  <Card
    className="shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700"
    styles={{
      header: {
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`, // Keep subtle for light mode
        borderBottom: `1px solid ${color}30`,
      },
      body: { padding: "16px" },
    }}
    variant="borderless"
    title={
      <div className="flex items-center gap-2">
        <span style={{ color }} className="dark:brightness-125 transition-all">{icon}</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{title}</span>
      </div>
    }
  >
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex ${item.span ? "flex-col gap-1" : "items-center justify-between"} ${idx !== items.length - 1 ? "pb-3 border-b border-slate-100 dark:border-slate-700" : ""
            }`}
        >
          <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
          <span className={`font-bold text-slate-900 dark:text-slate-100 ${item.span ? "text-sm" : ""}`}>{item.value || "—"}</span>
        </div>
      ))}
    </div>
  </Card>
);

// Safelist keys for Tailwind
const themeConfig: Record<string, {
  headerBg: string;
  iconBg: string;
  closeBtnHover: string;
  iconColor: string;
}> = {
  purple: {
    headerBg: "from-purple-50/80 via-indigo-50/60",
    iconBg: "from-purple-500 to-indigo-600",
    closeBtnHover: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-500",
  },
  indigo: {
    headerBg: "from-indigo-50/80 via-blue-50/60",
    iconBg: "from-indigo-500 to-blue-600",
    closeBtnHover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-500",
  },
  emerald: {
    headerBg: "from-emerald-50/80 via-teal-50/60",
    iconBg: "from-emerald-500 to-teal-600",
    closeBtnHover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    iconColor: "text-emerald-600 dark:text-emerald-500",
  },
  blue: {
    headerBg: "from-blue-50/80 via-sky-50/60",
    iconBg: "from-blue-500 to-sky-600",
    closeBtnHover: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-500",
  },
  orange: {
    headerBg: "from-orange-50/80 via-amber-50/60",
    iconBg: "from-orange-500 to-amber-600",
    closeBtnHover: "hover:bg-orange-50 dark:hover:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-500",
  },
  teal: {
    headerBg: "from-teal-50/80 via-emerald-50/60",
    iconBg: "from-teal-500 to-emerald-600",
    closeBtnHover: "hover:bg-teal-50 dark:hover:bg-teal-900/20",
    iconColor: "text-teal-600 dark:text-teal-500",
  },
};

export default function DetailModal({
  open,
  onClose,
  title,
  icon,
  gradientFrom,
  gradientTo, // Kept for API compatibility, but logic mainly uses gradientFrom as the key
  children,
}: DetailModalProps) {
  // Fallback to 'emerald' or use the provided 'gradientFrom' as key
  const theme = themeConfig[gradientFrom] || themeConfig['emerald'];

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closeIcon={null}
      width="clamp(360px, 95vw, 1100px)"
      styles={{
        content: {
          padding: 0,
          borderRadius: "1rem",
          overflow: "hidden",
          maxHeight: "90vh",
        },
        body: {
          padding: 0,
          maxHeight: "calc(90vh - 80px)",
          overflowY: "auto",
        },
      }}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 px-6 py-5 bg-gradient-to-br ${theme.headerBg} to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 backdrop-blur-sm`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 left-4 h-8 w-8 rounded-lg bg-white dark:bg-slate-800 ${theme.closeBtnHover} border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-all flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-700`}
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div
            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${theme.iconBg} flex items-center justify-center text-white text-xl shadow-lg`}
          >
            {icon}
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">{title}</h2>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-slate-50/50 dark:bg-slate-950">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
      </div>
    </Modal>
  );
}
