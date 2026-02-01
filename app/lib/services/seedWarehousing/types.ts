export interface SeedWarehousing {
    TransactionID: number;
    SeedPackageID: number | null;
    WarehouseID: number | null;
    TransactionType: boolean | null; // true for In, false for Out logic usually, or just distinguishing types. User might clarify.
    PackageQuantity: number | null;
    TransactionDate: Date | null;
    DestinationType: string | null;
    RecordedBy: string | null;

    // Relations
    SeedPackage?: any;
    Warehouses?: any;
}
