// Plain transport contracts. No ORM or framework dependencies.
export type RecoveryRoomRecord = {
  ID: number;
  GraftingOperationID: number | null;
  RecoveryEntryDate: Date | string | null;
  RecoveryExitDate: Date | string | null;
  GraftedLossCount: number | null;
};
