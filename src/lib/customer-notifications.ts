import type { Prisma } from "@/generated/prisma/client";
export async function notifyCustomer(tx: Prisma.TransactionClient, input: {
 userId: string | null; kind: string; title: string; view: "bookings" | "gifts" | "packages";
 detail: { startTime?: string; number?: string; amountCents?: number; creditReturned?: boolean; remainingCents?: number };
}) {
 if (!input.userId) return;
 await tx.customerNotification.create({ data: { ...input, userId: input.userId } });
}
