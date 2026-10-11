// Plain transport contracts. No ORM or framework dependencies.
export type GrowthStageRecord = {
  ID: number;
  VarietyID: number | null;
  StageOrder: number | null;
  StageName: string | null;
  EntryCriteria: string | null;
  StartDay: number | null;
  ExitCriteria: string | null;
  EndDay: number | null;
  note: string | null;
};
