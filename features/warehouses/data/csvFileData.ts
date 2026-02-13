export const headers = [
    { displayLabel: "شناسه", key: "ID" },
    { displayLabel: "کد انبار", key: "WarehouseCode" },
    { displayLabel: "نام انبار", key: "WarehouseName" },
    { displayLabel: "موقعیت", key: "WarehouseLocation" },
    { displayLabel: "ظرفیت", key: "Capacity" },
    { displayLabel: "محدوده دما", key: "TemperatureRange" },
    { displayLabel: "تاریخ تاسیس", key: "WarehouseCreatedAtFormatted" },
    { displayLabel: "مسئول انبار", key: "WarehouseManagerName" },
    { displayLabel: "توضیحات", key: "Description" },
];

export async function warehousesCSVData(source: any[]): Promise<any[]> {
    return source.map((item) => ({
        ...item,
        WarehouseCreatedAtFormatted: item.WarehouseCreatedAt
            ? new Date(item.WarehouseCreatedAt).toLocaleDateString("fa-IR")
            : "",
    }));
}
