import { prisma } from "@/lib/prisma";
import { invoiceBalance } from "@/lib/billing";
import type { Invoice, InvoicePayment } from "@/generated/prisma/client";
import type { CustomerAccount, CustomerBooking, CustomerPayment } from "@/lib/customer";
type PaymentInvoice = Invoice & { payments: InvoicePayment[] };
function paymentSummary(invoice: PaymentInvoice | undefined, included = false): CustomerPayment {
  if (included) return { totalCents: 0, paidCents: 0, remainingCents: 0, status: "Im Abo enthalten" };
  if (!invoice) return { totalCents: null, paidCents: 0, remainingCents: null, status: "Preis noch nicht erfasst" };
  const balance = invoiceBalance({ ...invoice, createdAt: invoice.createdAt.toISOString(), paidAt: invoice.paidAt?.toISOString() ?? null, refundedAt: invoice.refundedAt?.toISOString() ?? null, cancelledAt: invoice.cancelledAt?.toISOString() ?? null, payments: invoice.payments.map(p => ({ ...p, occurredAt: p.occurredAt.toISOString() })) });
  return { totalCents: invoice.amountCents, paidCents: balance.paid, remainingCents: balance.remaining, status: balance.status };
}
// Only records linked to this authenticated user are loaded; never match by a supplied email.
export async function loadCustomerAccount(userId: string): Promise<CustomerAccount | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, phone: true } });
  if (!user) return null;
  const [lessons, courses, packages] = await Promise.all([
    prisma.booking.findMany({ where: { userId }, include: { service: true, slot: true, userPackage: { include: { package: true } } } }),
    prisma.courseBooking.findMany({ where: { userId }, include: { courseDate: true } }),
    prisma.userPackage.findMany({ where: { userId }, include: { package: true }, orderBy: { purchasedAt: "desc" } }),
  ]);
  const invoices = await prisma.invoice.findMany({ where: { OR: [
    { source: "BOOKING", sourceId: { in: lessons.map(b => b.id) } },
    { source: "COURSE", sourceId: { in: courses.map(b => b.id) } },
    { source: "PACKAGE", sourceId: { in: packages.map(p => p.id) } },
  ] }, include: { payments: true } });
  const invoiceMap = new Map(invoices.map(i => [`${i.source}:${i.sourceId}`, i]));
  const bookings: CustomerBooking[] = [
    ...lessons.map(b => ({ id: b.id, kind: "lesson" as const, title: b.service.name, status: b.status, startTime: b.slot.startTime.toISOString(), endTime: b.slot.endTime.toISOString(), location: null, notes: b.notes, packageName: b.userPackage?.package.name ?? null, userPackageId: b.userPackageId, packageRemaining: b.userPackage?.lessonsRemaining ?? null, payment: paymentSummary(invoiceMap.get(`BOOKING:${b.id}`), !!b.userPackageId) })),
    ...courses.map(b => ({ id: b.id, kind: "course" as const, title: b.courseDate.type === "VKU" ? "VKU" : "Nothelferkurs", status: b.status, startTime: b.courseDate.startTime.toISOString(), endTime: b.courseDate.endTime.toISOString(), location: b.courseDate.location, notes: null, packageName: null, payment: paymentSummary(invoiceMap.get(`COURSE:${b.id}`)) })),
  ].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  return { user, bookings, packages: packages.map(p => ({ id: p.id, name: p.package.name, lessonsTotal: p.package.lessonsTotal, lessonsRemaining: p.lessonsRemaining, purchasedAt: p.purchasedAt.toISOString(), payment: paymentSummary(invoiceMap.get(`PACKAGE:${p.id}`)) })) };
}
