
import { getAllGraftingOperations } from "../services/read";
import { GraftingOperationWithDetails } from "../types";

export type GraftingFlattened = {
    ID: number;
    OrderCode: string;
    GraftingDate: string;
    Technician: string;
    TrayNumber: number;
    CellPerTrayNumber: number;
    PlantingBed: string;
    GraftingClamp: string;
    WorkerCount: number;
};

export async function graftingCSVData(source?: GraftingOperationWithDetails[]): Promise<GraftingFlattened[]> {
    let data = source;
    if (!data) {
        const response = await getAllGraftingOperations();
        data = response.data || [];
    }

    return data.map((item) => ({
        ID: item.ID,
        OrderCode: item.Tbl_Orders?.OrderCode || "",
        GraftingDate: item.GraftingDate ? new Date(item.GraftingDate).toLocaleDateString("fa-IR") : "",
        Technician: item.Tbl_People ? `${item.Tbl_People.FirstName} ${item.Tbl_People.LastName}` : "",
        TrayNumber: item.TrayNumber || 0,
        CellPerTrayNumber: item.CellPerTrayNumber || 0,
        PlantingBed: item.PlantingBed || "",
        GraftingClamp: item.GraftingClamp || "",
        WorkerCount: item.Tbl_GraftWorkers?.length || 0,
    }));
}

export const headers = [
    { displayLabel: "شناسه", key: "ID" },
    { displayLabel: "کد سفارش", key: "OrderCode" },
    { displayLabel: "تاریخ پیوند", key: "GraftingDate" },
    { displayLabel: "تکنسین", key: "Technician" },
    { displayLabel: "تعداد سینی", key: "TrayNumber" },
    { displayLabel: "تعداد حفره", key: "CellPerTrayNumber" },
    { displayLabel: "بستر کشت", key: "PlantingBed" },
    { displayLabel: "گیره", key: "GraftingClamp" },
    { displayLabel: "تعداد کارگر", key: "WorkerCount" },
];
