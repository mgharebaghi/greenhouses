const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
    try {
        const varietiesCount = await prisma.plantVarities.count();
        const suppliersCount = await prisma.suppliers.count();
        console.log(`Varieties Count: ${varietiesCount}`);
        console.log(`Suppliers Count: ${suppliersCount}`);

        // Attempt the actual queries to see if they throw
        console.log("Testing specific queries...");
        await prisma.plantVarities.findMany({ select: { VarietyID: true, VarietyName: true } });
        console.log("PlantVarities query successful");

        await prisma.suppliers.findMany({ select: { ID: true, FirstName: true, LastName: true, CompanyName: true } });
        console.log("Suppliers query successful");

    } catch (error) {
        console.error("Error connecting or querying:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCounts();
