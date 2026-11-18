"use client";

import type { GrowthStageDetails } from "../types";

import DetailModal, { InfoCard } from "@/shared/components/DetailModal";
import {
  ClockCircleOutlined,
  FileTextOutlined,
  ProfileOutlined,
  RiseOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface GrowthStageDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: GrowthStageDetails | null;
}

export default function GrowthStageDetailModal({
  open,
  onClose,
  data,
}: GrowthStageDetailModalProps) {
  if (!data) return null;

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="جزئیات مرحله رشد"
      icon={<RiseOutlined />}
    >
      <InfoCard
        title="اطلاعات کلی"
        icon={<ProfileOutlined />}
        items={[
          {
            label: "واریته - رقم",
            value: data.Tbl_plantVariety?.VarietyName || "---",
          },
          { label: "مرحله رشد (نام)", value: data.StageName || "---" },
          {
            label: "نوبت/ترتیب مرحله",
            value: data.StageOrder ? `مرحله ${data.StageOrder}` : "---",
          },
        ]}
      />

      <InfoCard
        title="زمان‌بندی"
        icon={<ClockCircleOutlined />}
        items={[
          {
            label: "تعداد روز شروع",
            value: data.StartDay != null ? `${data.StartDay} روز` : "---",
          },
          {
            label: "تعداد روز پایان",
            value: data.EndDay != null ? `${data.EndDay} روز` : "---",
          },
        ]}
      />

      <div className="md:col-span-2">
        <InfoCard
          title="علائم و معیارها"
          icon={<SearchOutlined />}
          items={[
            { label: "علائم ورود", value: data.EntryCriteria, span: true },
            { label: "علائم خروج", value: data.ExitCriteria, span: true },
          ]}
        />
      </div>

      {data.note && (
        <div className="md:col-span-2">
          <InfoCard
            title="یادداشت‌ها"
            icon={<FileTextOutlined />}
            items={[{ label: "توضیحات", value: data.note, span: true }]}
          />
        </div>
      )}
    </DetailModal>
  );
}
