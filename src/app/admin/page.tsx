"use client";
import TranslatedContent from "@/components/TranslatedContent";


import AdminPrices, { type CatalogueOffer } from "@/components/admin/AdminPrices";
import AdminGifts from "@/components/admin/AdminGifts"; import AdminBilling from "@/components/admin/AdminBilling";
import type { InvoiceRow } from "@/lib/billing";
import Link from "next/link";
import { useEffect, useState } from "react";
import { translateUi } from "@/lib/ui-translations";
import { useLanguage } from "@/lib/i18n";

type Service = CatalogueOffer & { durationMin: number };
type Package = CatalogueOffer & { lessonsTotal: number };
type Slot = { id: string; startTime: string; endTime: string };
type Booking = { id: string; status: string; notes: string | null; service: Service; slot: Slot; user: { name: string; email: string; phone?: string | null } };
type CourseDate = Slot & { capacity: number; location: string | null; seatsTaken: number; seatsLeft: number };
type Area = "overview" | "bookings" | "slots" | "courses" | "prices" | "billing" | "gifts";
type DateForm = { date: string; startTime: string; durationMin: number; capacity: number; location: string };

const AREAS: { id: Area; title: string; description: string }[] = [{ id: "gifts", title: "Gutscheine", description: "Verwalte Gutscheinbestellungen, Zahlungen und Einlösungen." },
  { id: "overview", title: "Übersicht", description: "Was steht an? Wähle hier deine nächste Aufgabe." },
  { id: "bookings", title: "Buchungen", description: "Hier siehst du gebuchte Fahrstunden. Bestätige neue Anfragen oder markiere erledigte Fahrstunden." },
  { id: "slots", title: "Fahrstunden-Termine", description: "Hier legst du freie Zeiten an. Deine Kundinnen und Kunden können diese anschliessend buchen." },
  { id: "courses", title: "Kurse", description: "Hier legst du VKU- und Nothelferkurs-Termine an und siehst, wie viele Plätze noch frei sind." },
  { id: "billing", title: "Abrechnung", description: "Erfasse Zahlungseingänge und Rückerstattungen. So siehst du, wie viel Geld du im ausgewählten Monat eingenommen hast." },
  { id: "prices", title: "Preise & Abos", description: "Hier erstellst du Angebote und Abos für den Buchungsbereich. Ein Angebot beschreibt die Fahrstunde: ein Termin bestimmt, wann sie stattfindet." },
];
const STATUS: Record<string, string> = { PENDING: "Neue Anfrage", CONFIRMED: "Bestätigt", COMPLETED: "Erledigt", CANCELLED: "Storniert" };
const INPUT = "mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent-dark focus:ring-2 focus:ring-accent-dark/15";
const BUTTON = "rounded-xl bg-action-green px-5 py-3 text-sm font-bold text-white transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-dark disabled:cursor-wait disabled:opacity-50";
const CARD = "rounded-2xl border border-ink/10 bg-white p-5 sm:p-7";

