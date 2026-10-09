import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const session = await auth();
  const headers = { "Cache-Control": "private, no-store" };
  if (!session?.user?.id) return Response.json({ error: "Bitte melde dich erneut an." }, { status: 401, headers });
  const orders = await prisma.giftOrder.findMany({
    where: { userId: session.user.id },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true, number: true, createdAt: true, status: true, totalCents: true,
      vouchers: { select: { id: true, recipient: true, message: true, amountCents: true, remainingCents: true, status: true, code: true } },
    },
  });
  return Response.json(orders.map(order => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    vouchers: order.vouchers.map(voucher => ({ ...voucher, code: order.status === "PAID" ? voucher.code : null })),
  })), { headers });
}
