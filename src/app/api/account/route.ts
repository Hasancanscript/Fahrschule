import { auth } from "@/auth";
import { loadCustomerAccount } from "@/lib/customer-data";
export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Bitte melde dich erneut an." }, { status: 401 });
  const account = await loadCustomerAccount(session.user.id);
  if (!account) return Response.json({ error: "Dein Kundenkonto wurde nicht gefunden." }, { status: 404 });
  return Response.json(account, { headers: { "Cache-Control": "private, no-store" } });
}
