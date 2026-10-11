// Plain transport contracts. No ORM or framework dependencies.
export type NurseryRoomRecord = {
  ID: number;
  NurseryRoomCode: string | null;
  NurseryRoomName: string | null;
  TemperatureMin: number | null;
  TemperatureMax: number | null;
  HumidityMin: number | null;
  HumidityMax: number | null;
  LightType: string | null;
  LightHoursPerDay: number | null;
  CO2Range: string | null;
  StrelizationMethod: string | null;
  NurseryRoomCreatedAt: Date | string | null;
};
