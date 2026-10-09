import type { Prisma } from "@/generated/prisma/client";
import { discountedPrice, type PricedOffer } from "@/lib/pricing";

export async function createInvoice(tx: Prisma.TransactionClient, source: string, sourceId: string, description: string, user: { name: string; email: string }, offer: PricedOffer | null) {
  return tx.invoice.create({ data: {
    source, sourceId, description, customerName: user.name, customerEmail: user.email,
    baseCents: offer?.priceCents ?? null, discountPercent: offer?.discountPercent ?? 0,
    amountCents: offer ? discountedPrice(offer) : null,
  } });
}
export async function cancelInvoice(tx: Prisma.TransactionClient, source: string, sourceId: string) {
  await tx.invoice.updateMany({ where: { source, sourceId, cancelledAt: null }, data: { cancelledAt: new Date() } });
}
