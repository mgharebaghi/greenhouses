"use client";

import type { WarehouseRecord } from "../types/record";

import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import {
  DashboardOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface WarehousesDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: WarehouseRecord | null;
}

export default function WarehousesDetailModal({
  open,
  onClose,
  data,
}: WarehousesDetailModalProps) {
  if (!data) return null;

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="جزئیات انبار"
      icon={<ShopOutlined />}
      gradientFrom="emerald"
      gradientTo="cyan"
    >
      <InfoCard
        title="اطلاعات کلی"
        icon={<DashboardOutlined />}
        color="#10b981"
        items={[
          { label: "کد انبار", value: data.WarehouseCode },
          { label: "نام انبار", value: data.WarehouseName },
          { label: "موقعیت مکانی", value: data.WarehouseLocation },
          {
            label: "تاریخ ایجاد",
            value: data.WarehouseCreatedAt
              ? new Date(data.WarehouseCreatedAt).toLocaleDateString("fa-IR")
              : "---",
          },
        ]}
      />

      <InfoCard
        title="شرایط و ظرفیت"
        icon={<EnvironmentOutlined />}
        color="#0ea5e9"
        items={[
          { label: "محدوده دمایی", value: data.TemperatureRange },
          { label: "محدوده رطوبت", value: data.HumidityRange },
          { label: "ظرفیت", value: data.Capacity },
        ]}
      />

      <InfoCard
        title="مدیریت"
        icon={<UserOutlined />}
        color="#8b5cf6"
        items={[
          { label: "مسئول انبار", value: data.WarehouseManagerName || "---" },
        ]}
      />
    </DetailModal>
  );
}
