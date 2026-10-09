import { checkQuotedPrice, PriceChangedError } from "@/lib/pricing";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/invoices";
import { auth } from "@/auth";
import { bookingBatchSchema } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";

  const bookings = await prisma.booking.findMany({
    where: isAdmin ? {} : { userId: session.user.id },
    include: {
      service: true,
      slot: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { slot: { startTime: "asc" } },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body) || (body.slotId !== undefined && body.slotIds !== undefined)) return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  const multiple = body.slotIds !== undefined;
  const parsed = bookingBatchSchema.safeParse({ ...body, slotIds: multiple ? body.slotIds : [body.slotId] });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" }, { status: 400 });
  const { serviceId, slotIds, notes, userPackageId } = parsed.data;
  try {
    const bookings = await prisma.$transaction(async tx => {
      const user = await tx.user.findUniqueOrThrow({ where: { id: session.user.id } });
      const service = await tx.service.findUniqueOrThrow({ where: { id: serviceId } });
      // Prepaid lessons use the Abo credit, independent of the current single-lesson price.
      if (!userPackageId) checkQuotedPrice(body.expectedPriceCents, service);
      const now = new Date();
      const slots = await tx.slot.findMany({ where: { id: { in: slotIds } }, orderBy: { startTime: "asc" } });
      if (slots.length !== slotIds.length || slots.some(slot => slot.isBooked || slot.startTime <= now)) throw new Error("Mindestens ein ausgewählter Termin ist nicht mehr verfügbar. Bitte wähle deine Termine erneut.");
      for (let i = 1; i < slots.length; i++) {
        if (slots[i].startTime < slots[i - 1].endTime) throw new Error("Die ausgewählten Termine überschneiden sich. Bitte wähle unterschiedliche Zeiten.");
      }
      const overlap = await tx.booking.findFirst({ where: {
        userId: session.user.id, status: { in: ["PENDING", "CONFIRMED"] },
        OR: slots.map(slot => ({ slot: { startTime: { lt: slot.endTime }, endTime: { gt: slot.startTime } } })),
      }, select: { id: true } });
      if (overlap) throw new Error("Du hast zu dieser Zeit bereits eine Fahrstunde gebucht. Bitte wähle einen anderen Termin.");
      const reserved = await tx.slot.updateMany({ where: { id: { in: slotIds }, isBooked: false, startTime: { gt: now } }, data: { isBooked: true } });
      if (reserved.count !== slotIds.length) throw new Error("Mindestens ein ausgewählter Termin ist inzwischen belegt. Bitte wähle deine Termine erneut.");
      if (userPackageId) {
        const credited = await tx.userPackage.updateMany({ where: { id: userPackageId, userId: session.user.id, lessonsRemaining: { gte: slotIds.length } }, data: { lessonsRemaining: { decrement: slotIds.length } } });
        if (credited.count !== 1) throw new Error("Dein Abo hat nicht genug Guthaben für diese Termine. Bitte wähle weniger Termine oder ein anderes Abo.");
      }
      const created = [];
      for (const slot of slots) {
        const booking = await tx.booking.create({ data: { userId: session.user.id, serviceId, slotId: slot.id, notes, status: "PENDING", userPackageId: userPackageId ?? null }, include: { service: true, slot: true, userPackage: true } });
        if (!userPackageId) await createInvoice(tx, "BOOKING", booking.id, service.name, user, service);
        created.push(booking);
      }
      return created;
    }, { isolationLevel: "Serializable" });
    return NextResponse.json(multiple ? bookings : bookings[0]);
  } catch (error) {
    if (error instanceof PriceChangedError) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json({ error: error instanceof Error && !("code" in error) ? error.message : "Die Termine wurden inzwischen geändert. Bitte prüfe deine Auswahl und versuche es erneut." }, { status: 409 });
  }
}
