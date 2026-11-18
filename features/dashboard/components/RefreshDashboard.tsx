"use client";

import { ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import GreenhouseButton from "@/shared/components/GreenhouseButton";

export default function RefreshDashboard() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <GreenhouseButton
      text={pending ? "در حال تازه‌سازی…" : "تلاش دوباره"}
      variant="secondary"
      loading={pending}
      icon={<ReloadOutlined />}
      onClick={() => startTransition(() => router.refresh())}
    />
  );
}
