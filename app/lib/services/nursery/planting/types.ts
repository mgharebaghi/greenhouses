export type CreateNurserySeedDTO = {
    SeedPackageID: number;
    NurseryRoomID: number;
    PlantingDate: Date;
    EmergenceDate?: Date;
    GrowthRate?: number;
    CurrentStage?: string;
    HealthStatus?: string;
    DiseaseObserved?: string;
    ReadyForGraftingDate?: Date;
};

export type UpdateNurserySeedDTO = Partial<CreateNurserySeedDTO> & {
    NurserySeedID: number;
};
