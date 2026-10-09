"use client";
import TranslatedContent from "@/components/TranslatedContent";

import { useState } from "react";
import { discountedPrice, formatPrice } from "@/lib/pricing";
export type CatalogueOffer = { id: string; name: string; description: string | null; priceCents: number; discountPercent: number; publicKey: string | null; durationMin?: number; lessonsTotal?: number };
type Draft = { id: string; name: string; description: string; priceCents: number; discountPercent: number; publicKey: string; units: number };
const INPUT = "mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-dark focus:ring-2 focus:ring-accent-dark/15";
const BUTTON = "w-fit rounded-xl bg-action-green px-5 py-3 text-sm font-bold text-white disabled:opacity-50";
const blank = (pack: boolean): Draft => ({ id: "", name: "", description: "", priceCents: 0, discountPercent: 0, publicKey: "", units: pack ? 5 : 45 });
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <TranslatedContent>{<label className="block text-sm font-semibold">{label}{children}</label>}</TranslatedContent>; }
export default function AdminPrices({ services, packages, pending, onSave }: { services: CatalogueOffer[]; packages: CatalogueOffer[]; pending: boolean; onSave: (url: string, body: object, message: string, reset?: () => void, method?: string) => Promise<boolean> }) {
  const [service, setService] = useState(blank(false));
  const [pack, setPack] = useState(blank(true));
  return <TranslatedContent>{<div className="grid gap-x-6 gap-y-5 lg:grid-cols-2 lg:grid-rows-[repeat(10,auto)]">
    {[false, true].map((isPackage) => {
      const draft = isPackage ? pack : service;
      const update = isPackage ? setPack : setService;
      const offers = isPackage ? packages : services;
      return <section key={String(isPackage)} className="grid gap-y-5 rounded-2xl border border-ink/10 bg-white p-5 sm:p-7 lg:row-span-10 lg:grid-rows-subgrid">
        <div><h3 className="text-lg font-bold">{isPackage ? "Fahrstunden-Abo" : "Einzelangebot"} {draft.id ? "bearbeiten" : "anlegen"}</h3><p className="mt-2 text-sm leading-relaxed text-ink/60">{isPackage ? "Mehrere Fahrstunden zu einem Gesamtpreis. Der Rabatt gilt für das ganze Abo." : "Fahrstunden oder Kurse mit Preis und Dauer. Ein Rabatt gilt für alle neuen Buchungen dieses Angebots."}</p></div>
        <form className="grid gap-y-5 lg:row-span-7 lg:grid-rows-subgrid" onSubmit={(e) => {
          e.preventDefault();
          void onSave(isPackage ? "/api/packages" : "/api/services", { ...(draft.id ? { id: draft.id } : {}), name: draft.name, description: draft.description, priceCents: draft.priceCents, discountPercent: draft.discountPercent, publicKey: draft.publicKey || null, ...(isPackage ? { lessonsTotal: draft.units } : { durationMin: draft.units }) }, "Gespeichert. Der neue Preis und Rabatt gelten für neue Buchungen und werden auf der Website automatisch übernommen.", () => update(blank(isPackage)), draft.id ? "PATCH" : "POST");
        }}><fieldset disabled={pending} className="contents">
          <Field label={isPackage ? "Name des Abos" : "Name des Angebots"}><input className={INPUT} required value={draft.name} placeholder={isPackage ? "Zum Beispiel 5er-Abo" : "Zum Beispiel Fahrstunde"} onChange={(e) => update({ ...draft, name: e.target.value })} /></Field>
          <Field label="Beschreibung (optional)"><textarea className={INPUT} rows={2} value={draft.description} onChange={(e) => update({ ...draft, description: e.target.value })} /></Field>
          <Field label={isPackage ? "Anzahl Fahrstunden" : "Dauer in Minuten"}><input className={INPUT} required type="number" min={isPackage ? 1 : 15} step={isPackage ? 1 : 15} value={draft.units} onChange={(e) => update({ ...draft, units: Number(e.target.value) })} /></Field>
          <div className="grid grid-cols-2 gap-4"><Field label={isPackage ? "Gesamtpreis in CHF" : "Normalpreis in CHF"}><input className={INPUT} required type="number" min={0.01} step={0.01} value={draft.priceCents / 100} onChange={(e) => update({ ...draft, priceCents: Math.round(Number(e.target.value) * 100) })} /></Field><Field label="Rabatt in %"><input className={INPUT} required type="number" min={0} max={100} step={1} value={draft.discountPercent} onChange={(e) => update({ ...draft, discountPercent: Number(e.target.value) })} /></Field></div>
          <Field label="Auf der Startseite anzeigen als"><select className={INPUT} value={draft.publicKey} onChange={(e) => update({ ...draft, publicKey: e.target.value })}><option value="">Nur im Buchungsbereich</option>{isPackage ? <option value="pack5">Fahrstunden-Abo</option> : <><option value="single">Einzellektion</option><option value="vku">VKU</option><option value="firstaid">Nothelferkurs</option></>}</select></Field>
          <div className="rounded-xl bg-accent-soft p-4 text-sm"><p className="font-bold">Kundenpreis: {formatPrice(discountedPrice(draft))}</p><p className="mt-1 text-xs leading-relaxed text-ink/60">{draft.discountPercent > 0 ? `${draft.discountPercent} % Rabatt auf ${formatPrice(draft.priceCents)}.` : "Kein Rabatt. Trage 0 % ein, um einen bestehenden Rabatt zu entfernen."} Bereits gebuchte Preise ändern sich nicht.</p></div>
          <div className="flex flex-wrap items-start gap-3"><button disabled={pending} className={BUTTON} type="submit">{pending ? "Wird gespeichert …" : draft.id ? "Änderungen speichern" : isPackage ? "Abo speichern" : "Angebot speichern"}</button>{draft.id && <button disabled={pending} type="button" onClick={() => update(blank(isPackage))} className="px-2 py-3 text-sm font-semibold text-ink/60">Bearbeiten abbrechen</button>}</div>
        </fieldset></form>
        <h4 className="text-sm font-bold">{isPackage ? "Vorhandene Abos" : "Vorhandene Angebote"}</h4>
        <ul className="divide-y divide-ink/10 self-start">{offers.length === 0 && <li className="text-sm text-ink/60">Noch kein Angebot vorhanden.</li>}{offers.map((offer) => <li key={offer.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="text-sm font-semibold">{offer.name}</p><p className="mt-1 text-xs text-ink/55">{isPackage ? `${offer.lessonsTotal} Fahrstunden` : `${offer.durationMin} Minuten`}{offer.publicKey ? " · auf der Website" : ""}</p>{offer.discountPercent > 0 && <p className="mt-1 text-xs font-semibold text-accent-dark">{offer.discountPercent} % Rabatt · vorher {formatPrice(offer.priceCents)}</p>}</div><div className="text-right"><p className="text-sm font-bold">{formatPrice(discountedPrice(offer))}</p><button disabled={pending} type="button" className="mt-1 text-xs font-bold text-accent-dark underline" onClick={() => update({ id: offer.id, name: offer.name, description: offer.description ?? "", priceCents: offer.priceCents, discountPercent: offer.discountPercent, publicKey: offer.publicKey ?? "", units: (isPackage ? offer.lessonsTotal : offer.durationMin) ?? 1 })}>Bearbeiten</button></div></li>)}</ul>
      </section>;
    })}
  </div>}</TranslatedContent>;
}
