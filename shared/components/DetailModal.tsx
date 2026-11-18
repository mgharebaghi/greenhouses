import { CloseOutlined } from "@ant-design/icons";
import { toPersianDigits } from "@/shared/utils/digits";
import { useId, type ReactNode } from "react";
import ResponsiveModal from "./ResponsiveModal";
import GreenhouseButton from "./GreenhouseButton";
import ModalIcon from "./ModalIcon";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  width?: string | number;
}

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  items: { label: string; value: ReactNode; span?: boolean }[];
}

export function InfoCard({ title, icon, items }: InfoCardProps) {
  const heading = useId();
  return (
    <section
      aria-labelledby={heading}
      className="record-detail-section min-w-0 rounded-xl border"
    >
      <h3
        id={heading}
        className="record-detail-section-title flex items-center gap-2.5 rounded-t-xl border-b px-3 py-2.5 text-sm font-bold sm:px-4"
      >
        <span aria-hidden="true" className="shrink-0 text-(--button-accent)">
          {icon}
        </span>
        {title}
      </h3>
      <dl className="record-detail-fields grid gap-x-4 px-3 py-1 sm:px-4">
        {items.map(({ label, value, span }) => (
          <div
            key={label}
            className={`min-w-0 py-2 ${span ? "col-span-full" : ""}`}
          >
            <dt className="record-detail-label text-xs leading-5">{label}</dt>
            <dd className="min-w-0 text-sm leading-6 font-semibold [overflow-wrap:anywhere]">
              {typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "bigint"
                ? toPersianDigits(value) || "—"
                : (value ?? "—")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function DetailIdentity({
  label,
  code,
  id,
  children,
}: {
  label: string;
  code: string | null | undefined;
  id: number;
  children?: ReactNode;
}) {
  return (
    <section className="record-detail-section flex min-w-0 items-center gap-4 rounded-xl border p-3 sm:px-4">
      {children && (
        <div className="shrink-0 rounded-lg bg-white p-1.5">{children}</div>
      )}
      <dl className="min-w-0 flex-1">
        <div>
          <dt className="record-detail-label text-xs">{label}</dt>
          <dd className="text-base font-bold">
            <bdi>{code ? toPersianDigits(code) : "—"}</bdi>
          </dd>
        </div>
        <div className="mt-1.5">
          <dt className="record-detail-label text-xs">شناسهٔ سیستم</dt>
          <dd className="text-sm font-semibold">{toPersianDigits(id)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default function DetailModal({
  open,
  onClose,
  title,
  icon,
  children,
  width = 880,
}: DetailModalProps) {
  return (
    <ResponsiveModal
      className="record-detail-dialog"
      title={
        <div className="record-detail-heading flex min-w-0 items-center gap-3 px-3.5 py-3 sm:px-5">
          {icon && <ModalIcon>{icon}</ModalIcon>}
          <h2 className="min-w-0 flex-1 text-base leading-6 font-bold sm:text-lg">
            {toPersianDigits(title)}
          </h2>
          <GreenhouseButton
            onClick={onClose}
            aria-label="بستن جزئیات"
            variant="secondary"
            icon={<CloseOutlined />}
          />
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      width={width}
      styles={{
        content: { padding: 0, borderRadius: "1rem" },
        header: { margin: 0, background: "transparent" },
        mask: { backdropFilter: "blur(4px)" },
      }}
    >
      <div
        className="record-detail-body grid min-w-0 gap-3 p-3.5 sm:p-5"
        dir="rtl"
      >
        {children}
      </div>
    </ResponsiveModal>
  );
}
