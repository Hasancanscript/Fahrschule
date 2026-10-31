import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { GIFT_SETTINGS, giftText, giftTotal, methodLabel, money, orderSchema, validGiftAmount } from "@/lib/gift-shared";
import { sendInquiry } from "@/lib/mail";
import { guardRequest } from "@/lib/request-guard";

// Gutschein-Bestellung: wird per E-Mail an die Fahrschule geschickt. Bezahlung und Gutschein
// erledigt der Fahrlehrer danach persönlich (bar oder TWINT).
export async function POST(request: Request) {
  const blocked = guardRequest(request, "gutschein");
  if (blocked) return blocked;

  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "fields" }, { status: 400 });
  const order = parsed.data;
  if (order.website) return NextResponse.json({ ok: true, number: "G-0000" });
  // Beträge und Summe auf dem Server nachrechnen, nicht dem Browser vertrauen
  if (!order.items.every((item) => validGiftAmount(item.amountCents, GIFT_SETTINGS)) || giftTotal(order.items) !== order.totalCents) {
    return NextResponse.json({ error: "fields" }, { status: 400 });
  }

  // Bestellnummer zum Nachfragen, z. B. G-261031-4821
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" }).slice(2).replaceAll("-", "");
  const number = `G-${today}-${randomInt(1000, 10000)}`;
  const name = `${order.firstName} ${order.lastName}`;
  const items = order.items.map((item, i) => `${i + 1}. ${item.recipient}: ${money(item.amountCents)}${item.message ? `\n   Nachricht: ${item.message}` : ""}`);

  const toSchool = [
    `Neue Gutschein-Bestellung über die Website (${number})`,
    "",
    `Name: ${name}`,
    `Telefon: ${order.phone}`,
    `E-Mail: ${order.email}`,
    `Sprache: ${order.lang === "fr" ? "Französisch" : "Deutsch"}`,
    `Gewünschte Bezahlung: ${methodLabel(order.method, "de")}`,
    "",
    "Gutscheine:",
    ...items,
    "",
    `Gesamtbetrag: ${money(order.totalCents)}`,
    "",
    "Bitte mit der Kundin / dem Kunden Kontakt aufnehmen, um Bezahlung und Übergabe der Gutscheine abzumachen.",
  ].join("\n");

  const t = (de: string, fr: string) => giftText(order.lang, de, fr);
  const toCustomer = [
    t(`Hallo ${order.firstName}`, `Bonjour ${order.firstName},`),
    "",
    t(
      `Danke für deine Gutschein-Bestellung (${number}). Wir melden uns bei dir, um die Bezahlung (${methodLabel(order.method, "de")}) und die Übergabe abzumachen. Jetzt wird kein Geld abgebucht.`,
      `Merci pour ta commande de bons (${number}). Nous te contacterons pour convenir du paiement (${methodLabel(order.method, "fr")}) et de la remise des bons. Aucun montant n’est débité maintenant.`,
    ),
    "",
    t("Deine Bestellung:", "Ta commande :"),
    ...order.items.map((item, i) => `${i + 1}. ${item.recipient}: ${money(item.amountCents)}`),
    `${t("Gesamtbetrag", "Montant total")}: ${money(order.totalCents)}`,
    "",
    t("Bei Fragen: 078 777 81 61 (auch per WhatsApp).", "Pour toute question : 078 777 81 61 (aussi par WhatsApp)."),
    "",
    "Fahrschule fürs Leben",
  ].join("\n");

  try {
    await sendInquiry(
      { subject: `Gutschein-Bestellung ${number}: ${name}, ${money(order.totalCents)}`, text: toSchool, replyTo: order.email },
      { to: order.email, subject: t(`Deine Gutschein-Bestellung ${number}`, `Ta commande de bons ${number}`), text: toCustomer },
    );
  } catch (error) {
    console.error("Gutschein-Bestellung konnte nicht gesendet werden:", error);
    return NextResponse.json({ error: "send" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, number });
}
