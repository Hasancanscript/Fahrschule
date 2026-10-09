"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { giftText, giftTotal, money, methodLabel } from "@/lib/gift-shared";
import { useGiftCart } from "./GiftCartProvider";
import {
  GiftShell,
  OfflineNotice,
  Personalize,
  GIFT_INPUT,
  GIFT_BUTTON,
} from "./GiftCommon";
type CheckoutContact = { name: string; email: string; phone: string | null };
export function GiftCheckoutLoading() {
  const { lang } = useLanguage();
  return (
    <GiftShell title={giftText(lang, "Deine Gutscheinbestellung", "Ta commande de bons")}>
      <p role="status">{giftText(lang, "Wird geladen …", "Chargement …")}</p>
    </GiftShell>
  );
}
export default function GiftCheckout({ initialContact = null }: { initialContact?: CheckoutContact | null }) {
  const { lang } = useLanguage(),
    cart = useGiftCart(),
    router = useRouter(),
    t = (de: string, fr: string) => giftText(lang, de, fr);
  const [form, setForm] = useState(() => {
      const [firstName, ...lastName] = initialContact?.name.trim().split(/\s+/) ?? [""];
      return {
        firstName,
        lastName: lastName.join(" "),
        email: initialContact?.email ?? "",
        phone: initialContact?.phone ?? "",
      };
    }),
    [method, setMethod] = useState("CASH"),
    [accepted, setAccepted] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const request = useRef<{ hash: string; id: string } | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const checkoutForm = e.currentTarget as HTMLFormElement;
    for (const element of Array.from(checkoutForm.elements)) {
      if (!(element instanceof HTMLInputElement) && !(element instanceof HTMLTextAreaElement)) continue;
      element.setCustomValidity("");
      if (element.validity.valueMissing) element.setCustomValidity(element.type === "checkbox" ? t("Bitte bestätige, dass du die Gutscheinbedingungen gelesen hast.", "Confirme que tu as lu les conditions des bons.") : t("Bitte fülle dieses Feld aus.", "Merci de remplir ce champ."));
      else if (element.validity.typeMismatch) element.setCustomValidity(t("Bitte gib eine gültige E-Mail-Adresse ein.", "Merci de saisir une adresse e-mail valide."));
      else if (element.name === "phone" && !/^[+()\d\s.-]{7,40}$/.test(element.value.trim())) element.setCustomValidity(t("Bitte gib eine gültige Telefonnummer ein.", "Merci de saisir un numéro de téléphone valide."));
      else if (element.required && element.type !== "checkbox" && !element.value.trim()) element.setCustomValidity(t("Bitte fülle dieses Feld aus.", "Merci de remplir ce champ."));
    }
    if (!checkoutForm.reportValidity()) return;
    setBusy(true);
    setError("");
    const body = {
      ...form,
      lang,
      method,
      accepted,
      totalCents: giftTotal(cart.items),
      items: cart.items.map(({ amountCents, recipient, message }) => ({
        amountCents,
        recipient,
        message,
      })),
    };
    const hash = JSON.stringify(body);
    if (request.current?.hash !== hash)
      request.current = { hash, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/gift-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, requestId: request.current!.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 429 ? t("Zu viele Anfragen. Bitte versuche es später erneut.", "Trop de demandes. Réessaie plus tard.") : t("Bitte prüfe deine Angaben und versuche es erneut. Bei Fragen: 078 777 81 61.", "Vérifie tes données et réessaie. Pour toute question: 078 777 81 61."));
      cart.clear();
      router.push(`/gutscheine/bestaetigung/${data.id}`);
    } catch (e) {
      setError(
        e instanceof Error
          ? (e instanceof TypeError ? t("Die Verbindung ist unterbrochen. Bitte versuche es erneut.", "La connexion est interrompue. Réessaie.") : e.message)
          : t(
              "Bestellung konnte nicht gespeichert werden.",
              "La commande n’a pas pu être enregistrée.",
            ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <GiftShell title={t("Deine Gutscheinbestellung", "Ta commande de bons")}>
      {!cart.ready ? (
        <p>{t("Wird geladen …", "Chargement …")}</p>
      ) : !cart.items.length ? (
        <p>
          {t("Dein Warenkorb ist leer.", "Ton panier est vide.")}{" "}
          <Link href="/gutscheine" className="text-accent-dark underline">
            {t("Zum Shop", "Voir la boutique")}
          </Link>
        </p>
      ) : (
        <form
          noValidate
          onSubmit={submit}
          onInput={(e) => { const target = e.target; if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) target.setCustomValidity(""); }}
          className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
        >
          <fieldset disabled={busy} className="min-w-0 space-y-6 rounded-2xl border border-ink/10 p-5 sm:p-7">
            <legend className="mb-4 text-xl font-bold">
              {t("Deine Angaben", "Tes coordonnées")}
            </legend>
            {initialContact && (
              <p className="text-sm leading-relaxed text-ink/65">
                {t("Deine Kontaktdaten wurden aus deinem Konto übernommen. Du kannst sie bei Bedarf anpassen oder fehlende Angaben ergänzen.", "Tes coordonnées ont été reprises de ton compte. Tu peux les modifier ou compléter les informations manquantes si nécessaire.")}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["firstName", t("Vorname", "Prénom"), "text", "given-name"],
                  ["lastName", t("Nachname", "Nom"), "text", "family-name"],
                  [
                    "email",
                    t("E-Mail-Adresse", "Adresse e-mail"),
                    "email",
                    "email",
                  ],
                  [
                    "phone",
                    t("Telefonnummer", "Numéro de téléphone"),
                    "tel",
                    "tel",
                  ],
                ] as const
              ).map(([key, label, type, autocomplete]) => (
                <label key={key} className="text-sm font-semibold">
                  {label}
                  <input
                    name={key}
                    required
                    maxLength={
                      key === "email" ? 254 : key === "phone" ? 40 : 100
                    }
                    autoComplete={autocomplete}
                    type={type}
                    className={GIFT_INPUT}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <h2 className="text-xl font-bold">
              {t("Jeden Gutschein personalisieren", "Personnaliser chaque bon")}
            </h2>
            <div className="grid gap-4 xl:grid-cols-2">
              {cart.items.map((item, index) => (
                <Personalize key={item.id} item={item} index={index} required />
              ))}
            </div>
            <fieldset>
              <legend className="font-bold">
                {t(
                  "Gewünschte Bezahlung vor Ort",
                  "Paiement souhaité sur place",
                )}
              </legend>
              {["CASH", "TWINT"].map((m) => (
                <label
                  key={m}
                  className="mt-3 flex min-h-11 items-center gap-3"
                >
                  <input
                    type="radio"
                    name="method"
                    value={m}
                    checked={method === m}
                    onChange={() => setMethod(m)}
                  />
                  {methodLabel(m, lang)} ·{" "}
                  {t(
                    "persönlich beim Fahrlehrer",
                    "en personne auprès du moniteur",
                  )}
                </label>
              ))}
            </fieldset>
            <label className="flex items-start gap-3 text-sm leading-relaxed">
              <input
                required
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1"
              />
              <span>
                {t("Ich habe die", "J’ai lu les")}{" "}
                <Link
                  href="/gutscheinbedingungen"
                  target="_blank"
                  className="text-accent-dark underline"
                >
                  {t("Gutscheinbedingungen", "conditions des bons")}
                </Link>{" "}
                {t(
                  "gelesen. Informationen zu meinen Daten finde ich im",
                  "et je trouve les informations sur mes données dans la",
                )}{" "}
                <Link
                  href="/datenschutz"
                  target="_blank"
                  className="text-accent-dark underline"
                >
                  {t("Datenschutz", "déclaration de confidentialité")}
                </Link>
                .
              </span>
            </label>
            <p className="text-sm leading-relaxed text-ink/65">{t("Info: Wir verwenden deine Kontaktdaten zur Bearbeitung deiner Gutscheinbestellung und zur Vereinbarung der Bezahlung. Weitere Informationen findest du im Datenschutz.", "Info: Nous utilisons tes coordonnées pour traiter ta commande de bons et convenir du paiement. Tu trouveras plus d’informations dans la déclaration de confidentialité.")}</p>
          </fieldset>
          <div className="min-w-0 space-y-4 lg:sticky lg:top-28">
          <aside className="rounded-2xl border border-ink/10 bg-surface-2 p-6">
            <h2 className="text-xl font-bold">
              {t("Bestellübersicht", "Récapitulatif")}
            </h2>
            <p className="mt-3 text-sm">
              {cart.items.length} {t(cart.items.length === 1 ? "Gutschein" : "Gutscheine", cart.items.length === 1 ? "bon" : "bons")}
            </p>
            <ul className="mt-4 space-y-3">
              {cart.items.map((i, index) => (
                <li
                  key={i.id}
                  className="flex justify-between gap-3 border-b border-ink/10 pb-3 text-sm"
                >
                  <span>
                    {index + 1}.{" "}
                    {i.recipient ||
                      t("Empfänger noch ergänzen", "Destinataire à compléter")}
                  </span>
                  <strong className="whitespace-nowrap">
                    {money(i.amountCents)}
                  </strong>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xl font-bold">
              {t("Gesamtbetrag", "Montant total")}:{" "}
              {money(giftTotal(cart.items))}
            </p>
            <div className="mt-5 text-sm leading-relaxed">
              <p>
                {form.firstName} {form.lastName}
              </p>
              <p className="break-all">{form.email}</p>
              <p>{form.phone}</p>
              <p className="mt-2">
                {methodLabel(method, lang)} · {t("vor Ort", "sur place")}
              </p>
            </div>
            <Link
              href="/warenkorb"
              className="mt-4 inline-block text-sm font-semibold text-accent-dark underline"
            >
              {t("Warenkorb korrigieren", "Modifier le panier")}
            </Link>
            <p className="mt-6 text-sm leading-relaxed">
              {t(
                "Nach dem Absenden deiner Bestellung kontaktieren wir dich, um die Bezahlung vor Ort in bar oder mit TWINT zu vereinbaren. Jetzt wird kein Geld abgebucht.",
                "Après l’envoi de ta commande, nous te contacterons pour convenir du paiement sur place, en espèces ou avec TWINT. Aucun montant n’est débité maintenant.",
              )}
            </p>
            {error && (
              <p role="alert" className="mt-4 text-sm text-red-800">
                {lang === "fr"
                  ? t(
                      "Bitte prüfe deine Angaben und versuche es erneut. Bei Fragen: 078 777 81 61.",
                      "Vérifie tes données et réessaie. Pour toute question: 078 777 81 61.",
                    )
                  : error}
              </p>
            )}
            <button disabled={busy} className={`${GIFT_BUTTON} mt-5 w-full`}>
              {busy
                ? t("Wird gespeichert …", "Enregistrement …")
                : t(
                    "Bestellung absenden",
                    "Envoyer la commande",
                  )}
            </button>
          </aside>
          <OfflineNotice />
          </div>
        </form>
      )}
    </GiftShell>
  );
}
