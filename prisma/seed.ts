import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const initialPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!initialPassword || initialPassword.length < 12 || Buffer.byteLength(initialPassword, "utf8") > 72) {
    throw new Error("Setze SEED_ADMIN_PASSWORD auf ein individuelles Passwort mit mindestens 12 Zeichen und höchstens 72 Bytes. Bestehende Passwörter werden durch den Seed nicht verändert.");
  }
  const adminPassword = await bcrypt.hash(initialPassword, 12);

  await prisma.user.upsert({
    where: { email: "admin@fahrschulefuersleben.ch" },
    update: {},
    create: {
      name: "Hüseyin",
      email: "admin@fahrschulefuersleben.ch",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const services = [
    {
      name: "Fahrstunde",
      description: "Automatikwagen, flexible Terminwahl, Kat. B / BE.",
      durationMin: 45,
      priceCents: 9200,
    },
    {
      name: "VKU",
      description: "Verkehrskundeunterricht.",
      durationMin: 180,
      priceCents: 17000,
    },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }

  const existingPackage = await prisma.package.findFirst({ where: { name: "5er-Abo" } });
  if (!existingPackage) {
    await prisma.package.create({
      data: { name: "5er-Abo", lessonsTotal: 5, priceCents: 42500 },
    });
  }

  const now = new Date();
  for (let day = 1; day <= 10; day++) {
    for (const hour of [9, 11, 14, 16]) {
      const start = new Date(now);
      start.setDate(start.getDate() + day);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start.getTime() + 45 * 60000);

      const existing = await prisma.slot.findFirst({ where: { startTime: start } });
      if (!existing) {
        await prisma.slot.create({ data: { startTime: start, endTime: end } });
      }
    }
  }

  console.log("Seed abgeschlossen. Admin-Login: admin@fahrschulefuersleben.ch / admin1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
