"use client";
import TranslatedContent from "@/components/TranslatedContent";

import Link from "next/link";
import OfferInfoIntro from "@/components/OfferInfoIntro";
import { DRIVING_STEPS, DRIVING_RULE_NOTE, DRIVING_SOURCE_URL } from "@/lib/driving-steps";


const STEPS = DRIVING_STEPS.map(step => ({
  title: step.title.de, text: step.text.de,
  href: step.link?.href, linkLabel: step.link?.label.de,
}));

export default function AutoPage() {
  return <TranslatedContent>{<div lang="de" className="bg-surface pb-24">
    <OfferInfoIntro imageSrc="/auto-fahren-lernen-bergkulisse.png" imageAlt="Fahrschulauto und drei Personen vor alpiner Bergkulisse" badgeText="Kategorie B" eyebrow="Auto · Dein Weg zum Führerausweis" title="Auto fahren lernen: Schritt für Schritt" description="Du möchtest deinen ersten Führerausweis machen? Hier findest du die wichtigsten Etappen für die Kategorie B im Kanton Bern: vom Nothelferkurs bis zur bestandenen Prüfung." topics={STEPS} topicsTitle="Deine nächsten Schritte" numbered ctaHref="/fahrstunde" ctaLabel="Fahrstunden ansehen" facts={[{label:"Kategorie",value:"B · Auto"},{label:"Unterricht",value:"Deutsch / Französisch"},{label:"Region",value:"Biel/Bienne"}]} />
    <section className="site-container mt-12">
      <div className="rounded-3xl border border-ink/10 bg-surface-2 p-6 sm:p-10">
        <h2 className="font-jakarta text-2xl font-bold">{DRIVING_RULE_NOTE.title.de}</h2>
        <p className="mt-3 text-ink/70">{DRIVING_RULE_NOTE.text.de}</p>
        <p className="mt-3 text-sm text-ink/60">Stand: Oktober 2026. Quelle: <a href={DRIVING_SOURCE_URL} className="font-semibold text-accent-dark">SVSA Kanton Bern</a>. Wenn du schon einen Führerausweis besitzt, können einzelne Schritte entfallen.</p>
        <Link href="/vku" className="mt-5 inline-block rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover">VKU-Angebot ansehen →</Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[{href:"/fahrstunde",title:"Fahrstunde",text:"Individuell lernen und sicherer werden."},{href:"/5er-abo",title:"5er-Abo",text:"Deine nächsten Lektionen im Paket."},{href:"/vku",title:"VKU",text:"Verkehr verstehen und Gefahren erkennen."},{href:"/nothelferkurs",title:"Nothelfer",text:"Erste Hilfe praktisch lernen."}].map(item=><Link key={item.href} href={item.href} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition hover:border-accent/40 hover:shadow-md"><h2 className="font-jakarta text-lg font-bold">{item.title} →</h2><p className="mt-2 text-sm text-ink/60">{item.text}</p></Link>)}
      </div>
    </section>
  </div>}</TranslatedContent>;
}
