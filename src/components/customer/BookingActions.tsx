"use client";
import { useLanguage } from "@/lib/i18n";
import TranslatedContent from "@/components/TranslatedContent";

import { useId, useState } from "react";
import SlotPicker from "./SlotPicker";
import AccessibleDialog from "@/components/AccessibleDialog";
import { canChangeLesson, changeDeadline } from "@/lib/booking-policy";
import { bookingDate, bookingRange, bookingTime, type CustomerBooking } from "@/lib/customer";
type Slot = { id: string; startTime: string; endTime: string };
export default function BookingActions({ booking, now, onChanged }: { booking: CustomerBooking; now: number; onChanged: (message: string) => void }) {
  const { lang } = useLanguage();
  const explanationId = useId();
  const [action, setAction] = useState<"cancel" | "reschedule" | null>(null), [slots, setSlots] = useState<Slot[]>([]), [slotId, setSlotId] = useState("");
  const [pending, setPending] = useState(false), [loadingSlots, setLoadingSlots] = useState(false), [error, setError] = useState("");
  if (booking.kind !== "lesson" || !["PENDING", "CONFIRMED"].includes(booking.status)) return null;
  const allowed = canChangeLesson(booking.status, booking.startTime, now);
  async function open(next: "cancel" | "reschedule") {
    setAction(next); setError(""); setSlotId("");
    if (next === "reschedule") {
      setLoadingSlots(true); setSlots([]);
      try { const response = await fetch("/api/slots", { cache: "no-store" }); const data = await response.json(); if (!response.ok || !Array.isArray(data)) throw new Error("Freie Termine konnten nicht geladen werden. Bitte schliesse den Dialog und versuche es erneut."); setSlots(data); }
      catch (error) { setError(error instanceof Error ? error.message : "Bitte versuche es erneut."); }
      finally { setLoadingSlots(false); }
    }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); if (!action || pending) return; setPending(true); setError("");
    try {
      const response = await fetch(`/api/account/bookings/lesson/${encodeURIComponent(booking.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...(action === "reschedule" ? { slotId } : {}) }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Die Buchung konnte nicht geändert werden.");
      setAction(null); onChanged(action === "cancel" ? "Deine Fahrstunde wurde storniert. Verwendetes Abo-Guthaben wurde zurückgegeben. Bereits bezahltes Geld wird separat mit der Fahrschule abgerechnet." : "Deine Fahrstunde wurde umgebucht. Der neue Termin wartet auf die Bestätigung der Fahrschule. Preis, Zahlungen und Abo-Guthaben bleiben erhalten.");
    } catch (error) { setError(error instanceof Error ? error.message : "Bitte versuche es erneut."); }
    finally { setPending(false); }
  }
  const deadline = changeDeadline(booking.startTime);
  return <TranslatedContent>{<div className="mt-4 border-t border-ink/15 pt-4">
    {!allowed && <p className="mb-3 text-xs font-semibold text-ink/65">{lang === "fr" ? "Modification en ligne indisponible · délai de 24 heures" : "Online-Änderung nicht verfügbar · 24-Stunden-Frist"}</p>}
    <div className="flex flex-wrap gap-3">
      <button type="button" disabled={!allowed} aria-describedby={explanationId} onClick={() => void open("reschedule")} className="min-h-11 rounded-xl border border-action-blue px-4 py-2.5 text-sm font-semibold text-action-blue disabled:cursor-not-allowed disabled:border-ink/20 disabled:text-[#526057]">Termin ändern</button>
      <button type="button" disabled={!allowed} aria-describedby={explanationId} onClick={() => void open("cancel")} className="min-h-11 rounded-xl border border-action-blue px-4 py-2.5 text-sm font-semibold text-action-blue disabled:cursor-not-allowed disabled:border-ink/20 disabled:text-[#526057]">Stornieren</button>
    </div>
    <p id={explanationId} className="mt-3 text-xs leading-relaxed text-ink/70">{allowed ? (lang === "fr" ? "Modification ou annulation en ligne jusqu’au " + bookingDate(deadline, lang) + " à " + bookingTime(deadline) + " (24 heures avant le début)." : "Online ändern oder stornieren bis " + bookingDate(deadline, lang) + ", " + bookingTime(deadline) + " Uhr (24 Stunden vor Beginn).") : (lang === "fr" ? "Ce rendez-vous commence dans moins de 24 heures ou a déjà commencé. Une modification ou annulation est possible uniquement auprès de l’auto-école." : "Dieser Termin beginnt in weniger als 24 Stunden oder hat bereits begonnen. Änderungen und Absagen bitte direkt mit der Fahrschule vereinbaren.")}</p>
    {!allowed && <a href="tel:+41787778161" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-action-blue underline">{lang === "fr" ? "Contacter l’auto-école" : "Fahrschule kontaktieren"}</a>}
    <AccessibleDialog open={action !== null} title={action === "cancel" ? "Fahrstunde stornieren?" : "Fahrstunde umbuchen"} onClose={() => setAction(null)}>
      <p className="text-sm font-semibold">{booking.title}</p><p className="mt-1 text-sm text-ink/70">{bookingDate(booking.startTime, lang)} · {bookingRange(booking, lang)}</p>
      <form onSubmit={save} className="mt-5 space-y-4"><fieldset disabled={pending} className="space-y-4">{action === "cancel" ? <p className="text-sm leading-relaxed text-ink/70">Die Buchung wird aufgehoben und der Termin wieder freigegeben. Eine verwendete Abo-Fahrstunde wird zurückgegeben. Eine Geldrückzahlung erfolgt separat nach Absprache.</p> : <>{loadingSlots ? <p role="status">Termine werden geladen …</p> : <SlotPicker slots={slots} value={slotId} onChange={setSlotId} label="Neuen Termin auswählen" name="reschedule-slot" />}{!loadingSlots && !slots.length && !error && <p className="text-sm text-ink/70">Momentan sind keine freien Termine verfügbar. Bitte kontaktiere die Fahrschule.</p>}<p className="text-sm text-ink/70">Der neue Termin muss erneut bestätigt werden. Dein vereinbarter Preis und bereits erfasste Zahlungen bleiben erhalten.</p></>}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}<div className="flex flex-wrap gap-3"><button type="submit" disabled={pending || (action === "reschedule" && (!slotId || loadingSlots))} className={`min-h-11 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-50 ${action === "cancel" ? "bg-red-700" : "bg-action-green"}`}>{pending ? "Wird gespeichert …" : action === "cancel" ? "Ja, Fahrstunde stornieren" : "Umbuchung speichern"}</button><button type="button" disabled={pending} onClick={() => setAction(null)} className="min-h-11 rounded-xl border border-ink/30 px-4 py-3 text-sm font-semibold">{action === "cancel" ? "Buchung behalten" : "Abbrechen"}</button></div></fieldset></form>
    </AccessibleDialog>
  </div>}</TranslatedContent>;
}
