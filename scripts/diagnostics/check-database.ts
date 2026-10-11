import "dotenv/config";
import { PrismaClient } from "../../app/generated/prisma";

// Manual, read-only diagnostic. Never run as part of tests or CI.
const prisma = new PrismaClient();
try {
  const [varieties, suppliers] = await Promise.all([
    prisma.tbl_PlantVariety.count(),
    prisma.tbl_Suppliers.count(),
  ]);
  console.log({ varieties, suppliers });
} finally {
  await prisma.$disconnect();
}
