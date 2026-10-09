import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

async function main() {
  const email = process.env.ADMIN_RESET_EMAIL ?? "admin@fahrschulefuersleben.ch";
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
  if (!user || user.role !== "ADMIN") throw new Error("Das angegebene Admin-Konto wurde nicht gefunden.");
  const password = randomBytes(24).toString("base64url");
  const path = resolve(".admin-zugang.txt");
  // Create the local credential file first: failure cannot lock the administrator out.
  writeFileSync(path, `Admin-Zugang Fahrschule fürs Leben\n\nE-Mail: ${email}\nPasswort: ${password}\n\nBewahre das Passwort in einem Passwortmanager auf. Lösche danach diese Datei.\n`, { flag: "wx", mode: 0o600 });
  await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(password, 12) } });
  console.log(`Admin-Passwort geändert. Die neuen Zugangsdaten stehen ausschliesslich in: ${path}`);
}
main().catch(() => { console.error("Passwortwechsel nicht abgeschlossen. Prüfe das Admin-Konto, die Datenbankverbindung und ob .admin-zugang.txt bereits existiert."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
