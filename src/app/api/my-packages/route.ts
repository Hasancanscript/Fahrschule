import { checkQuotedPrice, PriceChangedError } from "@/lib/pricing";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/invoices";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const userPackages = await prisma.userPackage.findMany({
    where: { userId: session.user.id },
    include: { package: true },
    orderBy: { purchasedAt: "desc" },
  });

  return NextResponse.json(userPackages);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const awaitedBody = await request.json().catch(() => ({}));
  if (!awaitedBody || typeof awaitedBody !== "object" || Array.isArray(awaitedBody)) return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  if (typeof awaitedBody.packageId !== "string" || !awaitedBody.packageId || awaitedBody.packageId.length > 100) return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  const { packageId } = awaitedBody as { packageId: string };

  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) {
    return NextResponse.json({ error: "Paket nicht gefunden." }, { status: 404 });
  }

  try {
  const userPackage = await prisma.$transaction(async (tx) => {
    const current = await tx.package.findUniqueOrThrow({ where: { id: packageId } });
    checkQuotedPrice(awaitedBody.expectedPriceCents, current);
    const user = await tx.user.findUniqueOrThrow({ where: { id: session.user.id } });
    const created = await tx.userPackage.create({ data: { userId: user.id, packageId: current.id, lessonsRemaining: current.lessonsTotal }, include: { package: true } });
    await createInvoice(tx, "PACKAGE", created.id, current.name, user, current);
    return created;
  });

  return NextResponse.json(userPackage);
  } catch (error) {
    if (error instanceof PriceChangedError) return NextResponse.json({ error: error.message }, { status: 409 });
    throw error;
  }
}
