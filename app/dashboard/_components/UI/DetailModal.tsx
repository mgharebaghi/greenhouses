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
    bordered={false}
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

export default function DetailModal({
  open,
  onClose,
  title,
  icon,
  gradientFrom,
  gradientTo,
  children,
}: DetailModalProps) {
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
        className={`sticky top-0 z-10 px-6 py-5 bg-gradient-to-br from-${gradientFrom}-50/80 via-${gradientTo}-50/60 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 backdrop-blur-sm`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-all flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-700"
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div
            className={`h-12 w-12 rounded-xl bg-gradient-to-br from-${gradientFrom}-500 to-${gradientTo}-600 flex items-center justify-center text-white text-xl shadow-lg`}
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
