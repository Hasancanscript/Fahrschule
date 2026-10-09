import { NextResponse, after } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { giftError, giftCode, giftSettings } from "@/lib/gift-server";
import { giftMailConfigured, sendGiftMails } from "@/lib/gift-mail";
import { paymentDate, swissDay } from "@/lib/billing";
import { z } from "zod";
export async function GET(request: Request) {
  if ((await auth())?.user.role !== "ADMIN")
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  const query = new URL(request.url).searchParams
    .get("q")
    ?.trim()
    .slice(0, 100);
  const orders = await prisma.giftOrder.findMany({
    where: query
      ? {
          OR: [
            ...["number", "email", "firstName", "lastName", "phone"].map(
              (field) => ({
                [field]: { contains: query, mode: "insensitive" },
              }),
            ),
            {
              vouchers: {
                some: { code: { contains: query, mode: "insensitive" } },
              },
            },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      vouchers: { include: { redemptions: { orderBy: { createdAt: "asc" } } } },
      events: { orderBy: { createdAt: "asc" } },
      mails: true,
    },
  });
  const [open, paid, active, redeemed, paidVouchers, balance, newOrders] =
    await Promise.all([
      prisma.giftOrder.count({ where: { status: "OPEN" } }),
      prisma.giftOrder.aggregate({
        where: { status: "PAID" },
        _sum: { totalCents: true },
      }),
      prisma.giftVoucher.count({ where: { status: "ACTIVE" } }),
      prisma.giftVoucher.count({ where: { status: "REDEEMED" } }),
      prisma.giftVoucher.count({ where: { order: { status: "PAID" } } }),
      prisma.giftVoucher.aggregate({
        where: { status: "ACTIVE" },
        _sum: { remainingCents: true },
      }),
      prisma.giftOrder.count({
        where: {
          status: "OPEN",
          createdAt: { gte: new Date(Date.now() - 7 * 86400000) },
        },
      }),
    ]);
  // Tokens and idempotency keys must never leave the server.
  const safe = orders.map((o) => ({
    id: o.id,
    number: o.number,
    firstName: o.firstName,
    lastName: o.lastName,
    email: o.email,
    phone: o.phone,
    totalCents: o.totalCents,
    status: o.status,
    requestedMethod: o.requestedMethod,
    paidMethod: o.paidMethod,
    paidAt: o.paidAt,
    createdAt: o.createdAt,
    vouchers: o.vouchers,
    events: o.events,
    mails: o.mails.map((m) => ({
      id: m.id,
      kind: m.kind,
      status: m.status,
      attempts: m.attempts,
    })),
  }));
  return NextResponse.json({
    orders: safe,
    stats: {
      newOrders,
      open,
      paidCents: paid._sum.totalCents ?? 0,
      active,
      redeemed,
      paidVouchers,
      balanceCents: balance._sum.remainingCents ?? 0,
    },
    settings: await giftSettings(),
    mailConfigured: giftMailConfigured(),
  });
}
const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("pay"),
    id: z.string().max(100),
    method: z.enum(["CASH", "TWINT"]),
    date: z.string(),
    confirmed: z.literal(true),
  }),
  z.object({
    action: z.literal("cancel"),
    id: z.string().max(100),
    reason: z.string().trim().min(1).max(500),
    refundConfirmed: z.boolean().optional(),
  }),
  z.object({
    action: z.literal("redeem"),
    id: z.string().max(100),
    voucherId: z.string().max(100),
    requestId: z.string().uuid(),
    amountCents: z.number().int().positive().max(1000000),
    reference: z.string().trim().min(1).max(200),
  }),
  z.object({
    action: z.literal("email"),
    id: z.string().max(100),
    requestId: z.string().uuid(),
  }),
  z.object({ action: z.literal("retryMail"), id: z.string().max(100) }),
]);
import { notifyCustomer } from "@/lib/customer-notifications";
export async function PATCH(request: Request) {
  const user = (await auth())?.user;
  if (user?.role !== "ADMIN")
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Bitte Angaben prüfen." },
      { status: 400 },
    );
  const input = parsed.data;
  try {
    await prisma.$transaction(
      async (tx) => {
        const o = await tx.giftOrder.findUniqueOrThrow({
          where: { id: input.id },
          include: { vouchers: true },
        });
        if (input.action === "pay") {
          const date = paymentDate(input.date);
          if (input.date < swissDay(o.createdAt))
            throw new Error(
              "Das Zahlungsdatum darf nicht vor der Bestellung liegen.",
            );
          if (o.status === "PAID") {
            if (
              o.paidAt?.getTime() !== date.getTime() ||
              o.paidMethod !== input.method
            )
              throw new Error(
                "Diese Zahlung wurde bereits mit anderen Angaben bestätigt.",
              );
            return;
          }
          if (o.status !== "OPEN")
            throw new Error(
              "Stornierte Bestellungen können nicht bezahlt werden.",
            );
          await tx.giftOrder.update({
            where: { id: o.id },
            data: { status: "PAID", paidAt: date, paidMethod: input.method },
          });
          await notifyCustomer(tx, { userId: o.userId, kind: "GIFT_PAID", title: "Gutschein", view: "gifts", detail: { number: o.number, amountCents: o.totalCents } });
          for (const v of o.vouchers)
            await tx.giftVoucher.update({
              where: { id: v.id },
              data: {
                status: "ACTIVE",
                remainingCents: v.amountCents,
                activatedAt: new Date(),
                code: giftCode(),
              },
            });
          await tx.giftEvent.create({
            data: {
              orderId: o.id,
              actorId: user.id,
              kind: "PAID",
              detail: {
                date: input.date,
                method: input.method,
                totalCents: o.totalCents,
              },
            },
          });
        } else if (input.action === "cancel") {
          if (o.status === "CANCELLED") return;
          if (
            o.vouchers.some(
              (v) =>
                v.status === "REDEEMED" ||
                (v.status === "ACTIVE" && v.remainingCents !== v.amountCents),
            )
          )
            throw new Error(
              "Bereits eingelöste Gutscheine können nicht storniert werden.",
            );
          if (o.status === "PAID" && !input.refundConfirmed)
            throw new Error(
              "Bitte zuerst die tatsächliche Rückzahlung bestätigen.",
            );
          await tx.giftOrder.update({
            where: { id: o.id },
            data: { status: "CANCELLED", cancelledAt: new Date() },
          });
          await notifyCustomer(tx, { userId: o.userId, kind: "GIFT_CANCELLED", title: "Gutschein", view: "gifts", detail: { number: o.number } });
          await tx.giftVoucher.updateMany({
            where: { orderId: o.id },
            data: { status: "CANCELLED", remainingCents: 0 },
          });
          await tx.giftEvent.create({
            data: {
              orderId: o.id,
              actorId: user.id,
              kind: "CANCELLED",
              detail: {
                reason: input.reason,
                refunded: o.status === "PAID",
                amountCents: o.totalCents,
              },
            },
          });
        } else if (input.action === "redeem") {
          const existing = await tx.giftRedemption.findUnique({
            where: { requestId: input.requestId },
          });
          if (existing) {
            if (
              existing.voucherId !== input.voucherId ||
              existing.amountCents !== input.amountCents ||
              existing.reference !== input.reference
            )
              throw new Error(
                "Diese Einlösung wurde bereits mit anderen Angaben gespeichert.",
              );
            return;
          }
          const v = o.vouchers.find((v) => v.id === input.voucherId);
          if (
            o.status !== "PAID" ||
            !v ||
            v.status !== "ACTIVE" ||
            input.amountCents > v.remainingCents
          )
            throw new Error(
              "Gutschein ist nicht aktiv oder das Guthaben reicht nicht aus.",
            );
          const changed = await tx.giftVoucher.updateMany({
            where: {
              id: v.id,
              remainingCents: v.remainingCents,
              status: "ACTIVE",
            },
            data: {
              remainingCents: { decrement: input.amountCents },
              status:
                input.amountCents === v.remainingCents ? "REDEEMED" : "ACTIVE",
            },
          });
          if (!changed.count)
            throw new Error(
              "Guthaben wurde inzwischen geändert. Bitte erneut laden.",
            );
          await notifyCustomer(tx, { userId: o.userId, kind: "GIFT_REDEEMED", title: "Gutschein", view: "gifts", detail: { number: o.number, amountCents: input.amountCents, remainingCents: v.remainingCents - input.amountCents } });
          await tx.giftRedemption.create({
            data: {
              voucherId: v.id,
              requestId: input.requestId,
              amountCents: input.amountCents,
              reference: input.reference,
              actorId: user.id,
            },
          });
          await tx.giftEvent.create({
            data: {
              orderId: o.id,
              actorId: user.id,
              kind: "REDEEMED",
              detail: {
                voucherId: v.id,
                amountCents: input.amountCents,
                reference: input.reference,
              },
            },
          });
        } else {
          if (!giftMailConfigured())
            throw new Error("Bitte zuerst die SMTP-Konfiguration einrichten.");
          if (input.action === "email") {
            if (o.status !== "PAID")
              throw new Error(
                "Nur bezahlte Gutscheine können versendet werden.",
              );
            await tx.giftMail.upsert({
              where: { key: `vouchers:${input.requestId}` },
              create: {
                orderId: o.id,
                key: `vouchers:${input.requestId}`,
                kind: "VOUCHERS",
              },
              update: {},
            });
          }
          await tx.giftEvent.create({
            data: {
              orderId: o.id,
              actorId: user.id,
              kind: "MAIL_REQUESTED",
              detail: { action: input.action },
            },
          });
        }
      },
      { isolationLevel: "Serializable" },
    );
    if (input.action === "email" || input.action === "retryMail")
      after(async () => {
        await sendGiftMails(input.id).catch(() => {});
      });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return giftError(error);
  }
}
