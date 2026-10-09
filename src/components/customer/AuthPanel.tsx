
import TranslatedContent from "@/components/TranslatedContent";
import Link from "next/link";
import PortalIcon from "./PortalIcon";
export default function AuthPanel({ children }: { children: React.ReactNode }) {
  return <TranslatedContent>{<div lang="de" className="bg-surface-2 py-10 sm:py-16"><div className="site-container"><div className="grid overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm lg:grid-cols-2">
    <div className="order-2 flex flex-col justify-between border-t border-ink/10 bg-white lg:order-1 lg:border-t-0 lg:border-r p-7 sm:p-10"><div><Link href="/" className="text-sm font-bold text-accent-dark">Fahrschule fürs Leben</Link><p className="mt-10 text-xs font-bold uppercase tracking-widest text-accent-dark">Dein Kundenbereich</p><h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">Dein nächster Schritt.<br />Alles im Blick.</h2><p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/65">Buche deine Fahrstunden und behalte deine Termine und dein Abo im Überblick.</p></div>
    <ul className="mt-8 space-y-5">{[{ name: "calendar" as const, title: "Termine einfach buchen", text: "Freien Termin auswählen und direkt reservieren." }, { name: "wallet" as const, title: "Dein Abo im Überblick", text: "Sieh, wie viele Fahrstunden dir noch bleiben." }, { name: "document" as const, title: "Buchungen als PDF", text: "Datum, Uhrzeit und Details jederzeit herunterladen." }].map(item => <li key={item.title} className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-accent-dark"><PortalIcon name={item.name} /></span><div><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs leading-relaxed text-ink/60">{item.text}</p></div></li>)}</ul>
    <p className="mt-9 text-xs text-ink/60">Brauchst du Hilfe? <a href="tel:+41787778161" className="font-semibold text-accent-dark underline">078 777 81 61</a></p></div>
    <div className="order-1 p-7 sm:p-10 lg:order-2 lg:py-14">{children}</div>
  </div></div></div>}</TranslatedContent>;
}

