import DetailModal, { InfoCard } from "../../_components/UI/DetailModal";
import { ClimateDaily } from "@/app/generated/prisma";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

interface ClimateDailyDetailModalProps {
  open: boolean;
  data: any | null;
  onClose: () => void;
}

export default function ClimateDailyDetailModal({ open, data, onClose }: ClimateDailyDetailModalProps) {
  if (!data) return null;

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD");
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";
    return Number(value).toFixed(2);
  };

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="جزئیات پایش آب و هوا"
      icon={<span className="text-2xl">🌤️</span>}
      gradientFrom="sky"
      gradientTo="blue"
    >
      {/* کارت اطلاعات مکانی و زمانی */}
      <InfoCard
        title="اطلاعات مکانی و زمانی"
        icon={<span className="text-xl">📍</span>}
        color="#0ea5e9"
        items={[
          { label: "گلخانه", value: data?.Zones?.Greenhouses?.GreenhouseName },
          { label: "سالن", value: data?.Zones?.Name },
          { label: "تاریخ ثبت", value: formatDate(data.RecordDate) },
          { label: "زمان ثبت", value: data.RecordTime },
          { label: "مشاهده کننده", value: data.Owner_Observer?.FullName },
        ]}
      />

      {/* کارت شرایط خارجی */}
      <InfoCard
        title="شرایط محیط خارجی"
        icon={<span className="text-xl">🌍</span>}
        color="#3b82f6"
        items={[
          { label: "دمای خارجی", value: `${formatNumber(data.ExternalTemp)} °C` },
          { label: "رطوبت خارجی", value: `${formatNumber(data.ExternalHumidity)} %` },
          { label: "فشار هوا", value: `${formatNumber(data.ExternalPressure)} hPa` },
          { label: "بارش", value: `${formatNumber(data.ExternalRainfallMM)} mm` },
        ]}
      />

      {/* کارت شرایط داخلی */}
      <InfoCard
        title="شرایط محیط داخلی"
        icon={<span className="text-xl">🏠</span>}
        color="#10b981"
        items={[
          { label: "دمای داخلی", value: `${formatNumber(data.InternalTemp)} °C` },
          { label: "رطوبت داخلی", value: `${formatNumber(data.InternalHumidity)} %` },
          { label: "CO2", value: `${formatNumber(data.CO2ppm)} ppm` },
          { label: "VPD", value: `${formatNumber(data.VPD)} kPa` },
        ]}
      />

      {/* کارت نور خارجی */}
      <InfoCard
        title="شرایط نوری خارجی"
        icon={<span className="text-xl">☀️</span>}
        color="#f59e0b"
        items={[
          { label: "PAR خارجی", value: formatNumber(data.ExternalPAR) },
          { label: "DLI خارجی", value: formatNumber(data.ExternalDLI) },
        ]}
      />

      {/* کارت نور داخلی */}
      <InfoCard
        title="شرایط نوری داخلی"
        icon={<span className="text-xl">💡</span>}
        color="#eab308"
        items={[
          { label: "PAR داخلی", value: formatNumber(data.InternalPAR) },
          { label: "DLI داخلی", value: formatNumber(data.InternalDLI) },
        ]}
      />

      {/* کارت باد و تهویه */}
      <InfoCard
        title="باد و تهویه"
        icon={<span className="text-xl">💨</span>}
        color="#06b6d4"
        items={[
          { label: "سرعت باد", value: `${formatNumber(data.WindSpeed)} m/s` },
          { label: "جهت باد", value: data.WindDirection ? `${data.WindDirection}°` : "-" },
          { label: "باز شدن هواکش", value: `${formatNumber(data.VentOpenPct)} %` },
          { label: "خطاهای هواکش", value: data.VentErrorCount || "-" },
        ]}
      />

      {/* کارت یادداشت‌ها */}
      {data.Notes && (
        <div className="md:col-span-2">
          <InfoCard
            title="یادداشت‌ها"
            icon={<span className="text-xl">📝</span>}
            color="#64748b"
            items={[{ label: "یادداشت", value: data.Notes, span: true }]}
          />
        </div>
      )}
    </DetailModal>
  );
}
