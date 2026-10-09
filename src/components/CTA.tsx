"use client";
import TranslatedContent from "@/components/TranslatedContent";


import { motion } from "framer-motion";
import { useCookieConsent } from "@/components/CookieConsent";
import RevealText from "@/components/RevealText";
import { useT, dict } from "@/lib/i18n";

const ADDRESS = "Aarbergstrasse 97, 2503 Biel/Bienne, Schweiz";
const ENCODED_ADDRESS = encodeURIComponent(ADDRESS);
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${ENCODED_ADDRESS}&output=embed`;
const MAP_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${ENCODED_ADDRESS}`;
const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${ENCODED_ADDRESS}`;

function PhoneIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h3.5l1.5 5-2.2 1.5a11 11 0 0 0 5.7 5.7L15 13.8l5 1.5V19a2 2 0 0 1-2 2C10.6 21 3 13.4 3 4a2 2 0 0 1 2-2Z" />
    </svg>
  )}</TranslatedContent>;
}

function WhatsappIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.3.5.5 2.1-2.1-.6-.5.3A8.2 8.2 0 1 1 12 3.8Zm-3.1 4a.9.9 0 0 0-.7.3c-.3.3-.9 1-.9 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.8.5 0 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3 0-.1-.2-.2-.4-.3l-1.8-.8c-.2-.1-.4-.1-.6.1l-.7 1c-.1.2-.3.2-.5.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.4.1-.6l-.8-1.9c-.1-.2-.4-.5-.6-.5Z" />
    </svg>
  )}</TranslatedContent>;
}

function CalendarIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  )}</TranslatedContent>;
}

export default function CTA() {
  const t = useT();
  const { mapsAllowed, allowMaps } = useCookieConsent();
  const d = dict.cta;

  const methods = [
    {
      icon: <PhoneIcon />,
      label: t(d.phone),
      value: "078 777 81 61",
      href: "tel:+41787778161",
    },
    {
      icon: <WhatsappIcon />,
      label: "WhatsApp",
      value: t(d.ctaWhatsapp),
      href: "https://wa.me/41787778161?text=Hallo%20H%C3%BCseyin%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Fahrstunde",
      external: true,
    },
    {
      icon: <CalendarIcon />,
      label: t(d.ctaBook),
      value: t(d.areaValue),
      href: "/booking",
    },
  ];

  return <TranslatedContent>{(
    <section id="kontakt" className="relative overflow-hidden bg-surface py-12 sm:py-16 lg:py-20">
      <div className="site-container">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">{t(d.eyebrow)}</span>
          <RevealText
            as="h2"
            text={t(d.title)}
            className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
          />
          <p className="mx-auto mt-5 max-w-md text-ink/55">{t(d.sub)}</p>
        </div>

        <div className="mt-8 grid sm:mt-10 gap-4 sm:grid-cols-3">
          {methods.map((m, i) => (
            <motion.a
              key={m.label}
              href={m.href}
              target={m.external ? "_blank" : undefined}
              rel={m.external ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-ink/8 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-dark transition group-hover:bg-accent group-hover:text-white">
                {m.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">{m.label}</p>
                <p className="mt-0.5 font-jakarta text-base font-bold text-ink">{m.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mt-6 h-[380px] overflow-hidden rounded-3xl shadow-sm sm:h-[420px]"
        >
          {mapsAllowed ? <iframe src={MAP_EMBED_SRC} className="absolute inset-0 h-full w-full" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer" title="Google Maps: Fahrschule fürs Leben in Biel/Bienne" /> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-accent-soft px-6 pb-28 text-center"><p className="max-w-md text-sm text-ink/75">Die Google-Maps-Karte wird erst mit deiner Zustimmung geladen. Die Adresse findest du unten auch ohne Karte.</p><button type="button" onClick={allowMaps} className="min-h-11 rounded-xl bg-action-green px-5 py-3 text-sm font-bold text-white">Google Maps erlauben und laden</button></div>}

          <div className={`pointer-events-none absolute inset-0 ${mapsAllowed ? "bg-gradient-to-t from-ink/50 via-transparent to-transparent" : ""}`} />

          <a
            href={MAP_OPEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1.5 text-xs font-semibold text-ink shadow-md transition hover:text-accent-dark"
          >
            {t(d.mapOpen)} ↗
          </a>

          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="rounded-2xl border border-white/10 bg-ink/70 p-4 text-white backdrop-blur-md">
              <p className="flex items-center gap-1.5 font-jakarta text-sm font-bold">
                <span className="text-accent-dark">📍</span> {t(d.addressName)}
              </p>
              <p className="mt-1 text-sm text-white/70">Aarbergstrasse 97 · 2503 Biel/Bienne</p>
            </div>
            <a
              href={MAP_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-hover hover:text-white"
            >
              {t(d.directions)} →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )}</TranslatedContent>;
}
