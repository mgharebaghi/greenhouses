export interface NurseryRoomInput {
    NurseryRoomCode: string;
    NurseryRoomName: string;
    TemperatureMin?: number;
    TemperatureMax?: number;
    HumidityMin?: number;
    HumidityMax?: number;
    LightType?: string;
    LightHoursPerDay?: number;
    CO2Range?: string;
    StrelizationMethod?: string;
    NurseryRoomCreatedAt?: Date;
}

export type NurseryRoomUpdateInput = Partial<NurseryRoomInput>;
