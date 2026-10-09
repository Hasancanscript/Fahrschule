"use client";
import { useEffect, useState } from "react";
export type PublicOffer = { id: string; name: string; priceCents: number; discountPercent: number; discountedPriceCents: number; durationMin?: number; lessonsTotal?: number };
export function useOffers() {
  const [offers, setOffers] = useState<Record<string, PublicOffer>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    let pending = false;
    const controller = new AbortController();
    async function refresh() {
      if (!active || pending) return;
      pending = true;
      try {
        const res = await fetch("/api/public/offers", { cache: "no-store", signal: controller.signal });
        if (!res.ok) throw new Error("Preisabfrage fehlgeschlagen");
        const data = await res.json();
        if (active) setOffers(previous => JSON.stringify(previous) === JSON.stringify(data) ? previous : data);
      } catch { if (active) setOffers({}); }
      finally { pending = false; if (active) setLoading(false); }
    }
    void refresh();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 30000);
    window.addEventListener("focus", refresh);
    return () => { active = false; controller.abort(); window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  return { offers, loading };
}
