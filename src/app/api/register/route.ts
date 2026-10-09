import { NextResponse } from "next/server";
import { takeRateLimit } from "@/lib/security";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!takeRateLimit("register:global", 30, 15 * 60_000)) {
    return NextResponse.json({ error: "Zu viele Registrierungsversuche. Bitte versuche es später erneut." }, { status: 429, headers: { "Retry-After": "900" } });
  }
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 }
    );
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Diese E-Mail-Adresse wird bereits verwendet." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({ data: { name, email, phone, password: hashedPassword } });
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Diese E-Mail-Adresse wird bereits verwendet." }, { status: 409 });
    }
    return NextResponse.json({ error: "Das Konto konnte nicht erstellt werden. Bitte versuche es später erneut." }, { status: 503 });
  }
}
