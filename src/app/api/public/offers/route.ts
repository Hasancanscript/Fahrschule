import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPrice } from "@/lib/pricing";
export async function GET() {
  const [services, packages] = await Promise.all([
    prisma.service.findMany({ where: { publicKey: { not: null } } }),
    prisma.package.findMany({ where: { publicKey: { not: null } } }),
  ]);
  return NextResponse.json(Object.fromEntries([...services, ...packages].map((offer) => [offer.publicKey, withPrice(offer)])), { headers: { "Cache-Control": "no-store" } });
}
