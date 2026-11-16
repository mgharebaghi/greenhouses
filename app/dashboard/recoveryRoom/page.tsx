"use client";

import { RECOVERY_UNAVAILABLE_MESSAGE } from "@/features/recovery-rooms/domain/availability";

export default function RecoveryRoomPage() {
  return (
    <div className="dashboard-page">
      <div role="status" className="p-6 text-center">
        {RECOVERY_UNAVAILABLE_MESSAGE}
      </div>
    </div>
  );
}
