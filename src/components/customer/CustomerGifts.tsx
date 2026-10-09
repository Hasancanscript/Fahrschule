"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { giftText, money, statusLabel } from "@/lib/gift-shared";
type CustomerGiftOrder = {
  id: string; number: string; createdAt: string; status: string; totalCents: number;
  vouchers: { id: string; recipient: string; message: string; amountCents: number; remainingCents: number; status: string; code: string | null }[];
};
export default function CustomerGifts() {
  const { lang } = useLanguage();
  const t = (de: string, fr: string) => giftText(lang, de, fr);
  const [orders, setOrders] = useState<CustomerGiftOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<number | null>(null);
  const [retry, setRetry] = useState(0);
  const refresh = useCallback(() => setRetry(value => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const response = await fetch("/api/account/gifts", { cache: "no-store", signal: controller.signal });
        if (!response.ok) { setError(response.status); setOrders([]); return; }
        const data: CustomerGiftOrder[] = await response.json();
        if (!controller.signal.aborted) { setOrders(data); setError(null); }
      } catch {
        if (!controller.signal.aborted) { setError(503); setOrders([]); }
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    const onFocus = () => { if (document.visibilityState === "visible") refresh(); };
    const timer = window.setInterval(onFocus, 30000);
    window.addEventListener("focus", onFocus);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", onFocus); };
  }, [refresh]);
  return (
    <section aria-label={t("Meine Gutscheine", "Mes bons cadeaux")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 className="text-xl font-bold">{t("Meine Gutscheine", "Mes bons cadeaux")}</h2><p className="mt-2 text-sm text-ink/65">{t("Hier findest du deine Gutscheinbestellungen. Nach bestätigter Bezahlung kannst du deine Gutscheine als PDF herunterladen.", "Tu retrouves ici tes commandes de bons. Après confirmation du paiement, tu peux télécharger tes bons en PDF.")}</p></div>
        <Link href="/gutscheine" className="inline-flex min-h-11 items-center rounded-xl bg-action-blue px-4 py-3 text-sm font-bold text-white hover:bg-action-blue-hover">{t("Gutschein verschenken", "Offrir un bon")}</Link>
      </div>
      {loading && <p role="status" className="mt-5 text-sm text-ink/65">{t("Gutscheine werden geladen …", "Chargement des bons …")}</p>}
      {error !== null ? (
        <div role="alert" className="mt-5 rounded-2xl border border-ink/10 bg-white p-6">
          <p>{error === 401 ? t("Bitte melde dich erneut an, um deine Gutscheine zu sehen.", "Reconnecte-toi pour voir tes bons.") : t("Deine Gutscheine konnten nicht geladen werden. Bitte versuche es erneut.", "Tes bons n’ont pas pu être chargés. Réessaie.")}</p>
          {error === 401 ? <Link href="/login?next=%2Fbooking%3Fview%3Dgifts" className="mt-3 inline-block font-semibold text-action-blue underline">{t("Zur Anmeldung", "Se connecter")}</Link> : <button type="button" disabled={loading} onClick={refresh} className="mt-3 min-h-11 font-semibold text-action-blue underline">{t("Erneut laden", "Réessayer")}</button>}
        </div>
      ) : !loading && !orders.length ? (
        <p className="mt-5 rounded-2xl border border-ink/10 bg-white p-6 text-sm text-ink/65">{t("Du hast noch keine Gutscheinbestellung in deinem Konto. Wenn du angemeldet bestellst, erscheint sie hier automatisch.", "Ton compte ne contient pas encore de commande de bons. Les commandes effectuées en étant connecté apparaissent ici automatiquement.")}</p>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {orders.map(order => (
            <article key={order.id} className="min-w-0 rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="break-all font-bold">{order.number}</h3><p className="mt-1 text-xs text-ink/65">{new Intl.DateTimeFormat(lang === "fr" ? "fr-CH" : "de-CH", { timeZone: "Europe/Zurich", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(order.createdAt))}</p></div>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold">{statusLabel(order.status, lang)}</span>
              </div>
              <ul className="mt-5 divide-y divide-ink/10">
                {order.vouchers.map(voucher => (
                  <li key={voucher.id} className="py-4 first:pt-0">
                    <div className="flex flex-wrap justify-between gap-2"><span className="break-words font-semibold">{voucher.recipient}</span><strong>{money(voucher.amountCents)}</strong></div>
                    {voucher.message && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-ink/65">{voucher.message}</p>}
                    <p className="mt-2 text-sm text-ink/65">{statusLabel(voucher.status, lang)}{order.status === "PAID" && <> · {t("Restguthaben", "Solde restant")}: {money(voucher.remainingCents)}</>}</p>
                    {voucher.code && <p className="mt-2 break-all text-xs text-ink/65">{t("Gutscheincode", "Code du bon")}: <span translate="no">{voucher.code}</span></p>}
                  </li>
                ))}
              </ul>
              <p className="border-t border-ink/10 pt-4 font-bold">{t("Gesamtbetrag", "Montant total")}: {money(order.totalCents)}</p>
              {order.status === "OPEN" && <p className="mt-3 text-sm leading-relaxed text-ink/65">{t("Wir kontaktieren dich, um die Bezahlung zu vereinbaren. Nach bestätigter Bezahlung wird dein Gutschein aktiviert.", "Nous te contacterons pour convenir du paiement. Ton bon sera activé après confirmation du paiement.")}</p>}
              <div className="mt-4 flex flex-wrap gap-4">
                <Link href={"/gutscheine/bestaetigung/" + order.id} className="inline-flex min-h-11 items-center text-sm font-semibold text-action-blue underline">{t("Bestellung ansehen", "Voir la commande")}</Link>
                {order.status === "PAID" && <a href={"/api/gift-orders/" + order.id + "/pdf"} className="inline-flex min-h-11 items-center rounded-xl bg-action-blue px-4 py-3 text-sm font-bold text-white hover:bg-action-blue-hover">{t("Gutscheine als PDF herunterladen", "Télécharger les bons en PDF")}</a>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
