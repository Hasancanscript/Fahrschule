"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { giftText, giftTotal, GIFT_IMAGE, money } from "@/lib/gift-shared";
import { useGiftCart } from "./GiftCartProvider";
import { GiftShell, OfflineNotice, Personalize, GIFT_BUTTON } from "./GiftCommon";

export default function GiftCart() {
  const { lang } = useLanguage();
  const cart = useGiftCart();
  const t = (de: string, fr: string) => giftText(lang, de, fr);
  const groups = [...new Set(cart.items.map((item) => item.amountCents))].map(
    (amount) => ({ amount, items: cart.items.filter((item) => item.amountCents === amount) }),
  );
  return (
    <GiftShell title={t("Dein Warenkorb", "Ton panier")}>
      {!cart.ready ? (
        <p role="status">{t("Wird geladen …", "Chargement …")}</p>
      ) : !cart.items.length ? (
        <div className="rounded-2xl border border-ink/10 bg-surface-2 p-6 sm:p-8">
          <h2 className="text-xl font-bold">{t("Noch kein Gutschein im Warenkorb", "Aucun bon dans ton panier")}</h2>
          <p className="mt-2 text-ink/70">{t("Wähle einen Gutschein und schenke Freude auf dem Weg zum Führerausweis.", "Choisis un bon et offre le plaisir d’avancer vers le permis de conduire.")}</p>
          <Link href="/gutscheine" className={`${GIFT_BUTTON} mt-5`}>
            {t("Gutscheine entdecken", "Découvrir les bons")}
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-5">
            <p className="max-w-2xl text-sm leading-relaxed text-ink/70">
              {t("Dein Gutschein ist bereits im Warenkorb. Wenn du mehrere möchtest, wähle direkt die Anzahl. Namen und Nachrichten kannst du hier oder im nächsten Schritt ergänzen.", "Ton bon est déjà dans le panier. Pour en offrir plusieurs, choisis directement la quantité. Tu peux ajouter les noms et messages ici ou à l’étape suivante.")}
            </p>
            {groups.map((group) => (
              <section key={group.amount} aria-label={t(`Gutscheine für ${money(group.amount)}`, `Bons de ${money(group.amount)}`)} className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
                <div className="flex flex-wrap items-center gap-4 border-b border-ink/10 bg-surface-2/50 p-5 sm:p-6">
                  <Image src={GIFT_IMAGE} alt={t("Gutschein", "Bon cadeau")} width={1491} height={1055} sizes="128px" className="h-auto w-24 shrink-0 rounded-lg sm:w-32" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold sm:text-xl">{t("Wertgutschein", "Bon cadeau")}</h2>
                    <p className="mt-1 text-sm text-ink/65">{money(group.amount)} {t("pro Gutschein", "par bon")}</p>
                  </div>
                  <label className="flex w-full items-center gap-3 text-sm font-semibold sm:w-auto">
                    {t("Anzahl", "Quantité")}
                    <select aria-label={t("Anzahl für " + money(group.amount), "Quantité pour " + money(group.amount))} value={group.items.length} className="min-h-11 min-w-20 rounded-xl border border-ink/20 bg-white px-3 focus-visible:outline-2 focus-visible:outline-accent-dark" onChange={(e) => {
                      const quantity = Number(e.target.value);
                      if (quantity > group.items.length) {
                        for (let i = group.items.length; i < quantity; i++) cart.add(group.amount);
                      } else {
                        for (const item of group.items.slice(quantity)) cart.remove(item.id);
                      }
                    }}>
                      {Array.from({ length: 31 - cart.items.length + group.items.length }, (_, quantity) => <option key={quantity} value={quantity}>{quantity === 0 ? t("Entfernen", "Supprimer") : quantity}</option>)}
                    </select>
                  </label>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-sm font-semibold">{t("Gutscheine persönlich gestalten", "Personnaliser les bons")}</h3>
                  <p className="mt-1 text-sm text-ink/65">{t("Den Namen kannst du jetzt oder im nächsten Schritt ergänzen. Eine persönliche Nachricht ist optional.", "Tu peux ajouter le nom maintenant ou à l’étape suivante. Le message personnel est facultatif.")}</p>
                  <div className="mt-5 space-y-4">
                  {group.items.map((item) => (
                    <div key={item.id}>
                      <Personalize item={item} index={cart.items.indexOf(item)} />
                      <div className="mt-1 flex sm:justify-end">
                        <button type="button" aria-label={t(`Gutschein ${cart.items.indexOf(item) + 1} entfernen`, `Supprimer le bon ${cart.items.indexOf(item) + 1}`)} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-ink/65 transition hover:text-red-800 focus-visible:outline-2 focus-visible:outline-accent-dark" onClick={() => cart.remove(item.id)}>
                          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" /></svg>
                          {t("Entfernen", "Supprimer")}
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </section>
            ))}
            <Link href="/gutscheine" className="inline-flex min-h-11 items-center text-sm font-semibold text-accent-dark hover:underline">{t("Weitere Gutscheine auswählen →", "Choisir d’autres bons →")}</Link>
          </div>
          <aside aria-label={t("Bestellübersicht", "Récapitulatif de commande")} className="min-w-0 space-y-4 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 sm:p-7">
              <h2 className="text-xl font-bold">{t("Deine Übersicht", "Ton récapitulatif")}</h2>
              <p className="mt-1 text-sm text-ink/65">{cart.items.length} {t(cart.items.length === 1 ? "Gutschein" : "Gutscheine", cart.items.length === 1 ? "bon cadeau" : "bons cadeaux")}</p>
              <ul className="my-6 space-y-4">
                {groups.map((group) => (
                  <li key={group.amount} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-ink/70">{group.items.length} × {money(group.amount)}</span>
                    <span className="shrink-0 font-semibold">{money(group.amount * group.items.length)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 pt-5" aria-live="polite" aria-atomic="true">
                <span className="font-semibold">{t("Gesamtbetrag", "Montant total")}</span>
                <strong className="text-xl">{money(giftTotal(cart.items))}</strong>
              </div>
              <Link href="/checkout" className={`${GIFT_BUTTON} mt-6 w-full`}>{t("Zur Bestellübersicht", "Passer à la commande")}</Link>
              <p className="mt-3 text-center text-xs leading-relaxed text-ink/65">{t("Noch keine Zahlung. Du prüfst zuerst alle Angaben.", "Aucun paiement à cette étape. Tu vérifies d’abord toutes les informations.")}</p>
            </div>
            <OfflineNotice />
          </aside>
        </div>
      )}
    </GiftShell>
  );
}
