"use client";
import DetailModal, { InfoCard } from "../../_components/UI/DetailModal";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  DatabaseOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

interface PlantingDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: any | null;
}

export default function PlantingDetailModal({ open, onClose, data }: PlantingDetailModalProps) {
  if (!data) return null;

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "—";
    return dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD");
  };

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="جزئیات کاشت"
      icon={<DatabaseOutlined />}
      gradientFrom="blue"
      gradientTo="indigo"
    >
      {/* اطلاعات مکانی */}
      <InfoCard
        title="اطلاعات مکانی"
        icon={<EnvironmentOutlined />}
        color="#10b981"
        items={[
          { label: "نام گلخانه", value: (data as any).GreenhouseName },
          { label: "سالن", value: (data as any).Zones?.Name },
          { label: "شناسه کاشت", value: data.PlantingID },
        ]}
      />

      {/* اطلاعات گیاه */}
      <InfoCard
        title="اطلاعات گیاهی"
        icon={<ExperimentOutlined />}
        color="#3b82f6"
        items={[
          { label: "گونه گیاهی", value: (data as any).PlantVarieties?.VarietyName },
          { label: "تعداد گیاهان", value: data.NumPlants },
          { label: "تراکم بوته (گیاه/m²)", value: data.PlantsPerM2 },
          { label: "تعداد شمارش‌شده", value: data.PlantCountMeasured },
        ]}
      />

      {/* تاریخ‌ها */}
      <InfoCard
        title="تاریخ‌ها"
        icon={<CalendarOutlined />}
        color="#f59e0b"
        items={[
          { label: "تاریخ کاشت", value: formatDate(data.PlantDate) },
          { label: "تاریخ نشاکاری", value: formatDate(data.TransplantDate) },
          { label: "برداشت مورد انتظار", value: formatDate(data.ExpectedHarvestDate) },
          { label: "برداشت واقعی", value: formatDate(data.ActualHarvestDate) },
        ]}
      />

      {/* اطلاعات تکمیلی */}
      <InfoCard
        title="اطلاعات تکمیلی"
        icon={<FileTextOutlined />}
        color="#8b5cf6"
        items={[
          {
            label: "تامین کننده",
            value: data.Suppliers
              ? data.Suppliers.Legal
                ? data.Suppliers.CompanyName
                : data.Suppliers.FirstName + " " + data.Suppliers.LastName
              : "—",
          },
          { label: "روش کاشت", value: data.SeedingMethod },
        ]}
      />

      {/* یادداشت‌ها */}
      {data.Notes && (
        <div className="md:col-span-2">
          <InfoCard
            title="یادداشت‌ها"
            icon={<FileTextOutlined />}
            color="#64748b"
            items={[{ label: "توضیحات", value: data.Notes, span: true }]}
          />
        </div>
      )}
    </DetailModal>
  );
}
