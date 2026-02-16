
// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "./app/generated/prisma";
const prisma = new PrismaClient();

// Mock serializeData for the script context
function serializeData(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === "bigint") return obj.toString();
    if (obj instanceof Date) return obj.toISOString();
    if (Buffer.isBuffer(obj)) return `data:image/png;base64,${obj.toString('base64')}`;
    if (Array.isArray(obj)) return obj.map(serializeData);
    if (typeof obj === "object") {
        const newObj: any = {};
        for (const key in obj) {
            newObj[key] = serializeData(obj[key]);
        }
        return newObj;
    }
    return obj;
}

// Copied function to avoid import issues
async function getOrdersForDropdown() {
    const orders = await prisma.tbl_Orders.findMany({
        select: {
            ID: true,
            OrderCode: true,
            OrderCount: true,
            QRCode: true,
            Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage: { select: { ID: true, Tbl_plantVariety: { select: { ID: true, VarietyName: true } } } },
            Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage: { select: { ID: true, Tbl_plantVariety: { select: { ID: true, VarietyName: true } } } },
        },
        orderBy: { ID: "desc" },
    });
    return serializeData(orders);
}

async function main() {
    console.log("Fetching orders...");
    const orders = await getOrdersForDropdown();
    console.log("Fetched orders:", orders.length);
    if (orders.length > 0) {
        console.log("First order QR Code:", orders[0].QRCode);
        console.log("First order Code:", orders[0].OrderCode);
        // Check if any order has a QR Code
        const orderWithQR = orders.find((o: any) => o.QRCode);
        if (orderWithQR) {
            console.log("Found order with QR Code:", orderWithQR.OrderCode);
            console.log("QR Code snippet:", typeof orderWithQR.QRCode === 'string' ? orderWithQR.QRCode.substring(0, 50) : orderWithQR.QRCode);
        } else {
            console.log("No orders found with QR Code.");
        }
    }
}

main().catch(console.error);
