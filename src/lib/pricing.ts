export type PricedOffer = { priceCents: number; discountPercent: number };
export function discountedPrice(offer: PricedOffer) {
  return Math.round(offer.priceCents * (100 - offer.discountPercent) / 100);
}
export function formatPrice(cents: number) { return `CHF ${(cents / 100).toFixed(2)}`; }
export function withPrice<T extends PricedOffer>(offer: T) {
  return { ...offer, discountedPriceCents: discountedPrice(offer) };
}

export class PriceChangedError extends Error {}
export function checkQuotedPrice(expected: unknown, offer: PricedOffer | null) {
  if (expected === undefined) return;
  const actual = offer ? discountedPrice(offer) : null;
  if (expected !== actual) throw new PriceChangedError("Der Preis wurde inzwischen geändert. Bitte prüfe den aktualisierten Preis und buche erneut.");
}
