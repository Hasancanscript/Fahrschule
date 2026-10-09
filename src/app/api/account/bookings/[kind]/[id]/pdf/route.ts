import { auth } from "@/auth";
import { loadCustomerAccount } from "@/lib/customer-data";
import { createBookingPdf } from "@/lib/booking-pdf";

export async function GET(_request: Request, context: { params: Promise<{ kind: string; id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Bitte melde dich erneut an." }, { status: 401 });
  const { kind, id } = await context.params;
  if (kind !== "lesson" && kind !== "course") return Response.json({ error: "Buchung nicht gefunden." }, { status: 404 });
  const account = await loadCustomerAccount(session.user.id);
  const booking = account?.bookings.find(b => b.id === id && b.kind === kind);
  if (!account || !booking) return Response.json({ error: "Buchung nicht gefunden." }, { status: 404 });
  const lang = new URL(_request.url).searchParams.get("lang") === "fr" ? "fr" : "de";
  const pdf = await createBookingPdf(account.user, booking, lang);
  const filename = `Buchung-${kind}-${booking.startTime.slice(0, 10)}-${id.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 50)}.pdf`;
  return new Response(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${filename}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

