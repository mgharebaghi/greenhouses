export interface WarehouseInput {
    WarehouseCode: string;
    WarehouseName: string;
    WarehouseLocation?: string;
    TemperatureRange?: string;
    HumidityRange?: string;
    Capacity?: number;
    WarehouseManagerName?: number; // Owner_Observer ID
    WarehouseCreatedAt?: Date;
}

export type WarehouseUpdateInput = Partial<WarehouseInput>;
