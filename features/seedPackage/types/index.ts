export interface SeedPackageInput {
    SupplierID?: number | null;
    ProducerCompany?: string | null;
    CropVariety?: number | null;
    GerminationRate?: number | null;
    PurityPercent?: number | null;
    PackageNumber?: number | null;
    ProductionDate?: Date | string | null;
    ExpirationDate?: Date | string | null;
    QualityGrade?: string | null;
    SerialNumber?: string | null;
    PackageType?: string | null;
    SeedCount?: number | null;
    WeightGram?: number | null;
    PackagingDate?: Date | string | null;
    IsCertified?: boolean | null;
}

export type SeedPackageUpdateInput = Partial<SeedPackageInput>;

export type SeedPackageCreateRes = {
    status: "ok" | "error";
    message: string;
    seedPackageId?: number;
};