function formatDate(iso: string, lang: "de" | "fr") {
  return new Date(iso).toLocaleString(lang === "fr" ? "fr-CH" : "de-CH", { timeZone: "Europe/Zurich", weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function blankDate(course = false, nothelfer = false): DateForm {
  return { date: "", startTime: "", durationMin: course ? (nothelfer ? 480 : 180) : 45, capacity: 12, location: "" };
}

// Interpret entered dates in Swiss local time, including daylight-saving changes.
function datePayload(form: DateForm) {
  const target = new Date(`${form.date}T${form.startTime}:00Z`).getTime();
  if (!Number.isFinite(target) || !Number.isInteger(form.durationMin) || form.durationMin < 15) throw new Error("Bitte Datum, Startzeit und Dauer prüfen.");
  const formatter = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  let timestamp = target;
  for (let i = 0; i < 3; i++) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).map((part) => [part.type, part.value]));
    const local = Date.parse(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`);
    timestamp += target - local;
  }
  const parts = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).map((part) => [part.type, part.value]));
  if (`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}` !== `${form.date}T${form.startTime}`) throw new Error("Diese Uhrzeit gibt es wegen der Zeitumstellung nicht. Bitte eine andere Startzeit wählen.");
  if (timestamp <= Date.now()) throw new Error("Bitte einen Termin in der Zukunft wählen.");
  return { startTime: new Date(timestamp).toISOString(), endTime: new Date(timestamp + form.durationMin * 60000).toISOString() };
}

async function readResponse(response: Response, areaName = "Daten") {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error("Bitte melde dich erneut mit deinem Admin-Konto an.");
    throw new Error(data?.error || `${areaName} konnten nicht geladen oder gespeichert werden (Serverfehler ${response.status}). Bitte versuche es erneut.`);
  }
  if (data === null) throw new Error("Die Antwort konnte nicht gelesen werden. Bitte erneut versuchen.");
  return data;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <TranslatedContent>{<label className="block text-sm font-semibold text-ink">{label}{children}{hint && <span className="mt-1.5 block text-xs font-normal leading-relaxed text-ink/55">{hint}</span>}</label>}</TranslatedContent>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <TranslatedContent>{<p className="rounded-xl bg-surface-2 p-4 text-sm leading-relaxed text-ink/60">{children}</p>}</TranslatedContent>;
}
function DateFields({ value, onChange, course }: { value: DateForm; onChange: (value: DateForm) => void; course?: boolean }) {
  return <TranslatedContent>{<div className="grid gap-4 sm:grid-cols-2">
    <Field label="Datum"><input className={INPUT} required type="date" value={value.date} onChange={(e) => onChange({ ...value, date: e.target.value })} /></Field>
    <Field label="Startzeit" hint="Alle Zeiten gelten für die Schweiz."><input className={INPUT} required type="time" value={value.startTime} onChange={(e) => onChange({ ...value, startTime: e.target.value })} /></Field>
    <Field label="Dauer in Minuten" hint={course ? "Zum Beispiel 180 Minuten = 3 Stunden." : "Zum Beispiel 45 Minuten für eine Fahrstunde."}><input className={INPUT} required type="number" min={course ? 30 : 15} step={15} value={value.durationMin} onChange={(e) => onChange({ ...value, durationMin: Number(e.target.value) })} /></Field>
    {course && <>
      <Field label="Anzahl Plätze" hint="So viele Personen können sich anmelden."><input className={INPUT} required type="number" min={1} step={1} value={value.capacity} onChange={(e) => onChange({ ...value, capacity: Number(e.target.value) })} /></Field>
      <div className="sm:col-span-2"><Field label="Kursort (optional)"><input className={INPUT} type="text" placeholder="Zum Beispiel Aegertenstrasse 28, Biel" value={value.location} onChange={(e) => onChange({ ...value, location: e.target.value })} /></Field></div>
    </>}
  </div>}</TranslatedContent>;
}

export default function AdminPage() {
  const { lang } = useLanguage();
  const [area, setArea] = useState<Area>("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [courseDates, setCourseDates] = useState<CourseDate[]>([]);
  const [nothelferDates, setNothelferDates] = useState<CourseDate[]>([]);
  const [slotForm, setSlotForm] = useState(blankDate());
  const [courseForm, setCourseForm] = useState(blankDate(true));
  const [nothelferForm, setNothelferForm] = useState(blankDate(true, true));
  const [courseType, setCourseType] = useState<"vku" | "nothelfer">("vku");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ error: boolean; text: string } | null>(null);

  async function loadData() {
    setLoading(true);
    setLoadError(null);
    try {
      const sources = [["/api/bookings", "Buchungen"], ["/api/services", "Angebote"], ["/api/packages", "Abos"], ["/api/vku", "VKU-Termine"], ["/api/nothelferkurs", "Nothelferkurse"], ["/api/slots", "Fahrstunden-Termine"], ["/api/admin/invoices", "Abrechnungsdaten"]];
      const [b, s, p, v, n, available, payments] = await Promise.all(sources.map(async ([url, label]) => readResponse(await fetch(url, { cache: "no-store" }), label)));
      if (![b, s, p, v?.dates, n?.dates, available, payments].every(Array.isArray)) throw new Error("Die Übersicht konnte nicht vollständig geladen werden. Bitte erneut versuchen.");
      setBookings(b); setServices(s); setPackages(p); setCourseDates(v.dates); setNothelferDates(n.dates); setSlots(available); setInvoices(payments); setHasData(true);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Die Daten konnten nicht geladen werden.");
    } finally { setLoading(false); }
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    void loadData();
  }, []);

  function navigate(next: Area) { setArea(next); setNotice(null); }
  async function save(url: string, body: object, success: string, reset?: () => void, method = "POST") {
    if (pending) return false;
    setPending(true); setNotice(null);
    try {
      await readResponse(await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
      reset?.();
      setNotice({ error: false, text: success });
      await loadData();
      return true;
    } catch (error) { setNotice({ error: true, text: error instanceof Error ? error.message : "Speichern nicht möglich. Bitte erneut versuchen." }); return false; }
    finally { setPending(false); }
  }
  function createDate(e: React.FormEvent, form: DateForm, course?: "vku" | "nothelfer") {
    e.preventDefault();
    try {
      const times = datePayload(form);
      if (course && (!Number.isInteger(form.capacity) || form.capacity < 1)) throw new Error("Bitte mindestens einen Kursplatz angeben.");
      void save(course ? (course === "vku" ? "/api/vku" : "/api/nothelferkurs") : "/api/slots", { ...times, ...(course ? { capacity: form.capacity, location: form.location.trim() || undefined } : {}) }, course ? "Der Kurstermin ist gespeichert und kann jetzt gebucht werden." : "Der freie Fahrstunden-Termin ist gespeichert und kann jetzt gebucht werden.", () => course === "vku" ? setCourseForm(blankDate(true)) : course === "nothelfer" ? setNothelferForm(blankDate(true, true)) : setSlotForm(blankDate()));
    } catch (error) { setNotice({ error: true, text: error instanceof Error ? error.message : "Bitte die Eingaben prüfen." }); }
  }

  const current = AREAS.find((item) => item.id === area)!;
  const newRequests = bookings.filter((b) => b.status === "PENDING");
  const query = search.trim().toLocaleLowerCase("de-CH");
  const visibleBookings = bookings.filter((b) => (filter === "ALL" || b.status === filter) && `${b.user.name} ${b.user.email} ${b.service.name} ${translateUi(b.service.name, lang)}`.toLocaleLowerCase("de-CH").includes(query));
  const activeDates = courseType === "vku" ? courseDates : nothelferDates;
  const activeForm = courseType === "vku" ? courseForm : nothelferForm;
  const setActiveForm = courseType === "vku" ? setCourseForm : setNothelferForm;

  return <TranslatedContent>{<div className="min-h-[70vh] bg-surface-2 py-10 sm:py-14">
    <div className="site-container">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-widest text-accent-dark">Fahrschule fürs Leben</p><h1 className="mt-2 font-jakarta text-3xl font-extrabold text-ink sm:text-4xl">Deine Verwaltung</h1><p className="mt-3 text-sm leading-relaxed text-ink/60">Termine anbieten, Buchungen bearbeiten und Angebote erstellen.</p></div>
        <Link href="/" className="rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-accent-dark">Zur Website →</Link>
      </div>
      <nav aria-label="Verwaltungsbereiche" className="mt-8 flex flex-wrap gap-2">
        {AREAS.map((item) => <button type="button" key={item.id} disabled={pending} aria-current={area === item.id ? "page" : undefined} onClick={() => navigate(item.id)} className={`rounded-xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark disabled:opacity-50 ${area === item.id ? "border-accent-dark bg-action-green text-white" : "border-ink/10 bg-white text-ink/70 hover:border-accent-dark"}`}>{item.title}</button>)}
      </nav>
      <div className="mt-8"><h2 className="font-jakarta text-2xl font-bold text-ink">{current.title}</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink/60">{current.description}</p></div>
      <div aria-live="polite" aria-atomic="true">
        {notice && <p role={notice.error ? "alert" : "status"} className={`mt-5 rounded-xl border p-4 text-sm ${notice.error ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-accent-dark"}`}>{notice.text}</p>}
      </div>
      {area !== "gifts" && loading && <p role="status" className="mt-6 text-sm text-ink/60">Deine Übersicht wird geladen …</p>}
      {area !== "gifts" && loadError && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"><p>{loadError}</p><button type="button" disabled={loading || pending} onClick={() => void loadData()} className="mt-3 font-bold underline">Erneut laden</button>{loadError.includes("Admin-Konto") && <Link href="/login" className="ml-5 underline">Zur Anmeldung</Link>}</div>}
      {area === "gifts" && <div className="mt-6"><AdminGifts /></div>}{area !== "gifts" && (!loading || hasData) && !loadError && <div className="mt-6">
        {area === "overview" && <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ title: "Neue Fahrstunden-Anfragen", value: newRequests.length, text: "Diese Buchungen warten auf deine Bestätigung.", next: "bookings" as Area }, { title: "Freie Fahrstunden-Termine", value: slots.length, text: "Diese Zeiten können noch gebucht werden.", next: "slots" as Area }, { title: "Kommende Kurstermine", value: courseDates.length + nothelferDates.length, text: "VKU und Nothelferkurse mit ihren verfügbaren Plätzen.", next: "courses" as Area }].map((item) => <button key={item.title} type="button" onClick={() => { if (item.next === "bookings") setFilter("PENDING"); navigate(item.next); }} className={`${CARD} text-left transition hover:border-accent-dark focus-visible:outline-2 focus-visible:outline-accent-dark`}><p className="text-sm font-semibold text-ink/70">{item.title}</p><p className="mt-3 text-4xl font-extrabold text-ink">{item.value}</p><p className="mt-3 text-sm leading-relaxed text-ink/55">{item.text}</p><span className="mt-5 block text-sm font-bold text-accent-dark">Ansehen →</span></button>)}
          </div>
          <section className={`${CARD} mt-6`}><h3 className="text-lg font-bold">Was möchtest du machen?</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{[{ next: "slots" as Area, title: "Freien Fahrstunden-Termin anlegen", text: "Wähle Datum, Startzeit und Dauer." }, { next: "bookings" as Area, title: "Fahrstunden-Buchungen bearbeiten", text: "Bestätige Anfragen und prüfe Kundenhinweise." }, { next: "courses" as Area, title: "Einen Kurstermin anbieten", text: "Wähle VKU oder Nothelferkurs und die Anzahl Plätze." }, { next: "prices" as Area, title: "Ein Angebot oder Abo erstellen", text: "Lege fest, was Kunden buchen können und zu welchem Preis." }].map((item) => <button key={item.title} type="button" onClick={() => { if (item.next === "bookings") setFilter("ALL"); navigate(item.next); }} className="rounded-xl bg-surface-2 p-4 text-left transition hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent-dark"><span className="block text-sm font-bold text-ink">{item.title} →</span><span className="mt-1 block text-sm text-ink/60">{item.text}</span></button>)}</div></section>
        </>}
        {area === "bookings" && <>
          <div className={`${CARD} mb-5`}><div className="grid gap-4 sm:grid-cols-2"><Field label="Kunde oder Angebot suchen"><input className={INPUT} type="search" placeholder="Name, E-Mail oder Angebot" value={search} onChange={(e) => setSearch(e.target.value)} /></Field><Field label="Welche Buchungen anzeigen?"><select className={INPUT} value={filter} onChange={(e) => setFilter(e.target.value)}><option value="ALL">Alle Buchungen</option>{Object.entries(STATUS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field></div><p className="mt-4 text-xs leading-relaxed text-ink/60"><strong>Neue Anfrage:</strong> noch prüfen · <strong>Bestätigt:</strong> findet statt · <strong>Erledigt:</strong> Fahrstunde durchgeführt · <strong>Storniert:</strong> findet nicht statt, Termin wird wieder frei.</p><p className="mt-2 text-xs text-ink/60">Änderungen am Buchungsstatus werden sofort gespeichert.</p></div>
          {visibleBookings.length === 0 ? <Empty>{bookings.length === 0 ? "Noch keine Fahrstunden gebucht. Lege zuerst freie Termine an, damit deine Kunden buchen können." : "Keine Buchungen passen zu deiner Suche. Wähle einen anderen Status oder ändere den Suchtext."}</Empty> : <ul className="space-y-4">{visibleBookings.map((b) => <li key={b.id} className={CARD}><div className="grid gap-5 md:grid-cols-[1fr_1fr_220px]"><div><h3 translate="no" className="font-bold text-ink">{b.user.name}</h3><a href={`mailto:${b.user.email}`} className="mt-1 block break-all text-sm text-accent-dark hover:underline">{b.user.email}</a>{b.user.phone && <a href={`tel:${b.user.phone}`} className="mt-1 block text-sm text-ink/60 hover:underline">{b.user.phone}</a>}</div><div><p className="font-semibold text-ink">{b.service.name}</p><p className="mt-1 text-sm text-ink/60">{formatDate(b.slot.startTime, lang)}</p></div><Field label="Buchungsstatus"><select className={INPUT} disabled={pending || b.status === "CANCELLED"} value={b.status} onChange={(e) => { const status = e.target.value; if (status === "CANCELLED" && !window.confirm(lang === "fr" ? `Annuler vraiment la leçon de ${b.user.name} ? Le créneau sera libéré.` : `Fahrstunde von ${b.user.name} wirklich stornieren? Der Termin wird wieder frei.`)) return; void save(`/api/bookings/${b.id}`, { status }, `Der Status für ${b.user.name} wurde auf «${STATUS[status]}» geändert.`, undefined, "PATCH"); }}>{Object.entries(STATUS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{b.status === "CANCELLED" && <span className="mt-1 block text-xs font-normal text-ink/55">Für einen neuen Termin bitte neu buchen.</span>}</Field></div>{b.notes && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-surface-2 p-3 text-sm text-ink/70"><strong>Hinweis vom Kunden:</strong> <span translate="no">{b.notes}</span></p>}</li>)}</ul>}
        </>}
        {area === "slots" && <div className="grid items-start gap-6 lg:grid-cols-2"><section className={CARD}><h3 className="text-lg font-bold">Freien Fahrstunden-Termin anlegen</h3><p className="mt-2 text-sm leading-relaxed text-ink/60">Du reservierst hier noch niemanden. Der Termin wird im Buchungsbereich zur Auswahl angeboten.</p><form onSubmit={(e) => createDate(e, slotForm)} className="mt-5"><fieldset disabled={pending} className="space-y-5"><DateFields value={slotForm} onChange={setSlotForm} /><button className={BUTTON} type="submit">{pending ? "Wird gespeichert …" : "Termin für Buchungen freigeben"}</button></fieldset></form></section><section className={CARD}><h3 className="text-lg font-bold">Diese Termine sind noch frei</h3><p className="mb-4 mt-2 text-sm text-ink/60">Sobald ein Termin gebucht wird, findest du ihn unter „Buchungen“.</p>{slots.length === 0 ? <Empty>Noch keine freien Termine. Lege einen neuen Termin an.</Empty> : <ul className="divide-y divide-ink/10">{slots.map((slot) => <li key={slot.id} className="py-3"><p className="text-sm font-semibold">{formatDate(slot.startTime, lang)}</p><p className="mt-1 text-xs text-ink/55">{Math.round((new Date(slot.endTime).getTime() - new Date(slot.startTime).getTime()) / 60000)} Minuten · frei buchbar</p></li>)}</ul>}</section></div>}
        {area === "courses" && <>
          <div className="mb-5 flex flex-wrap gap-3">{[{ id: "vku" as const, name: "VKU", text: "Verkehrskundeunterricht" }, { id: "nothelfer" as const, name: "Nothelferkurs", text: "Erste Hilfe im Strassenverkehr" }].map((course) => <button key={course.id} type="button" aria-pressed={courseType === course.id} disabled={pending} onClick={() => { setCourseType(course.id); setNotice(null); }} className={`rounded-xl border px-5 py-3 text-left ${courseType === course.id ? "border-accent-dark bg-accent-soft" : "border-ink/10 bg-white"}`}><span className="block text-sm font-bold">{course.name}</span><span className="mt-1 block text-xs text-ink/60">{course.text}</span></button>)}</div>
          <div className="grid items-start gap-6 lg:grid-cols-2"><section className={CARD}><h3 className="text-lg font-bold">{courseType === "vku" ? "VKU-Termin" : "Nothelferkurs-Termin"} anlegen</h3><p className="mt-2 text-sm text-ink/60">Nach dem Speichern können sich Kunden für diesen Kurs anmelden.</p><form onSubmit={(e) => createDate(e, activeForm, courseType)} className="mt-5"><fieldset disabled={pending} className="space-y-5"><DateFields value={activeForm} onChange={setActiveForm} course /><button className={BUTTON} type="submit">{pending ? "Wird gespeichert …" : "Kurstermin veröffentlichen"}</button></fieldset></form></section><section className={CARD}><h3 className="text-lg font-bold">Kommende {courseType === "vku" ? "VKU-Termine" : "Nothelferkurse"}</h3><div className="mt-4">{activeDates.length === 0 ? <Empty>Noch kein kommender Kurs. Lege hier den nächsten Termin an.</Empty> : <ul className="space-y-3">{activeDates.map((course) => <li key={course.id} className="rounded-xl bg-surface-2 p-4"><p className="text-sm font-bold">{formatDate(course.startTime, lang)}</p>{course.location && <p className="mt-1 text-sm text-ink/60">{course.location}</p>}<div className="mt-3 flex flex-wrap justify-between gap-2 text-xs"><span className="text-ink/60">{course.seatsTaken} von {course.capacity} Plätzen belegt</span><span className={`font-bold ${course.seatsLeft === 0 ? "text-red-700" : "text-accent-dark"}`}>{course.seatsLeft === 0 ? "Ausgebucht" : `${course.seatsLeft} Plätze frei`}</span></div></li>)}</ul>}</div></section></div>
        </>}
        {area === "prices" && <AdminPrices services={services} packages={packages} pending={pending} onSave={save} />}
        {area === "billing" && <AdminBilling invoices={invoices} pending={pending} onSave={save} />}

      </div>}
    </div>
  </div>}</TranslatedContent>;
}
