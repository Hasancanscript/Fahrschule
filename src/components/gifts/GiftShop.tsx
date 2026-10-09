"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import {
  giftText,
  GIFT_IMAGE,
  PRESETS,
  money,
  validGiftAmount,
  type GiftSettings,
} from "@/lib/gift-shared";
import { useGiftCart } from "./GiftCartProvider";
import { OfflineNotice, GIFT_BUTTON } from "./GiftCommon";

export default function GiftShop() {
  const { lang } = useLanguage(),
    cart = useGiftCart();
  const [settings, setSettings] = useState<GiftSettings | null>(null);
  const [error, setError] = useState(false),
    [custom, setCustom] = useState(10000);
  const [notice, setNotice] = useState<{
    amount: number;
    added: boolean;
  } | null>(null);
  const t = (de: string, fr: string) => giftText(lang, de, fr);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/gifts/settings", { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw Error();
        const s = await r.json();
        setSettings(s);
        const first = Math.ceil(s.minCents / 5000) * 5000;
        const last = Math.floor(s.maxCents / 5000) * 5000;
        setCustom(Math.min(Math.max(10000, first), last));
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, []);
  const first = settings ? Math.ceil(settings.minCents / 5000) * 5000 : 5000;
  const last = settings ? Math.floor(settings.maxCents / 5000) * 5000 : 100000;
  const validCustom =
    settings && first <= last && validGiftAmount(custom, settings);
  const price = (amount: number) =>
    `CHF ${(amount / 100).toLocaleString(lang === "fr" ? "fr-CH" : "de-CH")}`;
  const descriptions = [
    t(
      "Eine kleine Freude und ein Beitrag zur nächsten Fahrstunde.",
      "Une petite attention et une contribution à la prochaine leçon.",
    ),
    t(
      "Unterstütze einen lieben Menschen beim Start in die Fahrausbildung.",
      "Accompagne une personne qui t’est chère au début de sa formation.",
    ),
    t(
      "Ein grosszügiges Geschenk für weitere Schritte zum Führerausweis.",
      "Un beau cadeau pour avancer encore vers le permis de conduire.",
    ),
    t(
      "Wähle selbst, wie viel du schenken möchtest. Immer in 50er-Schritten.",
      "Choisis toi-même le montant à offrir, par paliers de CHF 50.",
    ),
  ];
  const steps = [
    [
      t("Betrag auswählen", "Choisir le montant"),
      t(
        "Wähle CHF 50, 100 oder 200. Beim Wunschbetrag kannst du in 50er-Schritten mehr schenken.",
        "Choisis CHF 50, 100 ou 200. Le montant personnalisé augmente par paliers de CHF 50.",
      ),
    ],
    [
      t("Persönlich gestalten", "Personnaliser le cadeau"),
      t(
        "Trage im Warenkorb den Namen der beschenkten Person ein. Eine persönliche Nachricht kannst du ergänzen. Für mehrere Personen erhältst du separate Gutscheine.",
        "Indique le nom du bénéficiaire dans le panier et ajoute un message si tu le souhaites. Pour plusieurs personnes, tu recevras des bons séparés.",
      ),
    ],
    [
      t("Bestellung absenden", "Envoyer la commande"),
      t(
        "Sende deine Bestellung ab. Wir kontaktieren dich anschliessend, um die Bezahlung vor Ort in bar oder mit TWINT zu vereinbaren.",
        "Envoie ta commande. Nous te contacterons ensuite pour convenir du paiement sur place, en espèces ou avec TWINT.",
      ),
    ],
    [
      t("Gutschein erhalten", "Recevoir le bon"),
      t(
        "Nach bestätigtem Zahlungseingang stellen wir deinen Gutschein als PDF aus. Du kannst ihn ausdrucken oder weitergeben. Die Einlösung und Termine vereinbarst du mit der Fahrschule.",
        "Après confirmation du paiement, nous établissons ton bon en PDF. Tu peux l’imprimer ou le transmettre. L’utilisation et les rendez-vous sont convenus avec l’auto-école.",
      ),
    ],
  ];
  return (
    <div className="site-container py-12 sm:py-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-accent-dark">
            {t("Ein Geschenk, das weiterbringt", "Un cadeau pour avancer")}
          </p>
          <h1 className="mt-4 max-w-3xl font-jakarta text-3xl font-extrabold leading-tight sm:text-5xl">
            {t("Fahrfreude schenken", "Offrir le plaisir de conduire")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            {t(
              "Zum Geburtstag, zur bestandenen Theorieprüfung oder einfach als Unterstützung: Mit einem Gutschein von Fahrschule fürs Leben schenkst du einen Beitrag zum Führerausweis.",
              "Pour un anniversaire, une théorie réussie ou simplement pour donner un coup de pouce: avec un bon de Fahrschule fürs Leben, tu offres une contribution au permis de conduire.",
            )}
          </p>
          <a
            href="#gutschein-auswahl"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent-dark hover:underline"
          >
            {t("Gutscheinbetrag auswählen", "Choisir le montant du bon")}{" "}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <aside className="rounded-2xl border border-ink/10 bg-surface-2 p-6 sm:p-7">
          <h2 className="text-lg font-bold">
            {t(
              "Ein Gutschein, viele Möglichkeiten",
              "Un bon, plusieurs possibilités",
            )}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            {t(
              "Einlösbar für Fahrstunden, VKU und angebotene Kurse. Die beschenkte Person entscheidet gemeinsam mit der Fahrschule, wofür sie das Guthaben verwendet.",
              "Utilisable pour les leçons de conduite, la sensibilisation et les cours proposés. Le bénéficiaire choisit avec l’auto-école comment utiliser son crédit.",
            )}
          </p>
          <ul className="mt-5 space-y-3 text-sm font-medium">
            <li>
              ✓{" "}
              {t(
                "Mit persönlichem Empfängernamen",
                "Avec le nom du bénéficiaire",
              )}
            </li>
            <li>
              ✓{" "}
              {t(
                "Als PDF zum Ausdrucken oder Verschenken",
                "Un PDF à imprimer ou à offrir",
              )}
            </li>
            <li>
              ✓{" "}
              {t(
                "Teileinlösung möglich, Restguthaben bleibt erhalten",
                "Utilisation partielle possible, solde conservé",
              )}
            </li>
          </ul>
          <p className="mt-5 border-t border-ink/10 pt-4 text-sm leading-relaxed text-ink/70">
            {t(
              "Bezahlung persönlich vor Ort: Barzahlung oder TWINT. Dein Gutschein wird erst nach bestätigter Bezahlung aktiviert.",
              "Paiement en personne sur place: en espèces ou avec TWINT. Ton bon est activé uniquement après confirmation du paiement.",
            )}
          </p>
        </aside>
      </div>
      <section
        id="gutschein-auswahl"
        aria-labelledby="gift-selection-title"
        className="mt-12 scroll-mt-28 sm:mt-16"
      >
        <h2
          id="gift-selection-title"
          className="font-jakarta text-2xl font-bold"
        >
          {t(
            "Wie viel möchtest du schenken?",
            "Quel montant souhaites-tu offrir?",
          )}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          {t(
            "Wähle einen Gutschein aus. Den Empfänger und deine Nachricht ergänzt du im nächsten Schritt. Eine Anmeldung ist dafür nicht nötig.",
            "Choisis un bon. Tu ajouteras le bénéficiaire et ton message à l’étape suivante. Aucun compte n’est nécessaire.",
          )}
        </p>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-800">
            {t(
              "Wunschbeträge konnten nicht geladen werden. Bitte lade die Seite erneut.",
              "Les montants personnalisés n’ont pas pu être chargés. Recharge la page.",
            )}
          </p>
        )}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[...PRESETS, null].map((amount, index) => (
            <article
              key={amount ?? "custom"}
              className="flex flex-col overflow-hidden rounded-2xl border border-ink/15 bg-white"
            >
              <div className="border-b border-ink/5 px-3 pt-3">
                <Image
                  src={GIFT_IMAGE}
                  alt={t(
                    "Original-Gutscheinvorlage der Fahrschule",
                    "Modèle original du bon de l’auto-école",
                  )}
                  width={1491}
                  height={1055}
                  sizes="(min-width:1280px) 23vw, (min-width:640px) 45vw, 90vw"
                  className="h-auto w-full"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-ink/55">
                  {t("Geschenkgutschein", "Bon cadeau")}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold">
                  {amount
                    ? price(amount)
                    : t("Dein Wunschbetrag", "Ton montant personnalisé")}
                </h3>
                <p className="mb-5 mt-3 text-sm leading-relaxed text-ink/65">
                  {descriptions[index]}
                </p>
                {amount === null && (
                  <div className="mb-5">
                    <span
                      id="custom-amount-label"
                      className="block text-sm font-semibold"
                    >
                      {t("Dein Betrag in CHF", "Ton montant en CHF")}
                    </span>
                    <div
                      role="group"
                      aria-labelledby="custom-amount-label"
                      className="mt-2 flex items-center justify-between rounded-xl border border-ink/20 p-1"
                    >
                      <button
                        type="button"
                        aria-label={t(
                          "Wunschbetrag um 50 CHF reduzieren",
                          "Réduire le montant de CHF 50",
                        )}
                        disabled={!settings || custom <= first}
                        onClick={() => setCustom((value) => value - 5000)}
                        className="h-11 w-11 shrink-0 rounded-lg text-xl hover:bg-surface-2 disabled:opacity-30"
                      >
                        −
                      </button>
                      <output aria-live="polite" className="text-lg font-bold">
                        {price(custom)}
                      </output>
                      <button
                        type="button"
                        aria-label={t(
                          "Wunschbetrag um 50 CHF erhöhen",
                          "Augmenter le montant de CHF 50",
                        )}
                        disabled={!settings || custom >= last}
                        onClick={() => setCustom((value) => value + 5000)}
                        className="h-11 w-11 shrink-0 rounded-lg text-xl hover:bg-surface-2 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink/65">
                      {settings
                        ? `${price(first)} ${t("bis", "à")} ${price(last)} · ${t("in 50er-Schritten", "par paliers de CHF 50")}`
                        : t("Wird geladen …", "Chargement …")}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  className={`${GIFT_BUTTON} mt-auto w-full`}
                  disabled={!cart.ready || (amount === null && !validCustom)}
                  onClick={() =>
                    setNotice({
                      amount: amount ?? custom,
                      added: cart.add(amount ?? custom),
                    })
                  }
                >
                  {t("In den Warenkorb", "Ajouter au panier")}
                </button>
              </div>
            </article>
          ))}
        </div>
        {notice && (
          <aside aria-label={t("Warenkorb-Meldung", "Notification du panier")} className="fixed right-4 top-24 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-[#009fdf]/40 bg-white p-5 shadow-xl sm:right-6 sm:top-28">
            <div className="flex items-start justify-between gap-3">
              <p role="status" className="text-base font-bold">
                {notice.added ? t("Gutschein hinzugefügt", "Bon ajouté au panier") : t("Dein Warenkorb ist voll", "Ton panier est plein")}
              </p>
              <button type="button" onClick={() => setNotice(null)} aria-label={t("Meldung schliessen", "Fermer la notification")} className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink/65 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-dark">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{notice.added ? t(
              money(notice.amount) + " liegt jetzt in deinem Warenkorb. Du kannst weitere Gutscheine auswählen oder deine Bestellung fortsetzen.",
              money(notice.amount) + " se trouve dans ton panier. Tu peux choisir d’autres bons ou poursuivre ta commande.",
            ) : t("Maximal 30 Gutscheine pro Bestellung.", "Maximum 30 bons par commande.")}</p>
            <Link href="/warenkorb" className={GIFT_BUTTON + " mt-4 w-full"}>{t("Jetzt zum Warenkorb →", "Voir mon panier →")}</Link>
            <button type="button" onClick={() => setNotice(null)} className="mt-2 min-h-11 w-full rounded-xl text-sm font-semibold text-accent-dark hover:bg-surface-2">{t("Weiter einkaufen", "Continuer mes achats")}</button>
          </aside>
        )}
      </section>
      <section
        className="mt-10 border-t-2 border-[#009fdf] pt-10"
        aria-labelledby="gift-how-title"
      >
        <h2 id="gift-how-title" className="font-jakarta text-2xl font-bold">
          {t("So kommt dein Geschenk an", "Comment recevoir ton cadeau")}
        </h2>
        <ol className="mt-7 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map(([title, description], index) => (
            <li key={index}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-sm font-bold text-accent-dark">
                {index + 1}
              </span>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </section>
      <div className="mt-10">
        <OfflineNotice />
      </div>
      <section className="mt-10 grid gap-8 border-t border-ink/10 pt-8 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold">
            {t("Noch eine Frage zum Gutschein?", "Une question sur les bons?")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            {t(
              "Du möchtest mehrere Personen beschenken oder bist beim Betrag unsicher? Wir helfen dir gerne. Ruf Hüseyin an oder schreib der Fahrschule.",
              "Tu souhaites offrir des bons à plusieurs personnes ou tu hésites sur le montant? Nous t’aidons volontiers. Appelle Hüseyin ou écris à l’auto-école.",
            )}
          </p>
          <a
            href="tel:+41787778161"
            className="mt-3 inline-flex min-h-11 items-center font-bold text-accent-dark hover:underline"
          >
            078 777 81 61
          </a>
        </div>
        <div>
          <h2 className="text-lg font-bold">
            {t("Guthaben und Gültigkeit", "Solde et validité")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            {t(
              "Der Gutschein ist übertragbar und kann in Teilbeträgen eingelöst werden. Wir setzen kein zusätzliches Verfallsdatum. Die gesetzlichen Verjährungsfristen gelten.",
              "Le bon est transférable et peut être utilisé en plusieurs fois. Nous ne fixons pas de date d’expiration supplémentaire. Les délais légaux de prescription s’appliquent.",
            )}
          </p>
          <Link
            href="/gutscheinbedingungen"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent-dark hover:underline"
          >
            {t("Gutscheinbedingungen lesen", "Lire les conditions des bons")} →
          </Link>
        </div>
      </section>
    </div>
  );
}
