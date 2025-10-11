import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../app/lib/singletone";

async function main() {
  // 1) خواندن env
  const username = "admin";
  const password = "Qwerty@1234";
  const role = 1;
  const email = "admin@example.com";
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

  console.log("✅ Admin ensured:", { Username: admin.Username, RoleID: admin.RoleID });
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
