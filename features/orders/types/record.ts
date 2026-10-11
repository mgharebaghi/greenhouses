// Plain transport contracts. No ORM or framework dependencies.
export type OrderRecord = {
  ID: number;
  OrderCode: string | null;
  CustomerID: number | null;
  SupplierID: number | null;
  ProjectManager: number | null;
  OrderDate: Date | string | null;
  OrderCount: number | null;
  RootstockID: number | null;
  ScionID: number | null;
  QRCode: Uint8Array | null;
};
