
"use client";
import DetailModal, { InfoCard } from "../../_components/UI/DetailModal";
import { PlantVarietyDTO } from "../page";

interface PlantVarietyDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: PlantVarietyDTO | null;
}

export default function PlantVarietyDetailModal({ open, onClose, data }: PlantVarietyDetailModalProps) {
  if (!data) return null;

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="جزئیات گونه گیاهی"
      icon={<span className="text-2xl">🌿</span>}
      gradientFrom="green"
      gradientTo="emerald"
    >
      {/* اطلاعات اولیه */}
      <InfoCard
        title="اطلاعات اولیه"
        icon={<span className="text-xl">🌱</span>}
        color="#10b981"
        items={[
          { label: "نام گونه", value: data.VarietyName },
          { label: "نام رایج", value: data.Tbl_Plants?.CommonName },
          { label: "نام علمی", value: data.Tbl_Plants?.ScientificName },
          { label: "خانواده", value: data.Tbl_Plants?.PlantFamily },
        ]}
      />

      {/* زمان‌بندی رشد */}
      <InfoCard
        title="زمان‌بندی رشد"
        icon={<span className="text-xl">⏱️</span>}
        color="#3b82f6"
        items={[
          { label: "تعداد روز تا جوانه زنی", value: data.DaysToGermination ? `${data.DaysToGermination} روز` : "—" },
          { label: "تعداد روز تا رویش", value: data.DaysToSprout ? `${data.DaysToSprout} روز` : "—" },
          { label: "تعداد روز تا نشاء", value: data.DaysToSeedling ? `${data.DaysToSeedling} روز` : "—" },
          { label: "تعداد روز تا بلوغ", value: data.DaysToMaturity ? `${data.DaysToMaturity} روز` : "—" },
        ]}
      />

      {/* شرایط دمایی */}
      <InfoCard
        title="شرایط دمایی"
        icon={<span className="text-xl">🌡️</span>}
        color="#f59e0b"
        items={[
          { label: "حداقل دمای ایده‌آل", value: data.IdealTempMin ? `${data.IdealTempMin}°C` : "—" },
          { label: "حداکثر دمای ایده‌آل", value: data.IdealTempMax ? `${data.IdealTempMax}°C` : "—" },
        ]}
      />

      {/* شرایط رطوبتی */}
      <InfoCard
        title="شرایط رطوبتی"
        icon={<span className="text-xl">💧</span>}
        color="#06b6d4"
        items={[
          { label: "حداقل رطوبت ایده‌آل", value: data.IdealHumidityMin ? `${data.IdealHumidityMin}%` : "—" },
          { label: "حداکثر رطوبت ایده‌آل", value: data.IdealHumidityMax ? `${data.IdealHumidityMax}%` : "—" },
        ]}
      />

      {/* نور و عملکرد */}
      <InfoCard
        title="نور و عملکرد"
        icon={<span className="text-xl">☀️</span>}
        color="#8b5cf6"
        items={[
          { label: "نیاز نوری", value: data.LightRequirement },
        ]}
      />

      {/* یادداشت‌ها */}
      {data.Notes && (
        <div className="md:col-span-2">
          <InfoCard
            title="یادداشت‌ها"
            icon={<span className="text-xl">📝</span>}
            color="#64748b"
            items={[{ label: "توضیحات", value: data.Notes, span: true }]}
          />
        </div>
      )}
    </DetailModal>
  );
}
