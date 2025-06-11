import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  const firstAdminEmail = "tosunoglukerim@gmail.com";
  await prisma.user.upsert({
    where: { email: firstAdminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "Kerim Tosunoglu",
      email: firstAdminEmail,
      password: await bcrypt.hash("Kerim123", 10),
      role: "ADMIN",
    },
  });

  await prisma.service.createMany({
    data: [
      { name: "Saç Kesimi", price: 150 },
      { name: "Sakal Tıraşı", price: 100 },
      { name: "Saç Boyama", price: 200 },
    ]
  });

  const now = new Date();
  await prisma.timeSlot.createMany({
    data: [
      { start: new Date(now.getTime() + 3600 * 1000), end: new Date(now.getTime() + 2 * 3600 * 1000) },
      { start: new Date(now.getTime() + 3 * 3600 * 1000), end: new Date(now.getTime() + 4 * 3600 * 1000) },
    ]
  });

  // Her zaman admin olarak güncelle
  await prisma.user.updateMany({ where: { email: "tosunoglukerim@gmail.com" }, data: { role: "ADMIN" } });

  console.log("Seed tamamlandı!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect()); 