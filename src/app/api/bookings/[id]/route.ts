import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cancelInvoice } from "@/lib/invoices";
import { notifyCustomer } from "@/lib/customer-notifications";
import { auth } from "@/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  }

  const { id } = await params;
  const { status } = (await request.json().catch(() => ({})) ?? {}) as { status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" };

  if (!["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) return NextResponse.json({ error: "Ungültiger Buchungsstatus." }, { status: 400 });
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const current = await tx.booking.findUniqueOrThrow({ where: { id } });
      if (current.status === "CANCELLED" && status !== "CANCELLED") throw new Error("Eine stornierte Buchung kann nicht erneut aktiviert werden.");
      const changed = await tx.booking.updateMany({ where: { id, status: current.status }, data: { status } });
      if (changed.count !== 1) throw new Error("Diese Buchung wurde inzwischen geändert. Bitte erneut laden.");
      if (status === "CANCELLED" && current.status !== "CANCELLED") {
        await tx.slot.update({ where: { id: current.slotId }, data: { isBooked: false } });
        if (current.userPackageId) await tx.userPackage.update({ where: { id: current.userPackageId }, data: { lessonsRemaining: { increment: 1 } } });
        await cancelInvoice(tx, "BOOKING", id);
      }
      const updated = await tx.booking.findUniqueOrThrow({ where: { id }, include: { service: true, slot: true, user: { select: { id: true, name: true, email: true, phone: true } } } });
      if (current.status !== status) await notifyCustomer(tx, { userId: current.userId, kind: "BOOKING_" + status, title: updated.service.name, view: "bookings", detail: { startTime: updated.slot.startTime.toISOString(), creditReturned: status === "CANCELLED" && !!current.userPackageId } });
      return updated;
    });
    return NextResponse.json(booking);
  } catch (error) { return NextResponse.json({ error: error instanceof Error && !('code' in error) ? error.message : "Die Buchung konnte nicht geändert werden." }, { status: 409 }); }

}
