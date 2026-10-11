// Plain transport contracts. No ORM or framework dependencies.
export type GraftingOperationRecord = {
  ID: number;
  OrderID: number | null;
  ColdRoomExitDate: Date | string | null;
  GraftingDate: Date | string | null;
  TrayNumber: number | null;
  CellPerTrayNumber: number | null;
  CellHeight: number | null;
  TrayMaterial: string | null;
  PlantingBed: string | null;
  PlantingBedRatio: number | null;
  GraftingClamp: string | null;
  GraftingStick: string | null;
  GraftingTechnicianID: number | null;
};

export type GraftWorkerRecord = {
  ID: number;
  GraftingOperationID: number | null;
  GraftWorkerID: number | null;
  LossPerWorker: number | null;
};
