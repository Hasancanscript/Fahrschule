import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { giftAccess } from "@/lib/gift-server";
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const o = await giftAccess((await context.params).id);
  if (!o)
    return NextResponse.json(
      { error: "Bestellung nicht verfügbar." },
      { status: 404 },
    );
  const session = await auth();
  return NextResponse.json({
    inAccount: Boolean(o.userId && o.userId === session?.user?.id),
    id: o.id,
    number: o.number,
    firstName: o.firstName,
    lastName: o.lastName,
    email: o.email,
    phone: o.phone,
    totalCents: o.totalCents,
    status: o.status,
    requestedMethod: o.requestedMethod,
    vouchers: o.vouchers.map((v) => ({
      id: v.id,
      amountCents: v.amountCents,
      recipient: v.recipient,
      message: v.message,
    })),
  });
}
