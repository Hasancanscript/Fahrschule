"use client";
import { useLanguage } from "@/lib/i18n";
import TranslatedContent from "@/components/TranslatedContent";

import { bookingDate, bookingRange, bookingStatus, type CustomerBooking } from "@/lib/customer";
import { formatPrice } from "@/lib/pricing";
import BookingActions from "./BookingActions";
import PortalIcon from "./PortalIcon";
export default function BookingCard({ booking: b, pending, onDownload, now, onChanged, grouped = false }: { booking: CustomerBooking; grouped?: boolean; pending: boolean; now: number; onChanged: (message: string) => void; onDownload: (booking: CustomerBooking) => void }) {
  const { lang } = useLanguage();
  const Heading = grouped ? "h4" : "h3";
  const title = b.packageName ? b.title + " · " + b.packageName : b.title === "VKU" ? (lang === "fr" ? "Cours ECR (VKU)" : "VKU-Kurs") : b.title;
  return <TranslatedContent>{<article className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 md:row-span-7 md:grid md:grid-rows-subgrid md:gap-y-0">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="inline-flex rounded-md border border-ink/15 bg-white px-2 py-1 text-xs font-semibold text-action-blue">{b.packageName ? (lang === "fr" ? "Leçon avec abonnement" : "Abo-Fahrstunde") : b.kind === "lesson" ? (lang === "fr" ? "Leçon individuelle" : "Einzel-Fahrstunde") : (lang === "fr" ? "Cours" : "Kurs")}</p><Heading className="mt-2 text-lg font-bold">{title}</Heading></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${b.status === "CONFIRMED" ? "bg-accent-soft text-accent-dark" : b.status === "PENDING" ? "bg-amber-50 text-amber-800" : "bg-ink/5 text-ink/60"}`}>{bookingStatus[b.status] ?? b.status}</span></div>
    <div className="mt-5 flex gap-3 rounded-xl bg-surface-2 p-4"><PortalIcon name="calendar" className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" /><div><p className="text-sm font-bold">{bookingDate(b.startTime, lang)}</p><p className="mt-1 text-sm text-ink/65">{bookingRange(b, lang)} · Schweizer Ortszeit</p></div></div>
    <dl className="mt-4 text-sm"><dt className="text-xs font-semibold text-ink/50">Ort / Treffpunkt</dt><dd className="mt-1 break-words">{b.location || "Genauen Treffpunkt direkt mit dem Fahrlehrer vereinbaren."}</dd></dl>
    <div>{b.notes && <dl className="mt-3 text-sm"><dt className="text-xs font-semibold text-ink/50">Deine Anmerkungen</dt><dd translate="no" className="mt-1 whitespace-pre-wrap break-words">{b.notes}</dd></dl>}</div>
    <dl className="mt-3 text-sm"><dt className="text-xs font-semibold text-ink/50">{b.packageName ? "Abo" : "Zahlung"}</dt><dd className="mt-1">{b.packageName ? <><span>{lang === "fr" ? "Inclus dans " : "Im "}{b.packageName}{lang === "fr" ? "" : " enthalten"}</span>{b.packageRemaining != null && <span className="mt-2 block font-semibold text-action-blue">{b.packageRemaining} {lang === "fr" ? "leçon(s) encore disponibles dans cet abonnement" : "Fahrstunden in diesem Abo noch buchbar"}</span>}</> : <><span className="font-semibold">{b.payment.status}</span>{b.payment.totalCents !== null && <span className="mt-1 block text-xs text-ink/60">Gesamtpreis {formatPrice(b.payment.totalCents)} · Bezahlt {formatPrice(b.payment.paidCents)}{b.payment.remainingCents !== null && b.payment.remainingCents > 0 && b.status !== "CANCELLED" ? ` · Offen ${formatPrice(b.payment.remainingCents)}` : ""}</span>}</>}</dd></dl>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4"><button type="button" disabled={pending} onClick={() => onDownload(b)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-ink/15 px-4 py-2.5 text-sm font-semibold transition hover:border-accent-dark hover:text-accent-dark disabled:opacity-50"><PortalIcon name="document" className="h-4 w-4" />{pending ? "PDF wird erstellt …" : "Buchung als PDF"}</button><a href="tel:+41787778161" className="text-xs font-semibold text-ink/60 underline">Frage zum Termin?</a></div>
    <div>{b.status === "PENDING" && <p className="mt-3 text-xs text-amber-800">Deine Anfrage ist eingegangen. Die Fahrschule muss diesen Termin noch bestätigen.</p>}
    <details className="mt-4 text-xs text-ink/70"><summary className="min-h-8 cursor-pointer font-semibold">Buchungsnummer anzeigen</summary><p className="mt-2 break-all">{b.id}</p></details>
    <BookingActions booking={b} now={now} onChanged={onChanged} /></div>
  </article>}</TranslatedContent>;
}
