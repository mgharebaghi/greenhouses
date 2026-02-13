export interface WarehouseInput {
    WarehouseCode: string;
    WarehouseName: string;
    WarehouseLocation?: string;
    TemperatureRange?: string;
    HumidityRange?: string;
    Capacity?: number;
    WarehouseManagerName?: string;
    WarehouseCreatedAt?: Date;
}

export type WarehouseUpdateInput = Partial<WarehouseInput>;
