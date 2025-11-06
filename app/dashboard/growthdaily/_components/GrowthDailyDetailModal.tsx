import DetailModal, { InfoCard } from "../../_components/UI/DetailModal";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

interface GrowthDailyDetailModalProps {
  open: boolean;
  data: any | null;
  onClose: () => void;
}

export default function GrowthDailyDetailModal({ open, data, onClose }: GrowthDailyDetailModalProps) {
  if (!data) return null;

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return dayjs(date).calendar("jalali").locale("fa").format("YYYY/MM/DD");
  };

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="جزئیات پایش روزانه رشد"
      icon={<span className="text-2xl">🌱</span>}
      gradientFrom="teal"
      gradientTo="cyan"
    >
      {/* کارت اطلاعات کاشت */}
      <InfoCard
        title="اطلاعات کاشت"
        icon={<span className="text-xl">🌾</span>}
        color="#14b8a6"
        items={[
          { label: "شناسه کاشت", value: data.PlantingSamples?.Plantings?.PlantingID },
          { label: "نام گونه", value: data.PlantingSamples?.Plantings?.PlantVarieties?.VarietyName },
          { label: "نام گیاه", value: data.PlantingSamples?.Plantings?.PlantVarieties?.Plants?.CommonName },
          { label: "شناسه نمونه", value: data.PlantingSamples?.SerialID },
        ]}
      />

      {/* کارت اطلاعات پایش */}
      <InfoCard
        title="اطلاعات پایش"
        icon={<span className="text-xl">📊</span>}
        color="#0d9488"
        items={[
          { label: "تاریخ ثبت", value: formatDate(data.RecordDate) },
          { label: "مرحله رشد", value: data.PlantGrowthStages?.StageName },
          { label: "مشاهده کننده", value: data.Owner_Observer?.FullName },
          { label: "تخمینی", value: data.IsEstimated ? "بله" : "خیر" },
        ]}
      />

      {/* کارت اندازه‌گیری‌های رشد */}
      <InfoCard
        title="اندازه‌گیری‌های رشد"
        icon={<span className="text-xl">📏</span>}
        color="#06b6d4"
        items={[
          { label: "ارتفاع (سانتی‌متر)", value: data.HeightCm },
          { label: "تعداد برگ‌ها", value: data.LeafCount },
          { label: "تعداد گل‌ها", value: data.FlowerCount },
          { label: "تعداد میوه‌ها", value: data.FruitCount },
        ]}
      />

      {/* کارت اطلاعات ریشه */}
      <InfoCard
        title="اطلاعات ریشه"
        icon={<span className="text-xl">🌿</span>}
        color="#0891b2"
        items={[
          { label: "طول ریشه", value: data.RootLength },
          { label: "قطر ریشه", value: data.Rootdiameter },
        ]}
      />

      {/* کارت سلامت و آفات */}
      <InfoCard
        title="سلامت و آفات"
        icon={<span className="text-xl">🩺</span>}
        color="#0e7490"
        items={[
          { label: "امتیاز سلامت", value: data.HealthScore },
          { label: "مشاهده آفت", value: data.PestObserved ? "بله" : "خیر" },
        ]}
      />

      {/* کارت یادداشت‌ها */}
      {data.Notes && (
        <div className="md:col-span-2">
          <InfoCard
            title="یادداشت‌ها"
            icon={<span className="text-xl">📝</span>}
            color="#155e75"
            items={[{ label: "یادداشت", value: data.Notes, span: true }]}
          />
        </div>
      )}
    </DetailModal>
  );
}
