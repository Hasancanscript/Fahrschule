"use client";
import { translateUi } from "@/lib/ui-translations";
import { useLanguage } from "@/lib/i18n";
import TranslatedContent from "@/components/TranslatedContent";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import LogoutIcon from "@/components/LogoutIcon";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { bookingDate, bookingRange, upcomingBookings, type CustomerAccount, type CustomerBooking } from "@/lib/customer";
import { formatPrice } from "@/lib/pricing";
import BookingCard from "@/components/customer/BookingCard";
import BookingGroups from "@/components/customer/BookingGroups";
import SlotPicker from "@/components/customer/SlotPicker";
import PortalIcon from "@/components/customer/PortalIcon";
import CustomerGifts from "@/components/customer/CustomerGifts";
import CustomerNotifications from "@/components/customer/CustomerNotifications";
import AboBalance from "@/components/customer/AboBalance";
import { MAX_BOOKING_SLOTS } from "@/lib/validation";
type Service = { id: string; publicKey: string | null; name: string; description: string | null; durationMin: number; discountedPriceCents: number; discountPercent: number };
type Slot = { id: string; startTime: string; endTime: string };
type OfferPackage = { id: string; publicKey: string | null; name: string; lessonsTotal: number; discountedPriceCents: number; discountPercent: number };
type View = "overview" | "bookings" | "book" | "packages" | "gifts";
const INPUT = "mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base outline-none focus:border-accent-dark focus:ring-2 focus:ring-accent-dark/15";
const BUTTON = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-action-green px-5 py-3 text-sm font-bold text-white transition hover:bg-action-green/90 disabled:opacity-50";
class AccountError extends Error { constructor(message: string, public status = 0) { super(message); } }
async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new AccountError(data?.error ?? "Die Daten konnten nicht geladen werden. Bitte versuche es erneut.", response.status);
  return data;
}
function BookingContent() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const intent = searchParams.get("offer");
  const requestedView = searchParams.get("view");
  const appliedIntent = useRef<string | null>(null);
  const [packageOfferId, setPackageOfferId] = useState("");
  const [now, setNow] = useState(0);
  const [account, setAccount] = useState<CustomerAccount | null>(null); const [services, setServices] = useState<Service[]>([]); const [slots, setSlots] = useState<Slot[]>([]); const [packages, setPackages] = useState<OfferPackage[]>([]);
  const [view, setView] = useState<View>(() => searchParams.get("view") === "gifts" ? "gifts" : "overview"); const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- open the gift view when navigating to its account link
    if (requestedView === "gifts") setView("gifts");
  }, [requestedView]);
  const [fetching, setFetching] = useState(true); const [loadError, setLoadError] = useState<AccountError | null>(null); const [pending, setPending] = useState(false); const [downloading, setDownloading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null);
  const [serviceId, setServiceId] = useState(""); const [slotIds, setSlotIds] = useState<string[]>([]); const [packageId, setPackageId] = useState(""); const [notes, setNotes] = useState("");
  const loadData = useCallback(async () => {
    setFetching(true); setLoadError(null);
    try {
      const [nextAccount, nextServices, nextSlots, nextPackages] = await Promise.all([
        fetch("/api/account", { cache: "no-store" }).then(readResponse<CustomerAccount>), fetch("/api/services", { cache: "no-store" }).then(readResponse<Service[]>), fetch("/api/slots", { cache: "no-store" }).then(readResponse<Slot[]>), fetch("/api/packages", { cache: "no-store" }).then(readResponse<OfferPackage[]>),
      ]);
      setNow(Date.now()); setAccount(nextAccount); setServices(nextServices); setSlots(nextSlots); setSlotIds(current => current.filter(id => nextSlots.some(slot => slot.id === id))); setPackages(nextPackages);
      if (intent && appliedIntent.current !== intent) {
        appliedIntent.current = intent;
        setView("book");
        if (intent === "pack5") {
          const offer = nextPackages.find(p => p.publicKey === "pack5") ?? nextPackages.find(p => p.lessonsTotal === 5);
          if (offer) { setPackageOfferId(offer.id); setServiceId(""); }
          else setMessage({ error: true, text: "Das 5er-Abo ist momentan nicht verfügbar. Bitte wähle ein anderes Angebot oder kontaktiere uns." });
        } else if (intent === "single") {
          const offer = nextServices.find(s => s.publicKey === "single") ?? nextServices.find(s => /fahrstunde/i.test(s.name));
          if (offer) { setServiceId(offer.id); setPackageOfferId(""); }
          else setMessage({ error: true, text: "Die Fahrstunde ist momentan nicht verfügbar. Bitte kontaktiere uns." });
        }
      }
    } catch (error) { setLoadError(error instanceof AccountError ? error : new AccountError("Keine Verbindung. Bitte prüfe deine Internetverbindung und versuche es erneut.")); }
    finally { setFetching(false); }
  }, [intent]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial customer data request
    void loadData();
    const refresh = () => { if (document.visibilityState === "visible") void loadData(); };
    const timer = window.setInterval(refresh, 30000); window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [loadData]);
  async function book(event: React.FormEvent) {
    event.preventDefault(); if (pending || packageOfferId || !effectiveServiceId || !slotIds.length || slotIds.length > maxSelections) return; setPending(true); setMessage(null);
    try {
      await readResponse(await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId: effectiveServiceId, slotIds, notes, userPackageId: packageId || undefined, expectedPriceCents: packageId ? undefined : selectedService?.discountedPriceCents }) }));
      setServiceId(""); setSlotIds([]); setPackageId(""); setNotes(""); setFilter("upcoming"); setView("bookings");
      setMessage({ error: false, text: slotIds.length === 1 ? "Deine Terminanfrage ist eingegangen. Du siehst den Status unter „Meine Buchungen“ und kannst die Buchung als PDF herunterladen." : lang === "fr" ? `${slotIds.length} demandes de rendez-vous ont été enregistrées. Tu retrouves tous les créneaux sous « Mes réservations ».` : `${slotIds.length} Terminanfragen sind eingegangen. Du findest alle Termine unter „Meine Buchungen“.` });
      await loadData();
    } catch (error) { setMessage({ error: true, text: error instanceof Error ? error.message : "Die Buchung konnte nicht gespeichert werden." }); await loadData(); }
    finally { setPending(false); }
  }
  async function buyPackage(id: string) {
    if (pending || !window.confirm(translateUi("Möchtest du dieses Abo verbindlich bestellen? Die Bezahlung erfolgt direkt bei der Fahrschule.", lang))) return;
    setPending(true); setMessage(null);
    try { await readResponse(await fetch("/api/my-packages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packageId: id, expectedPriceCents: packages.find(p => p.id === id)?.discountedPriceCents }) })); setPackageOfferId(""); setView("packages"); setMessage({ error: false, text: "Dein Abo wurde erfasst. Unter „Meine Abos“ kannst du jetzt eine Fahrstunde mit deinem Guthaben buchen. Vereinbare die Bezahlung direkt mit der Fahrschule." }); await loadData(); }
    catch (error) { setMessage({ error: true, text: error instanceof Error ? error.message : "Das Abo konnte nicht gespeichert werden." }); await loadData(); }
    finally { setPending(false); }
  }
  async function download(booking: CustomerBooking) {
    if (downloading) return; setDownloading(`${booking.kind}:${booking.id}`);
    try {
      const response = await fetch(`/api/account/bookings/${booking.kind}/${encodeURIComponent(booking.id)}/pdf?lang=${lang}`, { cache: "no-store" });
      if (!response.ok) await readResponse(response);
      const blob = await response.blob(); if (!response.headers.get("content-type")?.includes("application/pdf")) throw new Error("Das PDF konnte nicht erstellt werden.");
      const url = URL.createObjectURL(blob), link = document.createElement("a"); link.href = url; link.download = `${lang === "fr" ? "Reservation" : "Buchung"}-${booking.kind}-${booking.startTime.slice(0, 10)}.pdf`; document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { setMessage({ error: true, text: error instanceof Error ? error.message : "Der PDF-Download ist fehlgeschlagen. Bitte versuche es erneut." }); }
    finally { setDownloading(null); }
  }
  function bookingChanged(text: string) { setMessage({ error: false, text }); void loadData(); }
  async function logout() { await signOut({ redirectTo: "/" }); }
  const upcoming = upcomingBookings(account?.bookings ?? [], now), next = upcoming[0];
  const usablePackages = account?.packages.filter(p => p.lessonsRemaining > 0) ?? [];
  const selectedPackage = packages.find(p => p.id === packageOfferId);
  const defaultLesson = services.find(s => s.publicKey === "single") ?? services.find(s => /fahrstunde/i.test(s.name)) ?? services.find(s => s.durationMin === 45);
  const effectiveServiceId = serviceId || (packageId ? defaultLesson?.id ?? "" : "");
  const selectedService = services.find(s => s.id === effectiveServiceId);
  const selectedSlots = slots.filter(s => slotIds.includes(s.id));
  const selectedCredit = usablePackages.find(p => p.id === packageId);
  const maxSelections = packageId ? Math.min(selectedCredit?.lessonsRemaining ?? 0, MAX_BOOKING_SLOTS) : MAX_BOOKING_SLOTS;
  const visibleBookings = (account?.bookings ?? []).filter(b => filter === "all" || (filter === "upcoming" ? upcoming.some(next => next.id === b.id && next.kind === b.kind) : !upcoming.some(next => next.id === b.id && next.kind === b.kind)));
  if (filter !== "upcoming") visibleBookings.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  return <TranslatedContent>{<div lang="de" className="bg-surface-2 py-8 text-ink sm:py-12"><div className="site-container">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-accent-dark">Dein Kundenbereich</p><h1 className="mt-2 text-3xl font-extrabold">{account ? `Hallo ${account.user.name.split(" ")[0]}` : "Dein Konto"}</h1><p className="mt-3 text-sm text-ink/60">Deine Termine, Buchungen, Abos und Gutscheine. Alles an einem Ort.</p></div><div className="flex flex-wrap items-center gap-3"><Link href="/" className="rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold">Zur Webseite</Link><button type="button" onClick={logout} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-action-blue px-4 py-2.5 text-sm font-semibold text-action-blue transition hover:bg-action-blue/5"><LogoutIcon /> Abmelden</button></div></header>
    <nav aria-label="Kundenbereich" className="my-7 flex flex-wrap gap-2">{[{ id: "overview" as View, label: "Übersicht", icon: "person" as const }, { id: "bookings" as View, label: "Meine Buchungen", icon: "calendar" as const }, { id: "book" as View, label: "Fahrstunde buchen", icon: "arrow" as const }, { id: "packages" as View, label: "Meine Abos", icon: "wallet" as const }, { id: "gifts" as View, label: "Meine Gutscheine", icon: "document" as const }].map(tab => <button key={tab.id} type="button" aria-pressed={view === tab.id} onClick={() => {
      setView(tab.id);
      const url = new URL(window.location.href);
      url.searchParams.delete("offer");
      if (tab.id === "gifts") url.searchParams.set("view", "gifts");
      else url.searchParams.delete("view");
      router.replace(url.pathname + url.search, { scroll: false });
    }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${view === tab.id ? "border-accent-dark bg-action-green text-white" : "border-ink/10 bg-white text-ink/70 hover:border-accent-dark"}`}><PortalIcon name={tab.icon} className="h-4 w-4" />{tab.label}</button>)}</nav>
    {message && <div role={message.error ? "alert" : "status"} className={`mb-5 flex items-start justify-between gap-3 rounded-xl border p-4 text-sm ${message.error ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-accent-dark"}`}><p>{message.text}</p><button type="button" aria-label="Mitteilung schliessen" onClick={() => setMessage(null)} className="shrink-0 px-1 font-bold">×</button></div>}
    {loadError && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p>{loadError.message}</p><div className="mt-3 flex gap-4"><button type="button" disabled={fetching} onClick={() => void loadData()} className="font-semibold underline">Erneut laden</button>{loadError.status === 401 && <Link href="/login?next=/booking" className="underline">Zur Anmeldung</Link>}</div></div>}
    {!account && fetching && <p role="status" className="rounded-2xl bg-white p-8 text-sm text-ink/60">Dein Kundenbereich wird geladen …</p>}
    {account && <>
      <CustomerNotifications onOpen={nextView => { setView(nextView); if (nextView === "bookings") setFilter("all"); }} />
      <AboBalance account={account} onBook={id => { setPackageId(id); setPackageOfferId(""); setServiceId(defaultLesson?.id ?? ""); setSlotIds([]); setView("book"); }} />
      {view === "overview" && <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"><section className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-dark"><PortalIcon name="calendar" /></span><h2 className="text-lg font-bold">Dein nächster Termin</h2></div>{next ? <div className="mt-6"><BookingCard booking={next} pending={downloading === `${next.kind}:${next.id}`} onDownload={download} now={now} onChanged={bookingChanged} /><button type="button" onClick={() => setView("bookings")} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent-dark">Alle Buchungen ansehen <PortalIcon name="arrow" className="h-4 w-4" /></button></div> : <div className="py-8"><h3 className="text-xl font-bold">Bereit für deine nächste Fahrstunde?</h3><p className="mt-3 text-sm leading-relaxed text-ink/60">Du hast momentan keinen bevorstehenden Termin. Wähle einen freien Termin, der dir passt.</p><button type="button" onClick={() => setView("book")} className={`${BUTTON} mt-6`}>Fahrstunde buchen <PortalIcon name="arrow" className="h-4 w-4" /></button></div>}</section>
        <aside className="space-y-5"><div className="grid grid-cols-2 gap-4"><button onClick={() => setView("bookings")} className="rounded-2xl border border-ink/10 bg-white p-5 text-left"><p className="text-3xl font-extrabold">{upcoming.length}</p><p className="mt-2 text-xs text-ink/60">Bevorstehende Termine</p></button><button onClick={() => setView("packages")} className="rounded-2xl border border-ink/10 bg-white p-5 text-left"><p className="text-3xl font-extrabold text-accent-dark">{usablePackages.reduce((sum, p) => sum + p.lessonsRemaining, 0)}</p><p className="mt-2 text-xs text-ink/60">Fahrstunden im Abo übrig</p></button></div><section className="rounded-2xl border border-ink/10 bg-white p-6"><h2 className="font-bold">Was möchtest du machen?</h2><div className="mt-4 space-y-3"><button onClick={() => setView("book")} className="flex w-full items-center justify-between rounded-xl bg-surface-2 p-4 text-left text-sm font-semibold">Fahrstunde buchen <PortalIcon name="arrow" className="h-4 w-4" /></button><Link href="/vku" className="flex items-center justify-between rounded-xl bg-surface-2 p-4 text-sm font-semibold">VKU-Kurs buchen <PortalIcon name="arrow" className="h-4 w-4" /></Link><Link href="/nothelferkurs" className="flex items-center justify-between rounded-xl bg-surface-2 p-4 text-sm font-semibold">Nothelferkurs buchen <PortalIcon name="arrow" className="h-4 w-4" /></Link></div></section><section className="rounded-2xl bg-accent-soft p-6"><h2 className="font-bold">Wir sind für dich da</h2><p className="mt-2 text-sm leading-relaxed text-ink/65">Fragen zur Buchung oder zum Treffpunkt? Melde dich direkt bei der Fahrschule.</p><a href="tel:+41787778161" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent-dark">078 777 81 61 <PortalIcon name="arrow" className="h-4 w-4" /></a></section></aside>
      </div>}
      {view === "gifts" && <CustomerGifts />}
      {view === "bookings" && <section><h2 className="text-xl font-bold">Meine Buchungen</h2><p className="mt-2 text-sm text-ink/60">Fahrstunden und Kurse mit allen Details. Lade jede Buchung als PDF herunter.</p><div className="my-5 flex flex-wrap gap-2">{[{ id: "upcoming" as const, text: "Bevorstehend" }, { id: "past" as const, text: "Vergangen & storniert" }, { id: "all" as const, text: "Alle Buchungen" }].map(item => <button type="button" key={item.id} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${filter === item.id ? "border-accent-dark bg-accent-soft text-accent-dark" : "border-ink/15 bg-white"}`}>{item.text}</button>)}</div>{visibleBookings.length ? <BookingGroups bookings={visibleBookings} downloading={downloading} onDownload={download} now={now} onChanged={bookingChanged} /> : <div className="rounded-2xl border border-ink/10 bg-white p-8"><p className="text-sm text-ink/60">Hier gibt es noch keine Buchungen.</p><button type="button" onClick={() => setView("book")} className={`${BUTTON} mt-5`}>Fahrstunde buchen</button></div>}</section>}
      {view === "book" && <section className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]"><div><h2 className="text-xl font-bold">Deine nächste Fahrstunde</h2><p className="mt-2 text-sm text-ink/60">Angebot wählen, freien Termin finden und Buchung anfragen.</p><form onSubmit={book} className="mt-5 rounded-2xl border border-ink/10 bg-white p-6 sm:p-8"><fieldset disabled={pending || !!loadError} className="space-y-6"><div><label htmlFor="booking-service" className="text-sm font-semibold">1. Welches Angebot möchtest du buchen?</label><select id="booking-service" required className={INPUT} value={packageOfferId ? `package:${packageOfferId}` : effectiveServiceId} onChange={e => { const value = e.target.value; setPackageOfferId(value.startsWith("package:") ? value.slice(8) : ""); setServiceId(value.startsWith("package:") ? "" : value); if (value.startsWith("package:")) { setPackageId(""); setSlotIds([]); } }}><option value="">Angebot auswählen</option><optgroup label="Einzelangebote">{services.map(s => <option key={s.id} value={s.id}>{s.name} · {s.durationMin} Min. · {formatPrice(s.discountedPriceCents)}</option>)}</optgroup><optgroup label="Fahrstunden-Abos">{packages.map(p => <option key={p.id} value={`package:${p.id}`}>{p.name} · {p.lessonsTotal} Fahrstunden · {formatPrice(p.discountedPriceCents)}</option>)}</optgroup></select>{selectedService?.description && <p className="mt-2 text-xs leading-relaxed text-ink/60">{selectedService.description}</p>}</div>{selectedPackage ? <div className="rounded-xl bg-surface-2 p-5"><h3 className="text-lg font-bold">{selectedPackage.name}</h3><p className="mt-2 text-sm">{selectedPackage.lessonsTotal} Fahrstunden zum Gesamtpreis von <strong>{formatPrice(selectedPackage.discountedPriceCents)}</strong>.</p><p className="mt-3 text-sm text-ink/60">Bestelle zuerst dein Abo. Danach wählst du unter „Meine Abos“ einen oder mehrere Fahrstunden-Termine aus und verwendest dein Guthaben.</p><button type="button" disabled={pending || !!loadError} className={`${BUTTON} mt-5 w-full`} onClick={() => buyPackage(selectedPackage.id)}>{pending ? "Abo wird gespeichert …" : "Abo verbindlich bestellen"}</button><p className="mt-3 text-xs text-ink/60">Die Bezahlung erfolgt direkt bei der Fahrschule.</p></div> : <><SlotPicker multiple slots={slots} value={slotIds} onChange={setSlotIds} maxSelections={maxSelections} label="2. Wann passt es dir?" name="booking-slot" />{!slots.length && <p className="text-sm text-ink/60">Aktuell gibt es keine freien Termine. <a href="tel:+41787778161" className="underline">Ruf uns an</a>, um einen Termin zu vereinbaren.</p>}{usablePackages.length > 0 && <div><label htmlFor="booking-package" className="text-sm font-semibold">3. Möchtest du dein Abo verwenden?</label><select id="booking-package" value={packageId} onChange={e => { const id = e.target.value; setPackageId(id); if (id && !serviceId) setServiceId(defaultLesson?.id ?? ""); const limit = Math.min(usablePackages.find(p => p.id === id)?.lessonsRemaining ?? MAX_BOOKING_SLOTS, MAX_BOOKING_SLOTS); setSlotIds(current => current.slice(0, limit)); }} className={INPUT}><option value="">Einzelbuchung · direkt bei der Fahrschule bezahlen</option>{usablePackages.map(p => <option key={p.id} value={p.id}>{p.name} · {p.lessonsRemaining} Fahrstunden übrig</option>)}</select></div>}<div><label htmlFor="booking-notes" className="text-sm font-semibold">Möchtest du uns etwas mitteilen? <span className="font-normal text-ink/50">(optional)</span></label><textarea id="booking-notes" maxLength={2000} className={INPUT} rows={3} placeholder="Zum Beispiel eine Frage oder ein Wunsch zum Treffpunkt" value={notes} onChange={e => setNotes(e.target.value)} /></div><div className="rounded-xl bg-surface-2 p-4"><p className="text-sm font-bold">Deine Auswahl</p><p className="mt-2 text-sm text-ink/65">{selectedService ? selectedService.name : "Noch kein Angebot gewählt"}</p>{selectedSlots.map(slot => <p key={slot.id} className="mt-1 text-sm text-ink/65">{bookingDate(slot.startTime, lang)} · {bookingRange(slot, lang)}</p>)}<p className="mt-3 font-bold text-accent-dark">{packageId ? lang === "fr" ? `${slotIds.length} leçon${slotIds.length === 1 ? "" : "s"} de ton abonnement` : `${slotIds.length} Fahrstunde${slotIds.length === 1 ? "" : "n"} aus deinem Abo` : selectedService ? formatPrice(selectedService.discountedPriceCents * Math.max(slotIds.length, 1)) : "Preis nach Angebotsauswahl"}</p><p className="mt-2 text-xs leading-relaxed text-ink/60">{packageId ? lang === "fr" ? `${slotIds.length} leçon(s) seront déduites après la réservation. Il restera ${(selectedCredit?.lessonsRemaining ?? 0) - slotIds.length} leçon(s).` : `Bei erfolgreicher Buchung ${slotIds.length === 1 ? "wird eine Fahrstunde" : "werden " + slotIds.length + " Fahrstunden"} vom Guthaben abgezogen. Danach bleiben ${(selectedCredit?.lessonsRemaining ?? 0) - slotIds.length} Fahrstunden übrig.` : "Die Zahlung erfolgt direkt bei der Fahrschule. Hier wird keine Online-Zahlung ausgelöst."}</p></div><button disabled={pending || !effectiveServiceId || !slotIds.length || slotIds.length > maxSelections || selectedSlots.length !== slotIds.length || !!loadError} type="submit" className={`${BUTTON} w-full`}>{pending ? "Buchung wird gespeichert …" : slotIds.length > 1 ? (lang === "fr" ? `Demander ${slotIds.length} rendez-vous` : `${slotIds.length} Termine verbindlich anfragen`) : "Termin verbindlich anfragen"}</button><p className="text-xs leading-relaxed text-ink/60">Die Anfrage erscheint anschliessend unter „Meine Buchungen“. Der Termin ist bestätigt, sobald die Fahrschule ihn bestätigt hat.</p></>}</fieldset></form></div><aside className="rounded-2xl bg-accent-soft p-6"><h3 className="font-bold">Du suchst einen Kurs?</h3><p className="mt-2 text-sm text-ink/65">VKU und Nothelferkurs buchst du direkt auf der jeweiligen Kursseite.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/vku" className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-accent-dark">Zum VKU</Link><Link href="/nothelferkurs" className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-accent-dark">Zum Nothelferkurs</Link></div></aside></section>}
      {view === "packages" && <section><h2 className="text-xl font-bold">Meine Abos</h2><p className="mt-2 text-sm text-ink/60">Hier siehst du dein Guthaben und kannst ein neues Abo bestellen.</p>{account.packages.length ? <div className="mt-5 grid gap-5 md:grid-cols-2">{account.packages.map(p => <article key={p.id} className="rounded-2xl border border-ink/10 bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold">{p.name}</h3><span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.lessonsRemaining ? "bg-accent-soft text-accent-dark" : "bg-ink/5 text-ink/60"}`}>{p.lessonsRemaining ? "Guthaben verfügbar" : "Aufgebraucht"}</span></div><p className="mt-5 text-3xl font-extrabold text-accent-dark">{p.lessonsRemaining}<span className="ml-2 text-sm font-normal text-ink/60">von {p.lessonsTotal} Fahrstunden übrig</span></p><progress aria-label={`Verbleibende Fahrstunden für ${p.name}`} value={p.lessonsRemaining} max={p.lessonsTotal || 1} className="mt-4 h-2 w-full accent-accent-dark" /><p className="mt-4 text-xs text-ink/60">{p.payment.status}{p.payment.remainingCents !== null && p.payment.remainingCents > 0 ? ` · Noch offen ${formatPrice(p.payment.remainingCents)}` : ""}</p>{p.lessonsRemaining > 0 && <button type="button" onClick={() => { setPackageId(p.id); setPackageOfferId(""); setServiceId((services.find(s => s.publicKey === "single") ?? services.find(s => /fahrstunde/i.test(s.name)))?.id ?? ""); setView("book"); }} className={`${BUTTON} mt-5`}>Fahrstunde mit Abo buchen</button>}</article>)}</div> : <p className="mt-5 rounded-2xl bg-white p-6 text-sm text-ink/60">Du hast noch kein Abo. Du kannst einzelne Fahrstunden buchen oder unten ein Abo auswählen.</p>}<h3 className="mt-9 text-lg font-bold">Ein neues Abo bestellen</h3><div className="mt-4 grid gap-5 md:grid-cols-2">{packages.map(p => <article key={p.id} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6"><h4 className="font-bold">{p.name}</h4><p className="mt-2 text-sm text-ink/60">{p.lessonsTotal} Fahrstunden{p.discountPercent > 0 ? ` · ${p.discountPercent} % Rabatt` : ""}</p><p className="mt-4 text-2xl font-extrabold">{formatPrice(p.discountedPriceCents)}</p><p className="mt-3 text-xs leading-relaxed text-ink/60">Gesamtpreis für das Abo. Die Bezahlung erfolgt direkt bei der Fahrschule.</p><button type="button" disabled={pending || !!loadError} onClick={() => buyPackage(p.id)} className={`${BUTTON} mt-5`}>{pending ? "Bitte warten …" : "Abo verbindlich bestellen"}</button></article>)}</div>{!packages.length && <p className="mt-3 text-sm text-ink/60">Momentan werden keine Abos angeboten.</p>}</section>}
      <p className="mt-8 text-xs text-ink/50">Angemeldet als <span className="break-all">{account.user.email}</span>{fetching ? " · Wird aktualisiert …" : ""}</p>
    </>}
  </div></div>}</TranslatedContent>;
}

export default function BookingPage() {
  return <TranslatedContent>{<Suspense fallback={<p className="p-8" role="status">Dein Kundenbereich wird geladen …</p>}><BookingContent /></Suspense>}</TranslatedContent>;
}
