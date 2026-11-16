"use client";

import { formatPersianDate } from "@/shared/dates/calendar";

import type { WarehouseTransactionDetails } from "../types/details";

import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import {
  ContainerOutlined,
  FileTextOutlined,
  InboxOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

interface DetailModalProps {
  open: boolean;
  onCancel: () => void;
  data: WarehouseTransactionDetails | null;
}

export default function SeedWarehousingDetailModal({
  open,
  onCancel,
  data,
}: DetailModalProps) {
  if (!data) return null;

  const trxType = data.TransactionType
    ? { text: "ورودی", color: "green" }
    : { text: "خروجی", color: "red" };

  return (
    <DetailModal
      open={open}
      onClose={onCancel}
      title="جزئیات تراکنش انبار"
      icon={<FileTextOutlined />}
      gradientFrom="emerald"
      gradientTo="teal"
    >
      <>
        {/* General Info */}
        <InfoCard
          title="اطلاعات کلی تراکنش"
          icon={<InfoCircleOutlined />}
          color="#10b981"
          items={[
            { label: "شماره ثبت", value: data.ID },
            {
              label: "نوع تراکنش",
              value: <Tag color={trxType.color}>{trxType.text}</Tag>,
            },
            {
              label: "تاریخ تراکنش",
              value: formatPersianDate(data.TransactionDate, {
                kind: "timestamp",
              }),
            },
            { label: "تعداد بسته", value: data.PackageQuantity },
          ]}
        />

        {/* Warehouse Info */}
        <InfoCard
          title="جزئیات انبار"
          icon={<ContainerOutlined />}
          color="#3b82f6"
          items={[
            {
              label: "نام انبار",
              value: data.Tbl_Warehouses?.WarehouseName || "—",
            },
            {
              label: "محل انبار",
              value: data.Tbl_Warehouses?.WarehouseLocation || "—",
            },
            {
              label: "مدیر انبار",
              value: data.Tbl_Warehouses?.WarehouseManagerName || "—",
            },
          ]}
        />

        {/* Seed Package Info */}
        <InfoCard
          title="جزئیات بسته بذر"
          icon={<InboxOutlined />}
          color="#f59e0b"
          items={[
            {
              label: "شماره سریال",
              value: data.Tbl_SeedPackage?.SerialNumber || "—",
            },
            {
              label: "نوع بسته",
              value: data.Tbl_SeedPackage?.PackageType || "—",
            },
            {
              label: "وزن (گرم)",
              value: data.Tbl_SeedPackage?.WeightGram || "—",
            },
          ]}
        />

        {/* Other Info */}
        <InfoCard
          title="سایر اطلاعات"
          icon={<FileTextOutlined />}
          color="#64748b"
          items={[
            { label: "مقصد/منبع", value: data.DestinationType || "—" },
            { label: "ثبت کننده", value: data.RecordedBy || "—" },
          ]}
        />
      </>
    </DetailModal>
  );
}
