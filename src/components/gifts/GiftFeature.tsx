"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { GIFT_IMAGE, giftText } from "@/lib/gift-shared";
export default function GiftFeature() {
  const { lang } = useLanguage(),
    t = (de: string, fr: string) => giftText(lang, de, fr);
  return (
    <section
      id="gutscheine"
      className="scroll-mt-24 bg-surface-2 py-14 sm:py-20"
      aria-labelledby="home-gift-title"
    >
      <div className="site-container grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-accent-dark">
            {t("Gutscheine zum Verschenken", "Bons cadeaux à offrir")}
          </p>
          <h2
            id="home-gift-title"
            className="mt-4 font-jakarta text-3xl font-extrabold sm:text-4xl"
          >
            {t(
              "Schenke den nächsten Schritt zum Führerausweis",
              "Offre la prochaine étape vers le permis",
            )}
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-ink/65">
            {t(
              "Zum Geburtstag oder einfach als Unterstützung: Unsere Gutscheine sind für Fahrstunden, VKU und angebotene Kurse einlösbar. Wähle CHF 50, 100, 200 oder deinen Wunschbetrag in 50er-Schritten.",
              "Pour un anniversaire ou un coup de pouce: nos bons sont utilisables pour les leçons de conduite, la sensibilisation et les cours proposés. Choisis CHF 50, 100, 200 ou ton montant personnalisé par paliers de CHF 50.",
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            {t(
              "Persönlich gestalten, Bezahlung vor Ort vereinbaren und nach bestätigter Zahlung als PDF erhalten.",
              "Personnalise le bon, conviens du paiement sur place et reçois un PDF après confirmation du paiement.",
            )}
          </p>
          <Link
            href="/gutscheine"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            {t("Gutscheine entdecken", "Découvrir les bons")}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Link
          href="/gutscheine"
          aria-label={t("Zum Gutschein-Shop", "Voir la boutique de bons")}
          className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-dark"
        >
          <Image
            src={GIFT_IMAGE}
            alt={t(
              "Geschenkgutschein von Fahrschule fürs Leben",
              "Bon cadeau de Fahrschule fürs Leben",
            )}
            width={1491}
            height={1055}
            sizes="(min-width:1024px) 45vw, 90vw"
            className="h-auto w-full mix-blend-multiply transition-transform duration-300 motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:scale-[1.025] motion-safe:group-focus-visible:-translate-y-2 motion-reduce:transform-none"
          />
        </Link>
      </div>
    </section>
  );
}
