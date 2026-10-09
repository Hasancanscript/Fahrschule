"use client";
import TranslatedContent from "@/components/TranslatedContent";


import { useOffers } from "@/lib/use-offers";
import { formatPrice } from "@/lib/pricing";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import OfferInfoIntro from "@/components/OfferInfoIntro";
import Link from "next/link";
import { motion } from "framer-motion";

type Topic = { title: string; text: string };

type CourseDate = {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  location: string | null;
  seatsTaken: number;
  seatsLeft: number;
  bookedByMe: boolean;
  myBookingId: string | null;
};

function formatWeekday(iso: string, lang: "de" | "fr") {
  return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-CH" : "de-CH", { weekday: "short" });
}

function formatDay(iso: string, lang: "de" | "fr") {
  return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-CH" : "de-CH", { day: "2-digit" });
}

function formatMonth(iso: string, lang: "de" | "fr") {
  return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-CH" : "de-CH", { month: "short" });
}

function formatDateLong(iso: string, lang: "de" | "fr") {
  return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-CH" : "de-CH", { timeZone: "Europe/Zurich", weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function formatTimeRange(start: string, end: string, lang: "de" | "fr") {
  const opts: Intl.DateTimeFormatOptions = { timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit" };
  return `${new Date(start).toLocaleTimeString(lang === "fr" ? "fr-CH" : "de-CH", opts)} ${lang === "fr" ? "à" : "bis"} ${new Date(end).toLocaleTimeString(lang === "fr" ? "fr-CH" : "de-CH", opts)}${lang === "fr" ? "" : " Uhr"}`;
}

export default function CourseInfoPage({
  apiBase,
  loginNext,
  imageSrc,
  imageAlt,
  badgeText = "★ Beliebt",
  eyebrow,
  title,
  description,
  topics,
  duration,
  offerKey,
  sectionEyebrow,
  sectionTitle,
}: {
  apiBase: string;
  loginNext: string;
  imageSrc: string;
  imageAlt: string;
  badgeText?: string;
  eyebrow: string;
  title: string;
  description: string;
  topics: Topic[];
  duration: string;
  offerKey: "vku" | "firstaid";
  sectionEyebrow: string;
  sectionTitle: string;
}) {
  const { lang } = useLanguage();
  const { offers, loading: pricesLoading } = useOffers();
  const offer = offers[offerKey];
  const price = offer ? formatPrice(offer.discountedPriceCents) : pricesLoading ? "…" : "Auf Anfrage";
  const originalPrice = offer && offer.discountPercent > 0 ? formatPrice(offer.priceCents) : undefined;
  const [dates, setDates] = useState<CourseDate[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function loadData() {
    const res = await fetch(apiBase);
    const data = await res.json();
    setDates(data.dates);
    setLoggedIn(data.loggedIn);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apiBase is static per page instance
  }, []);

  async function handleBook(courseDateId: string) {
    setMessage(null);
    setPendingId(courseDateId);

    const res = await fetch(`${apiBase}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseDateId, expectedPriceCents: offer?.discountedPriceCents ?? null }),
    });
    const data = await res.json();
    setPendingId(null);

    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? "Buchung fehlgeschlagen." });
      if (res.status === 409) window.dispatchEvent(new Event("focus"));
      return;
    }

    setMessage({ type: "success", text: "Dein Platz ist reserviert!" });
    loadData();
  }

  async function handleCancel(bookingId: string) {
    setMessage(null);
    setPendingId(bookingId);

    const res = await fetch(`${apiBase}/bookings/${bookingId}`, { method: "DELETE" });
    setPendingId(null);

    if (!res.ok) {
      setMessage({ type: "error", text: "Stornieren fehlgeschlagen." });
      return;
    }

    setMessage({ type: "success", text: "Deine Anmeldung wurde storniert." });
    loadData();
  }

  return <TranslatedContent>{(
    <div lang="de" className="bg-surface pb-24">
      <OfferInfoIntro
        imageSrc={imageSrc} imageAlt={imageAlt} badgeText={badgeText}
        eyebrow={eyebrow} title={title} description={description} topics={topics}
        ctaHref="#termine" ctaLabel="Anmelden"
        facts={[
          { label: "Dauer", value: offer?.durationMin ? `${offer.durationMin} Minuten` : duration },
          { label: "Preis", value: price, originalValue: originalPrice },
        ]}
      />

      <section id="termine" className="site-container mt-16 scroll-mt-28">
        <div className="mb-8 text-center">
          <span className="inline-block w-fit rounded-md bg-[#009fdf] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-ink">{sectionEyebrow}</span>
          <h2 className="mt-2 font-jakarta text-2xl font-extrabold text-ink sm:text-3xl">{sectionTitle}</h2>
        </div>
        {message && (
          <div
            className={`mb-6 rounded-2xl px-5 py-3 text-sm font-medium ${
              message.type === "error" ? "bg-red-50 text-red-700" : "bg-accent-soft text-accent-dark"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-3xl bg-surface-2" />
            ))}
          </div>
        ) : dates.length === 0 ? (
          <div className="rounded-3xl border border-ink/8 bg-card p-10 text-center shadow-sm">
            <p className="font-jakarta text-lg font-bold text-ink">Aktuell keine Termine geplant</p>
            <p className="mt-2 text-sm text-ink/55">
              Schreib uns auf WhatsApp, wir sagen dir den nächsten freien Kurstermin.
            </p>
            <a
              href="https://wa.me/41787778161"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover hover:text-white"
            >
              Auf WhatsApp schreiben
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {dates.map((d, i) => {
              const fillPct = Math.min((d.seatsTaken / d.capacity) * 100, 100);
              const full = d.seatsLeft <= 0 && !d.bookedByMe;
              const isPending = pendingId !== null && (pendingId === d.id || pendingId === d.myBookingId);

              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: (i % 6) * 0.06 }}
                  className="flex flex-col gap-5 rounded-3xl border border-ink/8 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-accent-soft px-5 py-3 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-accent-dark">
                      {formatWeekday(d.startTime, lang)}
                    </span>
                    <span className="font-jakarta text-2xl font-extrabold text-ink">{formatDay(d.startTime, lang)}</span>
                    <span className="text-[11px] font-medium text-ink/50">{formatMonth(d.startTime, lang)}</span>
                  </div>

                  <div className="flex-1">
                    <p className="font-jakarta text-base font-bold text-ink">{formatDateLong(d.startTime, lang)}</p>
                    <p className="mt-0.5 text-sm text-ink/55">
                      {formatTimeRange(d.startTime, d.endTime, lang)}
                      {d.location && ` · ${d.location}`}
                    </p>

                    <div className="mt-3 max-w-xs">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className={full ? "text-ink/40" : "text-accent-dark"}>
                          {full ? "Ausgebucht" : `${d.seatsLeft} von ${d.capacity} Plätzen frei`}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 sm:w-44">
                    {d.bookedByMe ? (
                      <div className="flex flex-col items-stretch gap-2">
                        <span className="rounded-full bg-accent-soft px-4 py-2 text-center text-sm font-semibold text-accent-dark">
                          ✓ Angemeldet
                        </span>
                        <button
                          onClick={() => d.myBookingId && handleCancel(d.myBookingId)}
                          disabled={isPending}
                          className="min-h-11 rounded-lg px-3 text-sm font-semibold text-red-700 underline-offset-2 transition hover:bg-red-50 hover:underline disabled:opacity-50"
                        >
                          {isPending ? "Wird storniert…" : "Stornieren"}
                        </button>
                      </div>
                    ) : full ? (
                      <span className="block rounded-full bg-surface-2 px-4 py-2.5 text-center text-sm font-semibold text-ink/40">
                        Ausgebucht
                      </span>
                    ) : loggedIn ? (
                      <button
                        onClick={() => handleBook(d.id)}
                        disabled={isPending}
                        className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/25 transition hover:bg-accent-hover hover:text-white disabled:opacity-60"
                      >
                        {isPending ? "Wird gebucht…" : "Platz reservieren"}
                      </button>
                    ) : (
                      <Link
                        href={`/login?next=${encodeURIComponent(loginNext)}`}
                        className="block w-full rounded-full border border-ink/15 px-4 py-2.5 text-center text-sm font-semibold text-ink transition hover:border-accent/50 hover:text-accent-dark"
                      >
                        Jetzt anmelden
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  )}</TranslatedContent>;
}
