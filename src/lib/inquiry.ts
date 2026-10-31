import { z } from "zod";

// Anfrage für Fahrstunde, 5er-Abo, VKU oder Nothelferkurs.

export const INQUIRY_OFFERS = ["single", "pack5", "vku", "firstaid"] as const;
export type InquiryOffer = (typeof INQUIRY_OFFERS)[number];

export const OFFER_LABELS: Record<InquiryOffer, { de: string; fr: string }> = {
  single: { de: "Fahrstunde", fr: "Leçon de conduite" },
  pack5: { de: "5er-Abo", fr: "Abo 5 leçons" },
  vku: { de: "VKU (Verkehrskundeunterricht)", fr: "ECR (cours de théorie de la circulation)" },
  firstaid: { de: "Nothelferkurs", fr: "Cours de premiers secours" },
};

export function isInquiryOffer(value: unknown): value is InquiryOffer {
  return typeof value === "string" && (INQUIRY_OFFERS as readonly string[]).includes(value);
}

// Keine Steuerzeichen in einzeiligen Feldern (verhindert u. a. eingeschleuste E-Mail-Kopfzeilen)
const line = (max: number) => z.string().trim().max(max).regex(/^[^\u0000-\u001f\u007f]*$/);

export const inquirySchema = z.object({
  offer: z.enum(INQUIRY_OFFERS),
  name: line(100).min(2),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: line(40).min(7).regex(/^[+()\d\s.-]+$/),
  preferredTimes: z.string().trim().max(1000),
  learnerPermit: z.enum(["yes", "no", "unknown"]).optional(),
  message: z.string().trim().max(2000),
  lang: z.enum(["de", "fr"]),
  accepted: z.literal(true),
  // Für Menschen unsichtbares Feld: ist es ausgefüllt, war es ein Spam-Programm
  website: z.string().max(200).optional(),
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export function inquiryText(input: InquiryInput) {
  const permit = { yes: "Ja", no: "Nein", unknown: "Weiss nicht" }[input.learnerPermit ?? "unknown"];
  return [
    `Neue Anfrage über die Website: ${OFFER_LABELS[input.offer].de}`,
    "",
    `Name: ${input.name}`,
    `Telefon: ${input.phone}`,
    `E-Mail: ${input.email}`,
    `Sprache: ${input.lang === "fr" ? "Französisch" : "Deutsch"}`,
    ...(input.offer === "single" || input.offer === "pack5" ? [`Lernfahrausweis vorhanden: ${permit}`] : []),
    "",
    "Wunschtermine:",
    input.preferredTimes || "(keine Angabe)",
    "",
    "Nachricht:",
    input.message || "(keine)",
    "",
    "Bitte direkt mit der Kundin / dem Kunden Kontakt aufnehmen. Auf diese E-Mail antworten geht direkt an die Kundin / den Kunden.",
  ].join("\n");
}

export function inquiryCopyText(input: InquiryInput) {
  const fr = input.lang === "fr";
  const offer = OFFER_LABELS[input.offer][fr ? "fr" : "de"];
  return fr
    ? [
        `Bonjour ${input.name},`,
        "",
        `Merci pour ta demande (${offer}). Nous te contactons dès que possible pour convenir d’un rendez-vous.`,
        "",
        "Tes dates souhaitées :",
        input.preferredTimes || "(aucune indication)",
        "",
        "Pour toute question : 078 777 81 61 (aussi par WhatsApp).",
        "",
        "Fahrschule fürs Leben",
      ].join("\n")
    : [
        `Hallo ${input.name}`,
        "",
        `Danke für deine Anfrage (${offer}). Wir melden uns so schnell wie möglich, um mit dir einen Termin abzumachen.`,
        "",
        "Deine Wunschtermine:",
        input.preferredTimes || "(keine Angabe)",
        "",
        "Bei Fragen: 078 777 81 61 (auch per WhatsApp).",
        "",
        "Fahrschule fürs Leben",
      ].join("\n");
}
