import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { prisma } from "./prisma";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const hashGift = (text: string) =>
  createHash("sha256").update(text).digest("hex");
export function giftToken(requestId: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET muss konfiguriert sein.");
  return createHmac("sha256", secret)
    .update(`gift-order:${requestId}`)
    .digest("hex");
}
export { giftCode, giftNumber } from "./gift-identifiers";
export async function giftAccess(id: string) {
  const order = await prisma.giftOrder.findUnique({
    where: { id },
    include: {
      vouchers: { include: { redemptions: true } },
      events: { orderBy: { createdAt: "asc" } },
      mails: true,
    },
  });
  if (!order) return null;
  const session = await auth();
  if (
    session?.user.role === "ADMIN" ||
    (order.userId && session?.user.id === order.userId)
  )
    return order;
  const token = (await cookies()).get(`gift-order-${id}`)?.value;
  if (!token) return null;
  const actual = Buffer.from(hashGift(token)),
    expected = Buffer.from(order.accessHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected)
    ? order
    : null;
}
export function giftError(error: unknown) {
  return NextResponse.json(
    {
      error:
        error instanceof Error && !("code" in error)
          ? error.message
          : "Speichern nicht möglich. Bitte erneut laden und versuchen.",
    },
    { status: 400 },
  );
}
export async function giftSettings() {
  return (
    (await prisma.giftSettings.findUnique({ where: { id: "default" } })) ?? {
      minCents: 5000,
      maxCents: 100000,
    }
  );
}
