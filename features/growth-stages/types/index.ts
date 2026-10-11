import type { GrowthStageRecord } from "./record";
export type GrowthStageDetails = GrowthStageRecord & {
  Tbl_plantVariety?: { VarietyName: string | null } | null;
};

export type * from "./record";
