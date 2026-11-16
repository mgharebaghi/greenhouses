"use client";

import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import { PlantVarietyDTO } from "../types";

interface PlantVarietyDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: PlantVarietyDTO | null;
}

export default function PlantVarietyDetailModal({
  open,
  onClose,
  data,
}: PlantVarietyDetailModalProps) {
  if (!data) return null;

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="جزئیات واریته"
      icon={<span className="text-2xl">🌿</span>}
    >
      {/* اطلاعات اولیه */}
      <InfoCard
        title="اطلاعات اولیه"
        icon={<span className="text-xl">🌱</span>}
        items={[
          { label: "واریته", value: data.VarietyName },
          { label: "نام رایج", value: data.Tbl_Plants?.CommonName },
          { label: "نام علمی", value: data.Tbl_Plants?.ScientificName },
          { label: "خانواده", value: data.Tbl_Plants?.PlantFamily },
        ]}
      />

      {/* زمان‌بندی رشد */}
      <InfoCard
        title="زمان‌بندی رشد"
        icon={<span className="text-xl">⏱️</span>}
        items={[
          {
            label: "تعداد روز تا جوانه زنی",
            value: data.DaysToGermination
              ? `${data.DaysToGermination} روز`
              : "—",
          },
          {
            label: "تعداد روز تا رویش",
            value: data.DaysToSprout != null ? `${data.DaysToSprout} روز` : "—",
          },
          {
            label: "تعداد روز تا نشاء",
            value:
              data.DaysToSeedling != null ? `${data.DaysToSeedling} روز` : "—",
          },
          {
            label: "تعداد روز تا بلوغ",
            value:
              data.DaysToMaturity != null ? `${data.DaysToMaturity} روز` : "—",
          },
        ]}
      />

      {/* شرایط دمایی */}
      <InfoCard
        title="شرایط دمایی"
        icon={<span className="text-xl">🌡️</span>}
        items={[
          {
            label: "حداقل دمای ایده‌آل",
            value: data.IdealTempMin != null ? `${data.IdealTempMin}°C` : "—",
          },
          {
            label: "حداکثر دمای ایده‌آل",
            value: data.IdealTempMax != null ? `${data.IdealTempMax}°C` : "—",
          },
        ]}
      />

      {/* شرایط رطوبتی */}
      <InfoCard
        title="شرایط رطوبتی"
        icon={<span className="text-xl">💧</span>}
        items={[
          {
            label: "حداقل رطوبت ایده‌آل",
            value:
              data.IdealHumidityMin != null ? `${data.IdealHumidityMin}%` : "—",
          },
          {
            label: "حداکثر رطوبت ایده‌آل",
            value:
              data.IdealHumidityMax != null ? `${data.IdealHumidityMax}%` : "—",
          },
        ]}
      />

      {/* نور و عملکرد */}
      <InfoCard
        title="نور و عملکرد"
        icon={<span className="text-xl">☀️</span>}
        items={[{ label: "نیاز نوری", value: data.LightRequirement }]}
      />

      {/* یادداشت‌ها */}
      {data.Notes && (
        <div className="md:col-span-2">
          <InfoCard
            title="یادداشت‌ها"
            icon={<span className="text-xl">📝</span>}
            items={[{ label: "توضیحات", value: data.Notes, span: true }]}
          />
        </div>
      )}
    </DetailModal>
  );
}
