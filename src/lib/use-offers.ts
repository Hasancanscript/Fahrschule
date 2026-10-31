// Preise und Angaben zu den Angeboten. Hier ändern, dann stimmen sie überall auf der Website.
export type PublicOffer = { id: string; name: string; priceCents: number; discountPercent: number; discountedPriceCents: number; durationMin?: number; lessonsTotal?: number };

const offer = (id: string, name: string, priceCents: number, extra: Partial<PublicOffer> = {}): PublicOffer => ({
  id,
  name,
  priceCents,
  discountPercent: 0,
  discountedPriceCents: priceCents,
  ...extra,
});

// Der Nothelferkurs hat keinen festen Preis ("Auf Anfrage") und fehlt darum bewusst.
export const OFFERS: Record<string, PublicOffer> = {
  single: offer("single", "Fahrstunde", 9200, { durationMin: 45 }),
  pack5: offer("pack5", "5er-Abo", 42500, { lessonsTotal: 5 }),
  vku: offer("vku", "VKU", 17000, { durationMin: 180 }),
};

export function useOffers() {
  return { offers: OFFERS, loading: false };
}
