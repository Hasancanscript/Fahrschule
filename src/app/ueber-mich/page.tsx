"use client";
import TranslatedContent from "@/components/TranslatedContent";


import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BrandText from "@/components/BrandText";
import RevealText from "@/components/RevealText";
import { useT, dict } from "@/lib/i18n";

const FACTS = [
  { label: { de: "Standort", fr: "Lieu" }, value: { de: "Biel/Bienne", fr: "Bienne" } },
  { label: { de: "Sprachen", fr: "Langues" }, value: { de: "DE / FR", fr: "DE / FR" } },
  { label: { de: "Kategorien", fr: "Catégories" }, value: { de: "B · BE", fr: "B · BE" } },
  { label: { de: "Fahrzeug", fr: "Véhicule" }, value: { de: "Automatik", fr: "Automatique" } },
];

function TargetIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )}</TranslatedContent>;
}

function CompassIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2 13 13l-3.8 1.8L11 11l3.8-1.8Z" strokeLinejoin="round" />
    </svg>
  )}</TranslatedContent>;
}

function CheckIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )}</TranslatedContent>;
}

function ShieldIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 3.5 19 6.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5Z" />
    </svg>
  )}</TranslatedContent>;
}

function HeartIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20.3S3.6 15 3.6 8.8C3.6 5.9 5.9 4 8.3 4c1.6 0 3 .8 3.7 2 .7-1.2 2.1-2 3.7-2 2.4 0 4.7 1.9 4.7 4.8 0 6.2-8.4 11.5-8.4 11.5z" />
    </svg>
  )}</TranslatedContent>;
}

function ScaleIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M6 7h12M6 7 3.5 12.5a3 3 0 0 0 5 0L6 7Zm12 0-2.5 5.5a3 3 0 0 0 5 0L18 7Z" />
    </svg>
  )}</TranslatedContent>;
}

function UserIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1.2-3.8 4-5.5 7-5.5s5.8 1.7 7 5.5" strokeLinecap="round" />
    </svg>
  )}</TranslatedContent>;
}

const VALUE_ICONS = [<ShieldIcon key="shield" />, <HeartIcon key="heart" />, <ScaleIcon key="scale" />, <UserIcon key="user" />];

