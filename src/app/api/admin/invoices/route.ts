import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyCustomer } from "@/lib/customer-notifications";
import { auth } from "@/auth";
import { paymentDate, swissDay } from "@/lib/billing";
import { z } from "zod";
const schema = z.object({ id: z.string(), action: z.enum(["amount", "paid", "refund"]), amountCents: z.number().int().min(0).max(100000000), date: z.string().optional(), requestId: z.string().uuid().optional(), paymentMethod: z.enum(["Bar", "TWINT", "Überweisung", "Andere"]).optional() });
export async function GET() {
  if ((await auth())?.user.role !== "ADMIN") return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: "desc" }, include: { payments: { orderBy: { occurredAt: "asc" } } } });
  return NextResponse.json(invoices, { headers: { "Cache-Control": "no-store" } });
}
export async function PATCH(request: Request) {
  if ((await auth())?.user.role !== "ADMIN") return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bitte Betrag und Zahlungsangaben prüfen." }, { status: 400 });
  const input = parsed.data;
  try {
    await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUniqueOrThrow({ where: { id: input.id }, include: { payments: true } });
      const netPaid = invoice.payments.reduce((sum, payment) => sum + (payment.kind === "REFUND" ? -payment.amountCents : payment.amountCents), 0);
      if (input.action === "amount") {
        if (invoice.amountCents !== null && !invoice.id.startsWith("legacy-")) throw new Error("Der Preis dieser neuen Buchung ist bereits fest gespeichert.");
        if (input.amountCents < netPaid) throw new Error("Der Gesamtpreis darf nicht unter dem bereits bezahlten Betrag liegen.");
        // Preserve the original snapshot; correcting a legacy total is separate from taking a payment.
        await tx.invoice.update({ where: { id: invoice.id }, data: { amountCents: input.amountCents } });
        return;
      }
      if (!input.date || !input.paymentMethod || !input.requestId || input.amountCents <= 0) throw new Error("Bitte den tatsächlich bezahlten Betrag, Datum und Zahlungsart angeben.");
      const occurredAt = paymentDate(input.date);
      const kind = input.action === "paid" ? "PAYMENT" : "REFUND";
      const existing = await tx.invoicePayment.findUnique({ where: { requestId: input.requestId } });
      if (existing) {
        if (existing.invoiceId !== invoice.id || existing.kind !== kind || existing.amountCents !== input.amountCents || swissDay(existing.occurredAt) !== input.date || existing.paymentMethod !== input.paymentMethod) throw new Error("Diese Zahlungsanfrage wurde bereits mit anderen Angaben verarbeitet.");
        return;
      }
      if (kind === "PAYMENT") {
        if (invoice.cancelledAt || invoice.amountCents === null) throw new Error("Bitte zuerst den Gesamtpreis erfassen. Stornierte Buchungen können nicht bezahlt werden.");
        if (input.amountCents > invoice.amountCents - netPaid) throw new Error("Der Zahlungsbetrag ist höher als der noch offene Betrag.");
      } else {
        const availableByDate = invoice.payments.filter((p) => swissDay(p.occurredAt) <= input.date!).reduce((sum, p) => sum + (p.kind === "REFUND" ? -p.amountCents : p.amountCents), 0);
        if (input.amountCents > netPaid || input.amountCents > availableByDate) throw new Error("Eine Rückerstattung darf die bis zu diesem Datum erhaltenen Zahlungen nicht übersteigen.");
      }
      await tx.invoicePayment.create({ data: { invoiceId: invoice.id, requestId: input.requestId, kind, amountCents: input.amountCents, occurredAt, paymentMethod: input.paymentMethod } });
      const owner = invoice.source === "BOOKING" ? await tx.booking.findUnique({ where: { id: invoice.sourceId }, select: { userId: true } }) : invoice.source === "COURSE" ? await tx.courseBooking.findUnique({ where: { id: invoice.sourceId }, select: { userId: true } }) : invoice.source === "PACKAGE" ? await tx.userPackage.findUnique({ where: { id: invoice.sourceId }, select: { userId: true } }) : null;
      if (owner) await notifyCustomer(tx, { userId: owner.userId, kind: kind === "PAYMENT" ? "PAYMENT_CONFIRMED" : "PAYMENT_REFUNDED", title: invoice.description, view: invoice.source === "PACKAGE" ? "packages" : "bookings", detail: { amountCents: input.amountCents } });
    }, { isolationLevel: "Serializable" });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error && !("code" in error) ? error.message : "Der Eintrag wurde inzwischen geändert oder konnte nicht gespeichert werden. Bitte erneut laden und prüfen.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
