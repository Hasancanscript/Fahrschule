"use client";
import TranslatedContent from "@/components/TranslatedContent";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import AccessibleDialog from "@/components/AccessibleDialog";
const STORAGE_KEY = "fahrschule-cookie-settings-v1";
const CookieContext = createContext({ mapsAllowed: false, openSettings: () => {}, allowMaps: () => {} });
export function useCookieConsent() { return useContext(CookieContext); }
export function CookieSettingsButton() { const { openSettings } = useCookieConsent(); return <TranslatedContent>{<button type="button" onClick={openSettings} className="text-left text-sm leading-5 transition hover:text-accent-dark">Cookie-Einstellungen</button>}</TranslatedContent>; }
export default function CookieConsent({ children }: { children: React.ReactNode }) {
  const [mapsAllowed, setMapsAllowed] = useState(false), [mapsDraft, setMapsDraft] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => {
    let saved: { version?: number; maps?: boolean } | null = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"); } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load consent from this browser after hydration
    if (saved?.version === 1 && typeof saved.maps === "boolean") { setMapsAllowed(saved.maps); setMapsDraft(saved.maps); } else setOpen(true);
  }, []);
  function save(maps: boolean) {
    setMapsAllowed(maps); setMapsDraft(maps); setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, maps, savedAt: new Date().toISOString() })); } catch {}
  }
  function openSettings() { setMapsDraft(mapsAllowed); setOpen(true); }
  return <TranslatedContent>{<CookieContext.Provider value={{ mapsAllowed, openSettings, allowMaps: () => save(true) }}>{children}
    <AccessibleDialog open={open} onClose={() => setOpen(false)} title="Deine Cookie-Einstellungen">
      <p className="text-sm leading-relaxed text-ink/75">Für Anmeldung und Buchungen benötigen wir notwendige Cookies. Du entscheidest, ob zusätzlich die Google-Maps-Karte geladen werden darf. Ohne Zustimmung bleiben externe Karten ausgeschaltet.</p>
      <div className="mt-5 space-y-4"><div className="rounded-xl border border-ink/20 p-4"><p className="text-sm font-bold">Notwendige Funktionen · immer aktiv</p><p className="mt-1 text-sm text-ink/75">Cookies sichern deine Anmeldung und schützen den Kundenbereich. Sprache und Cookie-Auswahl werden im lokalen Browserspeicher gemerkt.</p></div><label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/20 p-4"><input type="checkbox" checked={mapsDraft} onChange={event => setMapsDraft(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-accent-dark" /><span><span className="block text-sm font-bold">Google Maps erlauben</span><span className="mt-1 block text-sm text-ink/75">Google kann technische Daten wie deine IP-Adresse erhalten und eigene Cookies setzen. Die Karte ist optional.</span></span></label></div>
      <p className="mt-4 text-sm leading-relaxed text-ink/75">Wir verwenden keine Analyse- oder Werbetracker. WhatsApp, Instagram und TikTok sind einfache Links und werden erst beim Anklicken geöffnet.</p>
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => save(false)} className="min-h-11 flex-1 rounded-xl border border-ink/40 px-4 py-3 text-sm font-bold">Nur notwendige</button><button type="button" onClick={() => save(mapsDraft)} className="min-h-11 flex-1 rounded-xl border border-accent-dark px-4 py-3 text-sm font-bold text-accent-dark">Auswahl speichern</button><button type="button" onClick={() => save(true)} className="min-h-11 flex-1 rounded-xl bg-action-green px-4 py-3 text-sm font-bold text-white">Alle erlauben</button></div>
      <p className="mt-5 text-xs leading-relaxed text-ink/75">Deine Auswahl kannst du jederzeit über „Cookie-Einstellungen“ im Footer ändern. <Link href="/cookies" className="underline">Cookie-Richtlinie</Link> · <Link href="/datenschutz" className="underline">Datenschutz</Link></p>
    </AccessibleDialog>
  </CookieContext.Provider>}</TranslatedContent>;
}
