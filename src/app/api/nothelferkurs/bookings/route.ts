import { checkQuotedPrice, PriceChangedError } from "@/lib/pricing";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/invoices";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const bookings = await prisma.courseBooking.findMany({
    where: { userId: session.user.id, status: { not: "CANCELLED" }, courseDate: { type: "NOTHELFER" } },
    include: { courseDate: true },
    orderBy: { courseDate: { startTime: "asc" } },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const awaitedBody = await request.json().catch(() => ({}));
  if (!awaitedBody || typeof awaitedBody !== "object" || Array.isArray(awaitedBody)) return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  if (typeof awaitedBody.courseDateId !== "string" || !awaitedBody.courseDateId || awaitedBody.courseDateId.length > 100) return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  const { courseDateId } = awaitedBody as { courseDateId?: string };
  if (!courseDateId) {
    return NextResponse.json({ error: "Bitte einen Kurstermin auswählen." }, { status: 400 });
  }

  const courseDate = await prisma.courseDate.findUnique({
    where: { id: courseDateId },
    include: { bookings: { where: { status: { not: "CANCELLED" } } } },
  });

  if (!courseDate || courseDate.type !== "NOTHELFER" || courseDate.startTime < new Date()) {
    return NextResponse.json({ error: "Dieser Kurstermin ist nicht mehr verfügbar." }, { status: 409 });
  }

  if (courseDate.bookings.some((b) => b.userId === session.user.id)) {
    return NextResponse.json({ error: "Du bist für diesen Termin bereits angemeldet." }, { status: 409 });
  }

  if (courseDate.bookings.length >= courseDate.capacity) {
    return NextResponse.json({ error: "Dieser Kurs ist leider ausgebucht." }, { status: 409 });
  }

  try {
  const booking = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: session.user.id } });
    const offer = await tx.service.findUnique({ where: { publicKey: "firstaid" } });
    checkQuotedPrice(awaitedBody.expectedPriceCents, offer);
    const created = await tx.courseBooking.create({ data: { userId: user.id, courseDateId }, include: { courseDate: true } });
    await createInvoice(tx, "COURSE", created.id, "Nothelferkurs", user, offer);
    return created;
  });

  return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof PriceChangedError) return NextResponse.json({ error: error.message }, { status: 409 });
    throw error;
  }
}
