export interface SeedPackageInput {
    ProducerID?: number | null;
    CropVariety?: number | null;
    GerminationRate?: number | null;
    PurityPercent?: number | null;
    ProductionDate?: Date | string | null;
    ExpirationDate?: Date | string | null;
    QualityGrade?: string | null;
    SerialNumber?: string | null;
    PackageType?: string | null;
    SeedCount?: number | null;
    WeightGram?: number | null;
    PackagingDate?: Date | string | null;
    PackagingLine?: string | null;
    QRCode?: string | null; // Note: We might allow passing base64 string or handling it separately
    IsCertified?: boolean | null;
}

export type SeedPackageUpdateInput = Partial<SeedPackageInput>;

export type SeedPackageCreateRes = {
    status: "ok" | "error";
    message: string;
    seedPackageId?: number;
};
