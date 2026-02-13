export const headers = [
    { displayLabel: "شناسه", key: "ID" },
    { displayLabel: "کد اتاق", key: "NurseryRoomCode" },
    { displayLabel: "نام اتاق", key: "NurseryRoomName" },
    { displayLabel: "دمای حداقل", key: "TemperatureMin" },
    { displayLabel: "دمای حداکثر", key: "TemperatureMax" },
    { displayLabel: "رطوبت حداقل", key: "HumidityMin" },
    { displayLabel: "رطوبت حداکثر", key: "HumidityMax" },
    { displayLabel: "نوع نور", key: "LightType" },
    { displayLabel: "ساعات نوردهی", key: "LightHoursPerDay" },
    { displayLabel: "نوع خاک", key: "SoilType" },
    { displayLabel: "سیستم آبیاری", key: "IrrigationType" },
];

export async function nurseryRoomsCSVData(source: any[]): Promise<any[]> {
    return source.map((item) => ({ ...item }));
}
