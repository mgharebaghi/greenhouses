"use client";

import { formatPersianDate } from "@/shared/dates/calendar";

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
    >
      <InfoCard
        title="اطلاعات کلی"
        icon={<DashboardOutlined />}
        items={[
          { label: "کد انبار", value: data.WarehouseCode },
          { label: "نام انبار", value: data.WarehouseName },
          { label: "موقعیت مکانی", value: data.WarehouseLocation },
          {
            label: "تاریخ ایجاد",
            value: formatPersianDate(data.WarehouseCreatedAt, {
              fallback: "---",
            }),
          },
        ]}
      />

      <InfoCard
        title="شرایط و ظرفیت"
        icon={<EnvironmentOutlined />}
        items={[
          { label: "محدوده دمایی", value: data.TemperatureRange },
          { label: "محدوده رطوبت", value: data.HumidityRange },
          { label: "ظرفیت", value: data.Capacity },
        ]}
      />

      <InfoCard
        title="مدیریت"
        icon={<UserOutlined />}
        items={[
          { label: "مسئول انبار", value: data.WarehouseManagerName || "---" },
        ]}
      />
    </DetailModal>
  );
}
