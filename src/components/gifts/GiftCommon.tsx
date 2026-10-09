"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { giftText, type GiftItem, money } from "@/lib/gift-shared";
import { useGiftCart } from "./GiftCartProvider";
export const GIFT_INPUT =
  "mt-1.5 w-full rounded-xl border border-ink/25 bg-white px-4 py-3 text-base text-ink focus:border-accent-dark focus:outline-2 focus:outline-accent-dark/25";
export const GIFT_BUTTON =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed";
export function OfflineNotice() {
  const { lang } = useLanguage();
  return (
    <aside className="rounded-2xl border border-accent/20 bg-surface-2 p-5 text-sm leading-relaxed text-ink">
      <p className="font-bold">
        {giftText(
          lang,
          "Bezahlung persönlich vor Ort",
          "Paiement en personne sur place",
        )}
      </p>
      <p className="mt-2">
        {giftText(
          lang,
          "Die Bezahlung erfolgt persönlich beim Fahrlehrer in bar oder mit TWINT. Nach bestätigter Bezahlung wird dein Gutschein aktiviert und ausgestellt.",
          "Le paiement s’effectue en personne auprès du moniteur, en espèces ou avec TWINT. Après confirmation du paiement, ton bon est activé et établi.",
        )}
      </p>
    </aside>
  );
}
export function GiftShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { lang } = useLanguage(),
    { storageError } = useGiftCart();
  return (
    <div className="site-container py-10 sm:py-14">
      <Link
        href="/gutscheine"
        className="text-sm font-medium text-accent-dark hover:underline"
      >
        {giftText(lang, "← Gutschein-Shop", "← Boutique de bons")}
      </Link>
      <h1 className="mt-5 font-jakarta text-3xl font-extrabold sm:text-4xl">
        {title}
      </h1>
      {storageError && (
        <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-4">
          {giftText(
            lang,
            "Dein Browser erlaubt das Speichern nicht. Der Warenkorb bleibt nur während dieses Besuchs erhalten.",
            "Ton navigateur ne permet pas l’enregistrement. Le panier reste disponible uniquement pendant cette visite.",
          )}
        </p>
      )}
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  );
}
export function Personalize({
  item,
  index,
  required = false,
}: {
  item: GiftItem;
  index: number;
  required?: boolean;
}) {
  const { lang } = useLanguage(),
    { update } = useGiftCart();
  return (
    <fieldset className="rounded-xl border border-ink/10 p-4">
      <legend className="px-2 text-sm font-bold">
        {giftText(lang, `Gutschein ${index + 1}`, `Bon ${index + 1}`)} ·{" "}
        {money(item.amountCents)}
      </legend>
      <div className="space-y-3">
        <label className="block text-sm font-semibold">
          {giftText(
            lang,
            "Für wen ist der Gutschein?",
            "À qui est destiné le bon?",
          )}
          <input
            required={required}
            maxLength={100}
            placeholder={giftText(lang, "Vor- und Nachname", "Prénom et nom")}
            autoComplete="off"
            className={GIFT_INPUT}
            value={item.recipient}
            onChange={(e) => update(item.id, { recipient: e.target.value })}
          />
        </label>
        <label className="block text-sm font-semibold">
          {giftText(lang, "Persönliche Nachricht (optional)", "Message personnel (facultatif)")}
          <textarea
            rows={3}
            placeholder={giftText(lang, "Zum Beispiel: Viel Freude auf dem Weg zum Führerausweis!", "Par exemple: Bonne route vers le permis de conduire!")}
            maxLength={500}
            className={GIFT_INPUT}
            value={item.message}
            onChange={(e) => update(item.id, { message: e.target.value })}
          />
        </label>
      </div>
    </fieldset>
  );
}
