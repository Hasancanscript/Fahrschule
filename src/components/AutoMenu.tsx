"use client";
import TranslatedContent from "@/components/TranslatedContent";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function AutoMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);
  function navigate() { setOpen(false); onNavigate?.(); }
  const links = [
    { href: "/#angebote", label: t({ de: "Alle Angebote", fr: "Toutes les offres" }) },
    { href: "/fahrstunde", label: t({ de: "Fahrstunde", fr: "Leçon de conduite" }) },
    { href: "/5er-abo", label: t({ de: "5er-Abo", fr: "Abonnement 5 leçons" }) },
    { href: "/vku", label: t({ de: "VKU", fr: "ECR" }) },
    { href: "/nothelferkurs", label: t({ de: "Nothelfer", fr: "Premiers secours" }) },
    { href: "/#ablauf", label: t({ de: "Ausbildung und Ablauf", fr: "Formation et étapes" }) },
    { href: "/#faq", label: t({ de: "Häufige Fragen", fr: "Questions fréquentes" }) },
  ];
  return <TranslatedContent>
    <div ref={root} className={mobile ? "relative" : "relative shrink-0"} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape" && open) { event.stopPropagation(); setOpen(false); button.current?.focus(); } }}>
      <button ref={button} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)} className={`flex min-h-11 items-center gap-2 font-semibold transition hover:text-accent-dark ${mobile ? "w-full justify-between" : "px-1"}`}>
        Auto
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && <div id={id} className={mobile ? "mt-1 rounded-2xl border border-ink/10 bg-white p-2" : "absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 rounded-2xl border border-ink/10 bg-white p-2 shadow-xl"}>
        <Link href="/auto" onClick={navigate} className="block rounded-xl bg-accent-soft px-4 py-3 text-ink transition hover:bg-accent/20">
          <span className="block text-sm font-bold">{t({ de: "Auto · Kategorie B", fr: "Auto · Catégorie B" })}</span>
          <span className="mt-1 block whitespace-normal text-xs text-ink/60">{t({ de: "Schritt für Schritt zum Führerausweis", fr: "Ton permis, étape par étape" })} →</span>
        </Link>
        <div className="mt-2 flex flex-col">{links.map(link => <Link key={link.href} href={link.href} onClick={navigate} className="flex min-h-11 items-center justify-between rounded-xl px-4 py-2 text-left text-sm transition hover:bg-surface-2 hover:text-accent-dark">{link.label}<span aria-hidden="true">→</span></Link>)}</div>
      </div>}
    </div>
  </TranslatedContent>;
}
