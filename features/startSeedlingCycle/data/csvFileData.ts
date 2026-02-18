import { getStartSeedlingCycles } from "../services/read";
import { StartSeedlingCycle } from "../types";

export type StartSeedlingCycleRawArray = Awaited<ReturnType<typeof getStartSeedlingCycles>>;

export type StartSeedlingCycleFlattened = {
    ID: number;
    OrderCode: string;
    SeedType: string;
    GreenhouseName: string;
    GerminationRoomExitDate: string;
    NumberOfLostSeedlingFromGermination: number;
    GreenhouseEntryDate: string;
    NumberOfTrays: number;
    SalonName: string;
    GreenhouseExitDate: string;
    NumberOfLostSeedlingFromGreenhouse: number;
};

export async function startSeedlingCycleCSVData(source?: StartSeedlingCycle[]): Promise<StartSeedlingCycleFlattened[]> {
    const data = source ?? (await getStartSeedlingCycles());
    return data.map((item) => ({
        ID: item.ID,
        OrderCode: item.Tbl_Orders?.OrderCode || "",
        SeedType: item.SeedType ? "پیوندک" : "پایه",
        GreenhouseName: item.Tbl_Greenhouses?.GreenhouseName || "",
        GerminationRoomExitDate: item.GerminationRoomExitDate ? new Date(item.GerminationRoomExitDate as string | Date).toLocaleDateString('fa-IR') : "",
        NumberOfLostSeedlingFromGermination: item.NumberOfLostSeedlingFromGermination || 0,
        GreenhouseEntryDate: item.GreenhouseEntryDate ? new Date(item.GreenhouseEntryDate as string | Date).toLocaleDateString('fa-IR') : "",
        NumberOfTrays: item.NumberOfTrays || 0,
        SalonName: item.SalonName || "",
        GreenhouseExitDate: item.GreenhouseExitDate ? new Date(item.GreenhouseExitDate as string | Date).toLocaleDateString('fa-IR') : "",
        NumberOfLostSeedlingFromGreenhouse: item.NumberOfLostSeedlingFromGreenhouse || 0,
    }));
}

export const headers = [
    { displayLabel: "شناسه", key: "ID" },
    { displayLabel: "کد سفارش", key: "OrderCode" },
    { displayLabel: "نوع بذر", key: "SeedType" },
    { displayLabel: "نام گلخانه", key: "GreenhouseName" },
    { displayLabel: "تاریخ خروج از اتاق جوانه زنی", key: "GerminationRoomExitDate" },
    { displayLabel: "تعداد تلفات جوانه زنی", key: "NumberOfLostSeedlingFromGermination" },
    { displayLabel: "تاریخ ورود به گلخانه", key: "GreenhouseEntryDate" },
    { displayLabel: "تعداد سینی", key: "NumberOfTrays" },
    { displayLabel: "نام سالن", key: "SalonName" },
    { displayLabel: "تاریخ خروج از گلخانه", key: "GreenhouseExitDate" },
    { displayLabel: "تعداد تلفات گلخانه", key: "NumberOfLostSeedlingFromGreenhouse" },
];
