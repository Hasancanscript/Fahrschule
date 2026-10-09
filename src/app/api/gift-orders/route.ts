import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { orderSchema, validGiftAmount, giftTotal } from "@/lib/gift-shared";
import {
  giftSettings,
  giftToken,
  hashGift,
  giftCode,
  giftNumber,
  giftError,
} from "@/lib/gift-server";
import { takeRateLimit } from "@/lib/security";
import { sendGiftMails } from "@/lib/gift-mail";
export async function POST(request: Request) {
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 32768)
    return NextResponse.json(
      { error: "Die Anfrage ist zu gross." },
      { status: 413 },
    );
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    body = null;
  }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Bitte Kontaktdaten, Empfänger und Gutscheinangaben prüfen." },
      { status: 400 },
    );
  const input = parsed.data;
  if (
    !takeRateLimit("gift:global", 60, 60000) ||
    !takeRateLimit(`gift:email:${hashGift(input.email)}`, 5, 3600000)
  )
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
      { status: 429 },
    );
  try {
    const settings = await giftSettings();
    if (
      !input.items.every((i) => validGiftAmount(i.amountCents, settings)) ||
      giftTotal(input.items) !== input.totalCents
    )
      throw new Error(
        "Der Gutscheinbetrag hat sich geändert oder ist ungültig. Bitte den Warenkorb prüfen.",
      );
    const requestHash = hashGift(JSON.stringify(input)),
      token = giftToken(input.requestId);
    const session = await auth();
    const make = () =>
      prisma.giftOrder.create({
        data: {
          number: giftNumber(),
          requestId: input.requestId,
          requestHash,
          accessHash: hashGift(token),
          userId: session?.user.id ?? null,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          lang: input.lang,
          totalCents: giftTotal(input.items),
          requestedMethod: input.method,
          vouchers: {
            create: input.items.map((i) => ({ ...i, code: giftCode() })),
          },
          events: {
            create: {
              kind: "CREATED",
              detail: {
                count: input.items.length,
                totalCents: input.totalCents,
              },
            },
          },
          mails: {
            create: [
              { kind: "CUSTOMER", key: `customer:${input.requestId}` },
              { kind: "ADMIN", key: `admin:${input.requestId}` },
            ],
          },
        },
      });
    let order = await prisma.giftOrder.findUnique({
      where: { requestId: input.requestId },
    });
    if (!order) {
      try {
        order = await make();
      } catch (error) {
        order = await prisma.giftOrder.findUnique({
          where: { requestId: input.requestId },
        });
        if (!order) throw error;
      }
    }
    if (order.requestHash !== requestHash)
      throw new Error(
        "Diese Anfrage wurde bereits mit anderen Angaben gespeichert.",
      );
    const response = NextResponse.json(
      { id: order.id, number: order.number },
      { status: 201 },
    );
    response.cookies.set(`gift-order-${order.id}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: `/api/gift-orders/${order.id}`,
      maxAge: 2592000,
    });
    after(async () => {
      await sendGiftMails(order.id).catch(() => {});
    });
    return response;
  } catch (error) {
    return giftError(error);
  }
}
