import type { GrowthStageRecord } from "@/features/growth-stages/types/record";
import type { GrowthStageDetails } from "../types";

export type GrowthStageRawArray = GrowthStageDetails[];
export type GrowthStageFlattened = GrowthStageRecord & {
  VarietyName: string;
};

export async function growthStagesCSVData(
  source?: GrowthStageRawArray,
): Promise<GrowthStageFlattened[]> {
  const data = source ?? [];
  return data.map((item) => ({
    ...item,
    VarietyName: item.Tbl_plantVariety?.VarietyName ?? "",
  }));
}

export const headers = [
  { displayLabel: "واریته", key: "VarietyName" },
  { displayLabel: "مرحله رشد", key: "StageOrder" },
  { displayLabel: "عنوان مرحله", key: "StageName" },
  { displayLabel: "علایم ورود به این مرحله", key: "EntryCriteria" },
  {
    displayLabel: "تعداد روز مورد انتظار برای ورود به این مرحله",
    key: "StartDay",
  },
  { displayLabel: "علائم خروج از این مرحله", key: "ExitCriteria" },
  {
    displayLabel: "تعداد روز مورد انتظار برای خروج از این مرحله",
    key: "EndDay",
  },
];
