export const handlePrismaDeleteError = (error: any): { success: false; error: string } => {
    // Check for Foreign Key Constraint Violation (P2003)
    if (error.code === 'P2003') {
        const fieldName = error.meta?.field_name;
        // Basic extraction of table name if possible, though P2003 usually gives the field name
        // We can try to map commonly known relation names or fields to their Persian equivalents.

        // A more robust way given Prisma's P2003 message often looks like:
        // "Foreign key constraint failed on the field: `...`"

        // Let's create a map of Table Names or Relation Names to Persian
        // Note: Prisma error meta might return the *field* that caused the issue (e.g., 'GraftingID') 
        // or the table name depending on the database connector. 
        // For SQL Server, it might be slightly different, but let's try to map common reference fields.

        let relatedEntity = "رکورد دیگری";

        if (error.meta?.modelName) {
            const modelMap: Record<string, string> = {
                'Greenhouses': 'گلخانه‌ها',
                'PlantGrowthStages': 'مراحل رشد',
                'Plantings': 'کشت‌ها',
                'Zones': 'ناحیه‌ها',
                'Owner_Observer': 'مالکان/ناظران',
                'PlantingGrowthDaily': 'رشد روزانه',
                'Plants': 'گیاهان',
                'PlantVarities': 'ارقام',
                'ClimateDaily': 'آب و هوا',
                'IrrigationEvent': 'رویداد آبیاری',
                'IrrigationRecords': 'سوابق آبیاری',
                'PlantingSamples': 'نمونه‌های کشت',
                'Suppliers': 'تامین کنندگان',
                'NurseryRoom': 'اتاق نشاء',
                'SeedBatch': 'بچ بذر',
                'SeedPackage': 'بسته بذر',
                'Warehouses': 'انبارها',
                'WarehousesTransactions': 'تراکنش انبار',
                'GraftedPlant': 'گیاه پیوند زده',
                'GraftingOperation': 'عملیات پیوند',
                'LocationInNursaryRoom': 'موقعیت',
                'NurseryCareLog': 'لاگ مراقبت',
                'NurserySeed': 'نشاء',
                'RootStockPlant': 'نایه',
            };
            if (modelMap[error.meta.modelName]) {
                relatedEntity = modelMap[error.meta.modelName];
            }
        } else {
            // Fallback: check the error message string for clues if modelName isn't in meta
            const msg = error.message || "";
            if (msg.includes("GraftingOperation")) relatedEntity = "عملیات پیوند";
            else if (msg.includes("NurserySeed")) relatedEntity = "نشاء";
            else if (msg.includes("RootStockPlant")) relatedEntity = "پایه";
            else if (msg.includes("Plantings")) relatedEntity = "کشت‌ها";
            else if (msg.includes("SeedPackage")) relatedEntity = "بسته بذر";
            else if (msg.includes("SeedBatch")) relatedEntity = "بچ بذر";
            else if (msg.includes("PlantVarities")) relatedEntity = "ارقام";
            else if (msg.includes("Warehouses")) relatedEntity = "انبارها";
        }

        return {
            success: false,
            error: `این مورد در "${relatedEntity}" استفاده شده است و قابل حذف نیست.`
        };
    }

    // Default generic error
    return {
        success: false,
        error: "خطا در حذف اطلاعات. لطفاً دوباره تلاش کنید."
    };
};
