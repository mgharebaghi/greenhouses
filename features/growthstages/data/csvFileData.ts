import { getGrowthStages } from "@/features/growthstages/services";
import type { Tbl_PlantGrowthStage } from "@/app/generated/prisma";

export type GrowthStageRawArray = Awaited<ReturnType<typeof getGrowthStages>>;
export type GrowthStageFlattened = Tbl_PlantGrowthStage & {
  VarietyName: string;
};

export async function growthStagesCSVData(source?: GrowthStageRawArray): Promise<GrowthStageFlattened[]> {
  const data = source ?? (await getGrowthStages());
  return data.map((item) => ({
    ...item,
    VarietyName: (item as any).Tbl_plantVariety?.VarietyName ?? "",
  }));
}

export const headers = [
  { displayLabel: "واریته", key: "VarietyName" },
  { displayLabel: "مرحله رشد", key: "StageOrder" },
  { displayLabel: "عنوان مرحله", key: "StageName" },
  { displayLabel: "علایم ورود به این مرحله", key: "EntryCriteria" },
  { displayLabel: "تعداد روز مورد انتظار برای ورود به این مرحله", key: "StartDay" },
  { displayLabel: "علائم خروج از این مرحله", key: "ExitCriteria" },
  { displayLabel: "تعداد روز مورد انتظار برای خروج از این مرحله", key: "EndDay" },
];
