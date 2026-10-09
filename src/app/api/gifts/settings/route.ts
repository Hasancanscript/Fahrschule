import { NextResponse } from "next/server";
import { giftSettings, giftError } from "@/lib/gift-server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
export async function GET() {
  const s = await giftSettings();
  return NextResponse.json({ minCents: s.minCents, maxCents: s.maxCents });
}
export async function PATCH(request: Request) {
  const user = (await auth())?.user;
  if (user?.role !== "ADMIN")
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  const parsed = z
    .object({
      minCents: z.number().int().min(100).max(1000000),
      maxCents: z.number().int().min(100).max(1000000),
    })
    .refine(
      (s) =>
        s.minCents <= s.maxCents &&
        s.minCents % 5000 === 0 &&
        s.maxCents % 5000 === 0,
    )
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Bitte Mindest- und Höchstbetrag in 50er-Schritten angeben." },
      { status: 400 },
    );
  try {
    await prisma.$transaction([
      prisma.giftSettings.upsert({
        where: { id: "default" },
        create: { id: "default", ...parsed.data },
        update: parsed.data,
      }),
      prisma.giftEvent.create({
        data: { actorId: user.id, kind: "SETTINGS", detail: parsed.data },
      }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return giftError(error);
  }
}
