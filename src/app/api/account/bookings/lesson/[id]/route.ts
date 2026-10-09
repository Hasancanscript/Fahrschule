import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cancelInvoice } from "@/lib/invoices";
import { canChangeLesson } from "@/lib/booking-policy";
import { z } from "zod";
const schema = z.discriminatedUnion("action", [z.object({ action: z.literal("cancel") }), z.object({ action: z.literal("reschedule"), slotId: z.string().min(1) })]);
class BookingChangeError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Bitte melde dich erneut an." }, { status: 401 });
  const { id } = await context.params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Bitte einen freien Termin auswählen." }, { status: 400 });
  const input = parsed.data;
  try {
    await prisma.$transaction(async tx => {
      const now = new Date();
      const booking = await tx.booking.findFirst({ where: { id, userId: session.user.id }, include: { slot: true } });
      if (!booking) throw new BookingChangeError("Buchung nicht gefunden.", 404);
      // A repeated cancellation must not credit the same Abo lesson twice.
      if (input.action === "cancel" && booking.status === "CANCELLED") return;
      if (!canChangeLesson(booking.status, booking.slot.startTime, now.getTime())) throw new BookingChangeError("Stornieren und Umbuchen ist online nur bis 24 Stunden vor Beginn möglich. Bitte kontaktiere die Fahrschule.", 409);
      if (input.action === "reschedule" && input.slotId === booking.slotId) return;
      if (input.action === "reschedule") {
        const reserved = await tx.slot.updateMany({ where: { id: input.slotId, isBooked: false, startTime: { gt: now } }, data: { isBooked: true } });
        if (reserved.count !== 1) throw new BookingChangeError("Dieser neue Termin ist nicht mehr frei. Bitte wähle einen anderen Termin.", 409);
      }
      const changed = await tx.booking.updateMany({ where: { id, userId: session.user.id, status: booking.status, slotId: booking.slotId }, data: input.action === "cancel" ? { status: "CANCELLED" } : { slotId: input.slotId, status: "PENDING" } });
      if (changed.count !== 1) throw new BookingChangeError("Die Buchung wurde inzwischen geändert. Bitte lade die Übersicht erneut.", 409);
      await tx.slot.update({ where: { id: booking.slotId }, data: { isBooked: false } });
      if (input.action === "cancel") {
        if (booking.userPackageId) await tx.userPackage.update({ where: { id: booking.userPackageId }, data: { lessonsRemaining: { increment: 1 } } });
        await cancelInvoice(tx, "BOOKING", booking.id);
      }
      // Rescheduling retains the invoice, payment history and Abo credit; only time and confirmation change.
    }, { isolationLevel: "Serializable" });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof BookingChangeError ? error.message : "Der Termin wurde inzwischen geändert oder konnte nicht gespeichert werden. Bitte lade erneut und prüfe deine Buchung." }, { status: error instanceof BookingChangeError ? error.status : 409 });
  }
}