export default function UeberMichPage() {
  const t = useT();
  const d = dict.instructor;
  const mv = dict.missionVision;

  return <TranslatedContent>{(
    <div className="bg-surface pb-24">
      <section className="border-b border-white/10 bg-ink">
        <div className="site-container grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label.de}>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{t(f.label)}</p>
              <p className="mt-1 font-jakarta text-lg font-bold text-white">{t(f.value)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-container pt-10">
        <Link href="/#fahrlehrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 transition hover:text-ink">
          ← Zurück zur Startseite
        </Link>

        <div className="mt-8 grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-dark">{t(d.eyebrow)}</span>

            <div className="mt-4 text-4xl text-accent-dark">&ldquo;</div>
            <RevealText
              as="h1"
              text={t(d.title)}
              immediate
              className="-mt-6 font-jakarta text-4xl font-extrabold leading-tight text-ink sm:text-5xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="mt-6 text-lg text-ink/60"><BrandText text={t(d.p1)} /></p>
              <p className="mt-4 text-lg text-ink/60"><BrandText text={t(d.p2)} /></p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-7 border-l-4 border-accent py-1 pl-5"
            >
              <p className="font-jakarta text-xl font-bold italic text-ink"><BrandText text={t(d.quote)} /></p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-ink/40">
                {t(d.name)} · <BrandText text={t(d.role)} />
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-7 flex flex-wrap gap-2.5"
            >
              {d.tags.map((tag) => (
                <span
                  key={tag.de}
                  className="rounded-full border border-ink/10 bg-card px-4 py-1.5 text-xs font-semibold text-ink/70 shadow-sm"
                >
                  {t(tag)}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-9"
            >
              <a
                href="/booking"
                className="inline-block rounded-full bg-accent px-8 py-3.5 font-semibold text-white shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-hover hover:text-white"
              >
                Fahrstunde buchen →
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-ink/8 shadow-sm"
          >
            <Image
              src="/instructor.jpg"
              alt={t(d.name)}
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover object-[center_25%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/10 bg-ink/90 p-5 shadow-sm backdrop-blur-md">
              <p className="font-jakarta text-lg font-bold text-white">{t(d.name)}</p>
              <p className="text-sm text-white/70"><BrandText text={t(d.role)} /></p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="site-container pt-12 sm:pt-16 lg:pt-20">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">{t(mv.eyebrow)}</span>
          <RevealText
            as="h2"
            text={t(mv.title)}
            className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:grid-rows-[repeat(9,auto)] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col overflow-hidden rounded-3xl border border-ink/8 bg-card shadow-sm lg:row-span-9 lg:grid lg:grid-rows-subgrid lg:gap-y-0 transition-[box-shadow,border-color,translate] duration-300 hover:[translate:0_-6px] hover:border-accent-dark hover:shadow-[0_18px_40px_-12px_rgba(8,122,50,0.3)]"
          >
            <div className="relative aspect-[4/3] w-full bg-surface-2">
              <Image src="/mission-illustration.png?v=20261007" alt={t(mv.mission.title)} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-fill" />
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-8 lg:row-span-8 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-dark">
                <TargetIcon />
              </span>
              <h3 className="mt-5 font-jakarta text-xl font-bold text-ink">{t(mv.mission.title)}</h3>
              <p className="mt-3 text-sm text-ink/60"><BrandText text={t(mv.mission.intro)} /></p>

              <div aria-hidden="true" className="mt-5 border-t border-ink/20" />
              <ul className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:row-span-3 lg:grid-rows-subgrid">
                {mv.mission.points.map((pt) => (
                  <li key={pt.title.de} className="flex items-start gap-2 text-sm text-ink/70 ">
                    <span className="mt-0.5 text-accent-dark">
                      <CheckIcon />
                    </span>
                    <span className="min-w-0">
                      <span className="font-semibold text-ink">{t(pt.title)}</span>
                      <span className="mt-1 block text-ink/50">{t(pt.text)}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-ink/8 pt-5 text-sm font-semibold italic text-ink/70">
                <BrandText text={t(mv.mission.tagline)} />
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col overflow-hidden rounded-3xl border border-ink/8 bg-card shadow-sm lg:row-span-9 lg:grid lg:grid-rows-subgrid lg:gap-y-0 transition-[box-shadow,border-color,translate] duration-300 hover:[translate:0_-6px] hover:border-accent-dark hover:shadow-[0_18px_40px_-12px_rgba(8,122,50,0.3)]"
          >
            <div className="relative aspect-[4/3] w-full bg-surface-2">
              <Image src="/vision-illustration.png?v=20261007" alt={t(mv.vision.title)} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-fill" />
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-8 lg:row-span-8 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-2-soft text-accent-2-dark">
                <CompassIcon />
              </span>
              <h3 className="mt-5 font-jakarta text-xl font-bold text-ink">{t(mv.vision.title)}</h3>
              <p className="mt-3 text-sm text-ink/60">{t(mv.vision.summary)}</p>

              <div aria-hidden="true" className="mt-5 border-t border-ink/20" />
              <ul className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:row-span-3 lg:grid-rows-subgrid">
                {mv.vision.points.map((pt) => (
                  <li key={pt.title.de} className="flex items-start gap-2 text-sm text-ink/70 ">
                    <span className="mt-0.5 text-accent-2-dark">
                      <CheckIcon />
                    </span>
                    <span className="min-w-0">
                      <span className="font-semibold text-ink">{t(pt.title)}</span>
                      <span className="mt-1 block text-ink/50">{t(pt.text)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div aria-hidden="true" className="mt-6 border-t border-ink/20" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="site-container py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">{t(mv.values.eyebrow)}</span>
          <RevealText
            as="h2"
            text={t(mv.values.title)}
            className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
          />
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mv.values.items.map((item, i) => (
            <motion.div
              key={item.title.de}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-ink/8 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#009fdf]/25 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent-dark">
                {VALUE_ICONS[i]}
              </span>
              <h3 className="mt-4 font-jakarta text-base font-bold text-ink">{t(item.title)}</h3>
              <p className="mt-2 flex-1 text-sm text-ink/55">{t(item.text)}</p>
              <div className="mt-4 h-0.5 w-8 rounded-full bg-[#009fdf]" />
            </motion.div>
          ))}
        </div>

        <p className="mt-14 text-center font-jakarta text-lg font-semibold text-ink/70"><BrandText text={t(mv.closing)} /></p>
      </section>
    </div>
  )}</TranslatedContent>;
}
