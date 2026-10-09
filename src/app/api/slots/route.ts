import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const slots = await prisma.slot.findMany({
    where: { isBooked: false, startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
  });
  return NextResponse.json(slots);
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  const { startTime, endTime } = body as { startTime: string; endTime: string };

  if (!startTime || !endTime) {
    return NextResponse.json({ error: "Start- und Endzeit werden benötigt." }, { status: 400 });
  }

  if (typeof startTime !== "string" || typeof endTime !== "string" || !Number.isFinite(Date.parse(startTime)) || !Number.isFinite(Date.parse(endTime)) || Date.parse(endTime) <= Date.parse(startTime)) {
    return NextResponse.json({ error: "Ungültige Start- oder Endzeit." }, { status: 400 });
  }

  const slot = await prisma.slot.create({
    data: { startTime: new Date(startTime), endTime: new Date(endTime) },
  });

  return NextResponse.json(slot);
}
