import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cancelInvoice } from "@/lib/invoices";
import { notifyCustomer } from "@/lib/customer-notifications";
import { auth } from "@/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.courseBooking.findUnique({ where: { id } });

  if (!booking || (booking.userId !== session.user.id && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Buchung nicht gefunden." }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    const changed = await tx.courseBooking.updateMany({ where: { id, status: { not: "CANCELLED" } }, data: { status: "CANCELLED" } });
    if (changed.count && session.user.role === "ADMIN") {
      const course = await tx.courseDate.findUniqueOrThrow({ where: { id: booking.courseDateId } });
      await notifyCustomer(tx, { userId: booking.userId, kind: "BOOKING_CANCELLED", title: course.type === "VKU" ? "VKU-Kurs" : "Nothelferkurs", view: "bookings", detail: { startTime: course.startTime.toISOString() } });
    }
    await cancelInvoice(tx, "COURSE", id);
  });

  return NextResponse.json({ ok: true });
}
