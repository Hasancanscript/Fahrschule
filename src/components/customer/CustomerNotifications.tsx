"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { bookingDate, bookingTime } from "@/lib/customer";
import { formatPrice } from "@/lib/pricing";
type Notice = { id: string; kind: string; title: string; view: "bookings" | "gifts" | "packages"; createdAt: string; detail: { startTime?: string; number?: string; amountCents?: number; remainingCents?: number; creditReturned?: boolean } };
export default function CustomerNotifications({ onOpen }: { onOpen: (view: "bookings" | "gifts" | "packages") => void }) {
 const { lang } = useLanguage();
 const fr = lang === "fr";
 const [notices, setNotices] = useState<Notice[]>([]);
 const [expanded, setExpanded] = useState(false);
 const [error, setError] = useState(false);
 const [busy, setBusy] = useState(false);
 const refreshVersion = useRef(0);
 const refresh = useCallback(async () => {
  const version = ++refreshVersion.current;
  try {
   const response = await fetch("/api/account/notifications", { cache: "no-store" });
   if (!response.ok) throw new Error();
   const data = await response.json();
   if (version === refreshVersion.current) { setNotices(data); setError(false); }
  } catch { if (version === refreshVersion.current) setError(true); }
 }, []);
 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial asynchronous request to the notification API
  void refresh();
  const focus = () => { if (document.visibilityState === "visible") void refresh(); };
  const timer = window.setInterval(focus, 30000);
  window.addEventListener("focus", focus);
  return () => { window.clearInterval(timer); window.removeEventListener("focus", focus); };
 }, [refresh]);
 async function acknowledge(ids: string[]) {
  setBusy(true);
  try {
   const response = await fetch("/api/account/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) });
   if (!response.ok) throw new Error();
   setNotices(current => current.filter(item => !ids.includes(item.id))); setError(false);
   await refresh();
  } catch { setError(true); }
  finally { setBusy(false); }
 }
 function text(item: Notice) {
  const title = fr ? item.title === "Fahrstunde" ? "Ta leçon de conduite" : item.title === "VKU-Kurs" ? "Ton cours ECR (VKU)" : item.title === "Nothelferkurs" ? "Ton cours de premiers secours" : item.title : item.title;
  switch (item.kind) {
   case "GIFT_PAID": return fr ? "Ton paiement est confirmé. Ton bon cadeau est prêt à télécharger." : "Deine Zahlung ist bestätigt. Dein Gutschein ist bereit zum Herunterladen.";
   case "GIFT_CANCELLED": return fr ? "Ta commande de bons cadeaux a été annulée." : "Deine Gutscheinbestellung wurde storniert.";
   case "GIFT_REDEEMED": return fr ? "Ton bon cadeau a été utilisé. Solde : " + formatPrice(item.detail.remainingCents ?? 0) : "Dein Gutschein wurde eingelöst. Restguthaben: " + formatPrice(item.detail.remainingCents ?? 0);
   case "BOOKING_CONFIRMED": return title + (fr ? " : rendez-vous confirmé." : ": Dein Termin wurde bestätigt.");
   case "BOOKING_CANCELLED": return title + (fr ? " : réservation annulée." : ": Deine Buchung wurde storniert.") + (item.detail.creditReturned ? fr ? " La leçon a été recréditée à ton abonnement." : " Die Fahrstunde wurde deinem Abo wieder gutgeschrieben." : "");
   case "BOOKING_COMPLETED": return title + (fr ? " : rendez-vous terminé. Merci !" : ": Dein Termin ist abgeschlossen. Vielen Dank!");
   case "BOOKING_PENDING": return title + (fr ? " : une nouvelle confirmation est en attente." : ": Deine Buchung wartet erneut auf Bestätigung.");
   case "PAYMENT_CONFIRMED": return fr ? "Ton paiement a été enregistré : " + formatPrice(item.detail.amountCents ?? 0) : "Deine Zahlung wurde erfasst: " + formatPrice(item.detail.amountCents ?? 0);
   case "PAYMENT_REFUNDED": return fr ? "Ton remboursement a été enregistré : " + formatPrice(item.detail.amountCents ?? 0) : "Deine Rückerstattung wurde erfasst: " + formatPrice(item.detail.amountCents ?? 0);
   default: return title;
  }
 }
 if (!notices.length && !error) return null;
 return <section lang={lang} aria-label={fr ? "Nouveautés de ton compte" : "Neuigkeiten zu deinem Konto"} className="mb-6 rounded-2xl border border-action-blue/20 bg-white p-5 sm:p-6">
  <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold">{fr ? "Nouveautés pour toi" : "Neuigkeiten für dich"}{notices.length > 0 && <span className="ml-2 inline-flex rounded-full bg-action-blue px-2.5 py-1 text-xs font-bold text-white">{notices.length}</span>}</h2>{notices.length > 1 && <button disabled={busy} onClick={() => void acknowledge(notices.map(item => item.id))} className="min-h-11 text-sm font-semibold text-action-blue underline disabled:opacity-50">{fr ? "Tout marquer comme lu" : "Alle als gelesen markieren"}</button>}</div>
  <div aria-live="polite" className="mt-3 divide-y divide-ink/10">{(expanded ? notices : notices.slice(0,3)).map(item => <article key={item.id} className="py-4 first:pt-1"><p className="text-sm font-semibold leading-relaxed">{text(item)}</p>{item.detail.startTime && <p className="mt-1 text-sm text-ink/65">{bookingDate(item.detail.startTime, lang)} · {bookingTime(item.detail.startTime)}</p>}{item.detail.number && <p translate="no" className="mt-1 break-all text-xs text-ink/65">{item.detail.number}</p>}<div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1"><button onClick={() => onOpen(item.view)} className="min-h-11 text-sm font-semibold text-action-blue underline">{item.view === "gifts" ? fr ? "Voir mes bons cadeaux" : "Meine Gutscheine ansehen" : item.view === "packages" ? fr ? "Voir mes abonnements" : "Meine Abos ansehen" : fr ? "Voir mes réservations" : "Meine Buchungen ansehen"}</button><button disabled={busy} onClick={() => void acknowledge([item.id])} className="min-h-11 text-xs font-semibold text-ink/60 underline disabled:opacity-50">{fr ? "Marquer comme lu" : "Als gelesen markieren"}</button><time dateTime={item.createdAt} className="text-xs text-ink/50">{new Intl.DateTimeFormat(fr ? "fr-CH" : "de-CH", { timeZone:"Europe/Zurich",day:"2-digit",month:"2-digit",year:"numeric" }).format(new Date(item.createdAt))}</time></div></article>)}</div>
  {notices.length > 3 && <button onClick={() => setExpanded(value => !value)} className="min-h-11 text-sm font-semibold text-action-blue">{expanded ? fr ? "Afficher moins" : "Weniger anzeigen" : fr ? "Afficher toutes les nouveautés" : "Alle Neuigkeiten anzeigen"}</button>}
  {error && <p role="alert" className="mt-3 text-sm">{fr ? "Impossible de mettre à jour les notifications." : "Die Meldungen konnten nicht aktualisiert werden."} <button onClick={() => void refresh()} className="min-h-11 text-action-blue underline">{fr ? "Réessayer" : "Erneut versuchen"}</button></p>}
 </section>;
}
