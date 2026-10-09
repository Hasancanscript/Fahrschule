"use client";
import TranslatedContent from "@/components/TranslatedContent";


import Link from "next/link";
import OfferInfoIntro from "@/components/OfferInfoIntro";
import { useOffers } from "@/lib/use-offers";
import { formatPrice } from "@/lib/pricing";

export default function DrivingOfferPage({ packageOffer = false }: { packageOffer?: boolean }) {
  const { offers, loading } = useOffers();
  const offer = offers[packageOffer ? "pack5" : "single"];
  const price = offer ? formatPrice(offer.discountedPriceCents) : loading ? "…" : "Auf Anfrage";
  const booking = packageOffer ? "/booking?offer=pack5" : "/booking?offer=single";
  const topics = packageOffer ? [
    { title: "Mehrere Lektionen, ein Abo", text: "Das 5er-Abo bündelt deine Fahrstunden. Den aktuellen Paketpreis findest du unten: deine verfügbaren Lektionen siehst du nach dem Kauf im Kundenkonto." },
    { title: "Termine einzeln wählen", text: "Du buchst jede Fahrstunde passend zu deinem Alltag. Bei der Buchung kannst du dein verfügbares Abo-Guthaben einsetzen." },
    { title: "Kontinuierlich Fortschritte machen", text: "Wir bauen jede Lektion auf deinem Lernstand auf und üben die Themen, die du für sicheres Fahren noch festigen möchtest." },
    { title: "Alles im Kundenkonto", text: "Termine und verbleibendes Guthaben bleiben übersichtlich an einem Ort. Die Bezahlung vereinbaren wir persönlich: die Online-Buchung reserviert deinen Termin." },
  ] : [
    { title: "Deine erste Fahrstunde", text: "Wir lernen uns kennen, besprechen deine Ziele und deinen bisherigen Lernstand. Danach machen wir dich mit dem Automatikfahrzeug vertraut." },
    { title: "Sicher im Strassenverkehr", text: "Du übst Blicktechnik, Vortritt, Kreuzungen, Kreisverkehr und das richtige Einschätzen von Verkehrssituationen: Schritt für Schritt in deinem Tempo." },
    { title: "Manöver und anspruchsvollere Strecken", text: "Parkieren, Rückwärtsfahren und Fahrten auf verschiedenen Strassen werden passend zu deinem Fortschritt in die Ausbildung eingebaut." },
    { title: "Vorbereitung auf die praktische Prüfung", text: "Mit konkretem Feedback weisst du, was schon gut klappt und was wir noch üben. Gemeinsam planen wir die nächsten Schritte zur Prüfung." },
  ];
  return <TranslatedContent>{<div lang="de" className="bg-surface pb-24">
    <OfferInfoIntro
      imageSrc={packageOffer ? "/5er-abo-bmw-regen-nacht.png" : "/winterliche-seepromenade-mit-bmw.png"}
      imageAlt={packageOffer ? "BMW-Fahrschulauto bei Regen und Nacht" : "Winterliche Seepromenade mit BMW"}
      imagePosition={packageOffer ? "center 65%" : "center 70%"}
      badgeText={packageOffer ? "5er-Abo" : "Deutsch / Französisch"}
      eyebrow={packageOffer ? "Auto · 5er-Abo" : "Auto · Fahrstunde"}
      title={packageOffer ? "5er-Abo: gemeinsam weiterkommen" : "Fahrstunden in Biel/Bienne"}
      description={packageOffer ? "Bleib dran und plane deine nächsten Fahrstunden mit einem Abo. Persönlicher Unterricht, ein modernes Automatikfahrzeug und klare Rückmeldungen begleiten dich auf deinem Weg zum Führerausweis." : "Bei Hüseyin lernst du sicher und selbstständig Auto fahren. Der Unterricht findet auf Deutsch oder Französisch statt, im modernen Automatikfahrzeug und angepasst an dein eigenes Lerntempo."}
      topics={topics} ctaHref={booking} ctaLabel={packageOffer ? "5er-Abo wählen" : "Fahrstunde buchen"}
      facts={[
        { label: packageOffer ? "Umfang" : "Dauer", value: packageOffer ? `${offer?.lessonsTotal ?? 5} Fahrstunden` : offer?.durationMin ? `${offer.durationMin} Minuten` : "Auf Anfrage" },
        { label: packageOffer ? "Paketpreis" : "Preis pro Lektion", value: price, originalValue: offer && offer.discountPercent > 0 ? formatPrice(offer.priceCents) : undefined },
        { label: "Fahrzeug", value: "Automatik" },
      ]}
    />
    <section className="site-container mt-12">
      <div className="rounded-3xl border border-ink/10 bg-surface-2 p-6 sm:p-10">
        <h2 className="font-jakarta text-2xl font-bold">So startest du</h2>
        <p className="mt-3 text-ink/70">Für die praktische Ausbildung brauchst du einen gültigen Lernfahrausweis der Kategorie B. Bring ihn zur Fahrstunde mit. Deinen Treffpunkt stimmen wir gemeinsam ab: für die Lektion helfen bequeme Schuhe und bei Bedarf deine Brille oder Kontaktlinsen.</p>
        <p className="mt-3 text-ink/70">Wähle online dein Angebot und einen verfügbaren Termin. Falls du noch am Anfang stehst, zeigt dir unsere Auto-Übersicht die Vorbereitung bis zur ersten Fahrstunde.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/auto" className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold">Schritt für Schritt zum Führerausweis →</Link>
          <Link href={packageOffer ? "/fahrstunde" : "/5er-abo"} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover">{packageOffer ? "Einzelne Fahrstunde ansehen" : "5er-Abo ansehen"} →</Link>
        </div>
      </div>
    </section>
  </div>}</TranslatedContent>;
}
