// Plain transport contracts. No ORM or framework dependencies.
export type WarehouseRecord = {
  ID: number;
  WarehouseCode: string | null;
  WarehouseName: string | null;
  WarehouseLocation: string | null;
  TemperatureRange: string | null;
  HumidityRange: string | null;
  Capacity: number | null;
  WarehouseManagerName: string | null;
  WarehouseCreatedAt: Date | string | null;
};
