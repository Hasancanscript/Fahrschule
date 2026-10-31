"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { vkuCoursesUrl, type VkuView } from "@/lib/vku-courses";

// Kursübersicht aus SARI VKU/PGS in einem eigenen Rahmen. Das Innere gestaltet SARI;
// Kopfzeile, Umschalter, Schritte und Fusszeile sind unser Design.
// Die Anmeldung läuft direkt in SARI, Kundin/Kunde und Fahrschule erhalten eine Bestätigung per E-Mail.
export default function VkuCourses() {
  const { lang } = useLanguage();
  const t = (de: string, fr: string) => (lang === "fr" ? fr : de);
  const [view, setView] = useState<VkuView>("compact");
  const views: [VkuView, string][] = [
    ["compact", t("Übersicht", "Aperçu")],
    ["all", t("Alle Daten", "Toutes les dates")],
  ];
  // SARI-Tabellen sind nicht für schmale Bildschirme gebaut. Ist der Platz kleiner als die
  // nötige Breite, wird die Liste mit dieser Breite geladen und passend verkleinert.
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const needed = view === "compact" ? 430 : 720;
  const scale = width > 0 && width < needed ? width / needed : 1;
  const height = view === "compact" ? 416 : 640;

  const steps = [t("Kurs wählen", "Choisir un cours"), t("Zur Kursgruppe anmelden", "S’inscrire au groupe"), t("Bestätigung per E-Mail", "Confirmation par e-mail")];

  return (
    <div translate="no" className="-mx-6 overflow-hidden border-y border-ink/10 bg-white shadow-[0_24px_60px_-30px_rgba(8,72,204,0.45)] sm:mx-0 sm:rounded-3xl sm:border">
      {/* Kopfzeile */}
      <div className="flex flex-col gap-4 bg-ink px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-action-green opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-action-green" />
          </span>
          <div>
            <p className="font-jakarta text-base font-bold leading-tight">{t("Live-Termine", "Dates en direct")}</p>
            <p className="text-xs text-white/60">{t("Freie Plätze immer aktuell", "Places libres toujours à jour")}</p>
          </div>
        </div>
        <div role="tablist" aria-label={t("Ansicht", "Affichage")} className="hidden rounded-full bg-white/10 p-1 sm:inline-flex">
          {views.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={view === key}
              onClick={() => setView(key)}
              className={`min-h-9 rounded-full px-4 text-sm font-semibold transition ${view === key ? "bg-white text-ink" : "text-white/75 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Schritte */}
      <ol className="grid gap-2 border-b border-ink/10 bg-surface-2 px-5 py-3 text-sm sm:flex sm:flex-wrap sm:items-center sm:gap-x-3 sm:px-7">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2 text-ink/75">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-action-blue text-xs font-bold text-white">{i + 1}</span>
            {step}
            {i < steps.length - 1 && <span aria-hidden="true" className="ml-1 hidden text-ink/30 sm:inline">→</span>}
          </li>
        ))}
      </ol>

      {/* Kursliste von SARI */}
      <div ref={box} className="overflow-hidden sm:px-4 sm:pt-2" style={{ height }}>
        <iframe
          key={`${lang}-${view}`}
          src={vkuCoursesUrl(lang, view)}
          title={t("VKU-Kurstermine und Anmeldung", "Dates des cours de sensibilisation et inscription")}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="block origin-top-left"
          style={scale < 1 ? { width: needed, height: height / scale, transform: `scale(${scale})` } : { width: "100%", height }}
        />
      </div>

      {/* Fusszeile */}
      <div className="flex flex-col gap-3 border-t border-ink/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="text-sm text-ink/65">{t("Kein passender Termin dabei?", "Aucune date ne te convient ?")}</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/booking?offer=vku" className="inline-flex min-h-10 items-center rounded-full bg-action-blue px-4 text-sm font-semibold text-white transition hover:bg-action-blue-hover">
            {t("Anfrage senden", "Envoyer une demande")}
          </Link>
          <a href="https://wa.me/41787778161" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-full border border-ink/15 px-4 text-sm font-semibold text-ink transition hover:border-action-green hover:text-action-green">
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
