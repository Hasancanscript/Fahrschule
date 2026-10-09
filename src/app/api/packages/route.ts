import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { withPrice } from "@/lib/pricing";
const schema = z.object({
  id: z.string().optional(), name: z.string().trim().min(1), description: z.string().trim().optional(),
  lessonsTotal: z.number().int().min(1).max(10000), priceCents: z.number().int().min(1).max(100000000),
  discountPercent: z.number().int().min(0).max(100).default(0),
  publicKey: z.enum(["pack5"]).nullable().optional(),
});
export async function GET() {
  const offers = await prisma.package.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(offers.map(withPrice), { headers: { "Cache-Control": "no-store" } });
}
async function save(request: Request, updating: boolean) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bitte Name, Preis, Rabatt (0 bis 100 %) und Dauer beziehungsweise Anzahl prüfen." }, { status: 400 });
  const { id, ...data } = parsed.data;
  if (updating && !id) return NextResponse.json({ error: "Bitte ein Angebot zum Bearbeiten auswählen." }, { status: 400 });
  try {
    const offer = updating ? await prisma.package.update({ where: { id }, data }) : await prisma.package.create({ data });
    return NextResponse.json(withPrice(offer));
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : null;
    return NextResponse.json({ error: code === "P2002" ? "Für diesen Platz auf der Startseite ist bereits ein Angebot ausgewählt. Entferne zuerst die Zuordnung beim bisherigen Angebot." : "Das Angebot konnte nicht gespeichert werden." }, { status: code === "P2002" ? 409 : 400 });
  }
}
export async function POST(request: Request) { return save(request, false); }
export async function PATCH(request: Request) { return save(request, true); }
