
export interface CreateNurseryCareLogDTO {
    NurserySeedID: number;
    CareType: string;
    MaterialUsed?: string;
    MaterialDose?: string;
    RoomTemperature?: number;
    RoomHumidity?: number;
    SupervisorName?: string;
    CareDate: Date;
    CareNote?: string;
}

export interface UpdateNurseryCareLogDTO {
    CareLogID: number;
    NurserySeedID: number;
    CareType: string;
    MaterialUsed?: string;
    MaterialDose?: string;
    RoomTemperature?: number;
    RoomHumidity?: number;
    SupervisorName?: string;
    CareDate: Date;
    CareNote?: string;
}
