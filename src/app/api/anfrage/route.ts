import { NextResponse } from "next/server";
import { inquiryCopyText, inquirySchema, inquiryText, OFFER_LABELS } from "@/lib/inquiry";
import { sendInquiry } from "@/lib/mail";
import { guardRequest } from "@/lib/request-guard";

// Anfrage für Fahrstunde, 5er-Abo, VKU oder Nothelferkurs: wird per E-Mail an die Fahrschule geschickt.
export async function POST(request: Request) {
  const blocked = guardRequest(request, "anfrage");
  if (blocked) return blocked;

  const parsed = inquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "fields" }, { status: 400 });
  const input = parsed.data;
  // Spam-Programm: so tun, als hätte es geklappt
  if (input.website) return NextResponse.json({ ok: true });

  const fr = input.lang === "fr";
  try {
    await sendInquiry(
      { subject: `Anfrage ${OFFER_LABELS[input.offer].de}: ${input.name}`, text: inquiryText(input), replyTo: input.email },
      {
        to: input.email,
        subject: fr ? "Ta demande à la Fahrschule fürs Leben" : "Deine Anfrage bei der Fahrschule fürs Leben",
        text: inquiryCopyText(input),
      },
    );
  } catch (error) {
    console.error("Anfrage konnte nicht gesendet werden:", error);
    return NextResponse.json({ error: "send" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
