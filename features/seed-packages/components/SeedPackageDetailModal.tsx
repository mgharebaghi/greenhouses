"use client";

import { formatPersianDate } from "@/shared/dates/calendar";

import type { SeedPackageDetails } from "../types/details";

import DetailModal, {
  DetailIdentity,
  InfoCard,
} from "@/shared/components/DetailModal";
import {
  CalendarOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

interface SeedPackageDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: SeedPackageDetails | null;
}

export default function SeedPackageDetailModal({
  open,
  onClose,
  data,
}: SeedPackageDetailModalProps) {
  if (!data) return null;

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="جزئیات بسته بذر"
      icon={<ExperimentOutlined />}
    >
      <DetailIdentity
        label="شماره سریال"
        code={data.SerialNumber}
        id={data.ID}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* اطلاعات محصول */}
        <InfoCard
          title="اطلاعات محصول"
          icon={<DashboardOutlined />}
          items={[
            {
              label: "تامین کننده",
              value: data.Tbl_suppliers
                ? data.Tbl_suppliers.Legal
                  ? data.Tbl_suppliers.CompanyName
                  : `${data.Tbl_suppliers.FirstName} ${data.Tbl_suppliers.LastName}`
                : "—",
            },
            { label: "شرکت تولیدی", value: data.ProducerCompany },
            {
              label: "واریته",
              value: data.Tbl_plantVariety?.VarietyName || "—",
            },
            {
              label: "نوع گیاه",
              value: data.Tbl_plantVariety?.Tbl_Plants?.CommonName,
            },
            { label: "نوع بسته", value: data.PackageType },
          ]}
        />

        {/* کنترل کیفیت */}
        <InfoCard
          title="کنترل کیفیت"
          icon={<SafetyCertificateOutlined />}
          items={[
            {
              label: "نرخ جوانه زنی",
              value:
                data.GerminationRate != null
                  ? `${data.GerminationRate} %`
                  : "—",
            },
            {
              label: "درصد خلوص",
              value:
                data.PurityPercent != null ? `${data.PurityPercent} %` : "—",
            },
            { label: "درجه کیفی", value: data.QualityGrade },
            {
              label: "گواهی کیفیت",
              value: data.IsCertified ? "تایید شده" : "تایید نشده",
            },
          ]}
        />

        {/* مقادیر و بسته‌بندی */}
        <InfoCard
          title="مقادیر و بسته‌بندی"
          icon={<ExperimentOutlined />}
          items={[
            {
              label: "تعداد کل بسته‌ها",
              value:
                data.PackageNumber != null
                  ? `${data.PackageNumber.toLocaleString()} عدد`
                  : "—",
            },
            {
              label: "تعداد بذر در بسته",
              value:
                data.SeedCount != null
                  ? `${data.SeedCount.toLocaleString()} عدد`
                  : "—",
            },
            {
              label: "وزن هر بسته",
              value: data.WeightGram != null ? `${data.WeightGram} گرم` : "—",
            },
          ]}
        />

        {/* تاریخ‌های مهم */}
        <InfoCard
          title="اطلاعات زمان‌بندی"
          icon={<CalendarOutlined />}
          items={[
            {
              label: "تاریخ تولید",
              value: formatPersianDate(data.ProductionDate),
            },
            {
              label: "تاریخ بسته بندی",
              value: formatPersianDate(data.PackagingDate),
            },
            {
              label: "تاریخ انقضا",
              value: formatPersianDate(data.ExpirationDate),
            },
          ]}
        />
      </div>
    </DetailModal>
  );
}
