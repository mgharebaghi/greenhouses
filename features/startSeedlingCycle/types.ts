export interface StartSeedlingCycle {
    ID: number;
    OrderID?: number | null;
    SeedType?: boolean | null;
    GerminationRoomExitDate?: string | Date | null;
    NumberOfLostSeedlingFromGermination?: number | null;
    GreenhouseEntryDate?: string | Date | null;
    NumberOfTrays?: number | null;
    GreenhouseID?: number | null;
    SalonName?: string | null;
    GreenhouseExitDate?: string | Date | null;
    NumberOfLostSeedlingFromGreenhouse?: number | null;
    // Relations
    Tbl_Orders?: {
        OrderCode?: string | null;
        Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage?: {
            Tbl_plantVariety?: { VarietyName?: string | null } | null;
        } | null;
        Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage?: {
            Tbl_plantVariety?: { VarietyName?: string | null } | null;
        } | null;
    } | null;
    Tbl_Greenhouses?: {
        GreenhouseName?: string | null;
    } | null;
}

export interface StartSeedlingCycleInput {
    OrderID: number;
    SeedType: boolean;
    GerminationRoomExitDate: Date;
    NumberOfLostSeedlingFromGermination?: number;
    GreenhouseEntryDate: Date;
    NumberOfTrays?: number;
    GreenhouseID: number;
    SalonName?: string;
    GreenhouseExitDate?: Date;
    NumberOfLostSeedlingFromGreenhouse?: number;
}

export type StartSeedlingCycleCreateRes = {
    status: "ok" | "error";
    message: string;
    id?: number;
};
