import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const headers = { "Cache-Control": "private, no-store" };
export async function GET() {
 const userId = (await auth())?.user?.id;
 if (!userId) return Response.json({ error: "Bitte melde dich erneut an." }, { status: 401, headers });
 const notifications = await prisma.customerNotification.findMany({ where: { userId, readAt: null }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 100 });
 return Response.json(notifications, { headers });
}
const schema = z.object({ ids: z.array(z.string().min(1).max(100)).min(1).max(100) });
export async function PATCH(request: Request) {
 const userId = (await auth())?.user?.id;
 if (!userId) return Response.json({ error: "Bitte melde dich erneut an." }, { status: 401, headers });
 const parsed = schema.safeParse(await request.json().catch(() => null));
 if (!parsed.success) return Response.json({ error: "Bitte Meldungen auswählen." }, { status: 400, headers });
 await prisma.customerNotification.updateMany({ where: { userId, id: { in: parsed.data.ids }, readAt: null }, data: { readAt: new Date() } });
 return Response.json({ ok: true }, { headers });
}
