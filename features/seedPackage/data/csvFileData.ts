export const headers = [
    { displayLabel: "شناسه", key: "ID" },
    { displayLabel: "شماره سریال", key: "SerialNumber" },
    { displayLabel: "تولیدکننده", key: "ProducerName" },
    { displayLabel: "گونه", key: "VarietyName" },
    { displayLabel: "نوع بسته", key: "PackageType" },
    { displayLabel: "تعداد بذر", key: "SeedCount" },
    { displayLabel: "وزن (گرم)", key: "WeightGram" },
    { displayLabel: "تاریخ تولید", key: "ProductionDate" },
    { displayLabel: "تاریخ انقضا", key: "ExpirationDate" },
    { displayLabel: "شرایط نگهداری", key: "StorageConditions" },
];

export async function seedPackageCSVData(source: any[]): Promise<any[]> {
    return source.map((item) => ({
        ...item,
        ProductionDate: item.ProductionDate ? new Date(item.ProductionDate).toLocaleDateString("fa-IR") : "",
        ExpirationDate: item.ExpirationDate ? new Date(item.ExpirationDate).toLocaleDateString("fa-IR") : "",
    }));
}
