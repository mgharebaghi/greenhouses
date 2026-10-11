"use client";

import { RECOVERY_UNAVAILABLE_MESSAGE } from "@/features/recovery-rooms/domain/availability";
import PageHeader from "@/shared/components/PageHeader";
import { MedicineBoxOutlined } from "@ant-design/icons";

export default function RecoveryRoomPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="اتاق ریکاوری"
        subtitle="مدیریت و مشاهده وضعیت سینی‌های موجود در اتاق ریکاوری"
        icon={<MedicineBoxOutlined />}
      />
      <div role="status" className="p-6 text-center">
        {RECOVERY_UNAVAILABLE_MESSAGE}
      </div>
    </div>
  );
}
