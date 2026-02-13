export const headers = [
    { displayLabel: "شماره تراکنش", key: "ID" },
    { displayLabel: "نوع", key: "TransactionTypeLabel" },
    { displayLabel: "تعداد بسته", key: "PackageQuantity" },
    { displayLabel: "بسته بذر", key: "SeedPackageSerial" },
    { displayLabel: "انبار", key: "WarehouseName" },
    { displayLabel: "تاریخ", key: "TransactionDateFormatted" },
    { displayLabel: "مقصد/منبع", key: "DestinationType" },
    { displayLabel: "ثبت کننده", key: "RecordedBy" },
];

export async function seedWarehousingCSVData(source: any[]): Promise<any[]> {
    return source.map((item) => ({
        ...item,
        TransactionTypeLabel: item.TransactionType ? "ورودی" : "خروجی",
        SeedPackageSerial: item.Tbl_SeedPackage?.SerialNumber || "",
        WarehouseName: item.Tbl_Warehouses?.WarehouseName || "",
        TransactionDateFormatted: item.TransactionDate
            ? new Date(item.TransactionDate).toLocaleDateString("fa-IR")
            : "",
    }));
}
