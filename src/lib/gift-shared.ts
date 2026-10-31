import { z } from "zod";
export const GIFT_IMAGE = "/Fahrschule fürs Leben Gutschein.png";
export const PRESETS = [5000, 10000, 20000];
export const MAX_GIFTS = 30;
export type GiftItem = {
  id: string;
  amountCents: number;
  recipient: string;
  message: string;
};
export type GiftSettings = { minCents: number; maxCents: number };
export const giftText = (lang: string, de: string, fr: string) =>
  lang === "fr" ? fr : de;
export const money = (cents: number) => `CHF ${(cents / 100).toFixed(2)}`;
export const giftTotal = (items: Pick<GiftItem, "amountCents">[]) =>
  items.reduce((sum, item) => sum + item.amountCents, 0);
const name = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[^\u0000-\u001f\u007f]+$/);
export const orderSchema = z.object({
  firstName: name,
  lastName: name,
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(40)
    .regex(/^[+()\d\s.-]+$/),
  lang: z.enum(["de", "fr"]),
  method: z.enum(["CASH", "TWINT"]),
  accepted: z.literal(true),
  totalCents: z.number().int().positive().max(30000000),
  items: z
    .array(
      z.object({
        amountCents: z.number().int().min(100).max(1000000),
        recipient: name,
        message: z.string().trim().max(500),
      }),
    )
    .min(1)
    .max(MAX_GIFTS),
  // Für Menschen unsichtbares Feld gegen Spam-Programme
  website: z.string().max(200).optional(),
});
export type GiftOrderInput = z.infer<typeof orderSchema>;
// Mindest- und Höchstbetrag für den Wunschbetrag
export const GIFT_SETTINGS: GiftSettings = { minCents: 5000, maxCents: 100000 };
export function validGiftAmount(cents: number, settings: GiftSettings) {
  return (
    Number.isSafeInteger(cents) &&
    cents % 5000 === 0 &&
    (PRESETS.includes(cents) ||
      (cents >= settings.minCents && cents <= settings.maxCents))
  );
}
export function restoreCart(raw: string | null): GiftItem[] {
  try {
    const items = JSON.parse(raw || "[]");
    if (!Array.isArray(items)) return [];
    return items
      .slice(0, MAX_GIFTS)
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          item.id.length < 100 &&
          Number.isSafeInteger(item.amountCents) &&
          item.amountCents >= 100 &&
          item.amountCents <= 1000000 &&
          typeof item.recipient === "string" &&
          typeof item.message === "string",
      )
      .map((item) => ({
        ...item,
        recipient: item.recipient.slice(0, 100),
        message: item.message.slice(0, 500),
      }));
  } catch {
    return [];
  }
}
export function methodLabel(method: string, lang: string) {
  return method === "TWINT" ? "TWINT" : giftText(lang, "Barzahlung", "Espèces");
}
