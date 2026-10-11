import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma";

// CLI entry points create their own client; the application singleton is server-only.
const prisma = new PrismaClient();

async function main() {
  // 1) خواندن env
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const role = 1;
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const isActive = true;

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME و ADMIN_PASSWORD باید در .env تنظیم شوند.");
  }

  // 2) ساخت hash امن
  const passwordHash = await bcrypt.hash(password, 12);

  // 3) upsert برای idempotency
  const admin = await prisma.users.upsert({
    where: { Username: username }, // نیازمند @unique روی Username
    update: {
      PasswordHash: passwordHash, // اگر خواستی فقط وقتی تغییر کند که عوض شده
      Email: email,
      RoleID: role,
      IsActive: isActive,
    },
    create: {
      Username: username,
      PasswordHash: passwordHash,
      Email: email,
      RoleID: role,
      IsActive: isActive,
      CreatedAt: new Date(),
      // CreatedAt و UpdatedAt اتوماتیک هستند اگر در schema تعریف کردی
    },
  });

  console.log("✅ Admin ensured:", {
    Username: admin.Username,
    RoleID: admin.RoleID,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
