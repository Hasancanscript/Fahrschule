import { NextResponse } from "next/server";
import { giftAccess } from "@/lib/gift-server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createGiftPdf } from "@/lib/gift-pdf";
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const order = await giftAccess((await context.params).id);
  if (!order)
    return NextResponse.json(
      { error: "Bestellung nicht verfügbar." },
      { status: 404 },
    );
  if (order.status !== "PAID")
    return NextResponse.json(
      { error: "Gutscheine werden erst nach bestätigter Zahlung ausgestellt." },
      { status: 403 },
    );
  const id = new URL(request.url).searchParams.get("voucher");
  const vouchers = id
    ? order.vouchers.filter((v) => v.id === id)
    : order.vouchers;
  if (!vouchers.length)
    return NextResponse.json(
      { error: "Gutschein nicht gefunden." },
      { status: 404 },
    );
  const pdf = await createGiftPdf(vouchers, order.lang);
  await prisma.giftEvent.create({
    data: {
      orderId: order.id,
      actorId: (await auth())?.user.id ?? null,
      kind: "PDF_DOWNLOADED",
      detail: { voucherIds: vouchers.map((v) => v.id) },
    },
  });
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Gutschein-${order.number}${id ? `-${id}` : ""}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
