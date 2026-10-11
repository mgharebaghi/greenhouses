import "dotenv/config";
import { PrismaClient } from "../../app/generated/prisma";
import { serializeData } from "../../server/db/serialize";

// Manual, read-only diagnostic. Reuse transport conversion instead of copying it.
const prisma = new PrismaClient();
try {
  const rows = await prisma.tbl_Orders.findMany({
    select: { ID: true, OrderCode: true, OrderCount: true, QRCode: true },
    orderBy: { ID: "desc" },
  });
  const orders = serializeData(rows);
  console.log({
    count: orders.length,
    ordersWithQr: orders.filter((order) => order.QRCode).length,
  });
} finally {
  await prisma.$disconnect();
}
