export type PlantVarietyDTO = {
    ID: number;
    PlantID: number | null;
    VarietyName: string | null;
    DaysToGermination: number | null;
    DaysToSprout: number | null;
    DaysToSeedling: number | null;
    DaysToMaturity: number | null;
    IdealTempMin: number | null;
    IdealTempMax: number | null;
    IdealHumidityMin: number | null;
    IdealHumidityMax: number | null;
    LightRequirement: string | null;
    Notes: string | null;
    Tbl_Plants: {
        ID: number;
        CommonName: string | null;
        ScientificName: string | null;
        PlantFamily: string | null;
        Notes: string | null;
    } | null;
};
