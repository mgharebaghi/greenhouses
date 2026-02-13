"use client";
import type { Tbl_PlantGrowthStage } from "@/app/generated/prisma";
import DetailModal, { InfoCard } from "@/shared/components/DetailModal";

interface GrowthStageDetailModalProps {
    open: boolean;
    onClose: () => void;
    data: Tbl_PlantGrowthStage | null;
}

export default function GrowthStageDetailModal({ open, onClose, data }: GrowthStageDetailModalProps) {
    if (!data) return null;

    return (
        <DetailModal
            open={open}
            onClose={onClose}
            title="جزئیات مرحله رشد"
            icon={<span className="text-2xl">🌱</span>}
            gradientFrom="green"
            gradientTo="emerald"
        >
            <InfoCard
                title="اطلاعات کلی"
                icon={<span className="text-xl">📋</span>}
                color="#10b981"
                items={[
                    { label: "گونه گیاهی", value: (data as any).Tbl_plantVariety?.VarietyName || "---" },
                    { label: "مرحله رشد (نام)", value: data.StageName || "---" },
                    { label: "نوبت/ترتیب مرحله", value: data.StageOrder ? `مرحله ${data.StageOrder}` : "---" },
                ]}
            />

            <InfoCard
                title="زمان‌بندی"
                icon={<span className="text-xl">⏱️</span>}
                color="#3b82f6"
                items={[
                    { label: "تعداد روز شروع", value: data.StartDay ? `${data.StartDay} روز` : "---" },
                    { label: "تعداد روز پایان", value: data.EndDay ? `${data.EndDay} روز` : "---" },
                ]}
            />

            <div className="md:col-span-2">
                <InfoCard
                    title="علائم و معیارها"
                    icon={<span className="text-xl">🔍</span>}
                    color="#f59e0b"
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
                        icon={<span className="text-xl">📝</span>}
                        color="#64748b"
                        items={[{ label: "توضیحات", value: data.note, span: true }]}
                    />
                </div>
            )}
        </DetailModal>
    );
}
