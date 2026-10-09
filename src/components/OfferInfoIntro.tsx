"use client";
import TranslatedContent from "@/components/TranslatedContent";


import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export type InfoTopic = { title: string; text: string; banner?: string; href?: string; linkLabel?: string };
type Props = {
  imageSrc: string; imageAlt: string; imagePosition?: string; badgeText: string;
  eyebrow: string; title: string; description: string;
  topics: InfoTopic[]; topicsTitle?: string; numbered?: boolean;
  ctaHref: string; ctaLabel: string;
  facts: { label: string; value: string; originalValue?: string }[];
};

export default function OfferInfoIntro({ imageSrc, imageAlt, imagePosition = "center", badgeText, eyebrow, title, description, topics, topicsTitle = "Inhalte", numbered = false, ctaHref, ctaLabel, facts }: Props) {
  return <TranslatedContent>{(
    <section className="site-container pt-10">
      <Link href="/#angebote" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 transition hover:text-ink">← Zurück zu Angeboten</Link>
      <div className="mt-6 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl">
          <Image preload src={imageSrc} alt={imageAlt} fill sizes="(min-width: 1792px) 1792px, 100vw" className="object-cover" style={{ objectPosition: imagePosition }} />
          <span className="absolute left-5 top-5 rounded-full bg-[#009fdf] px-3 py-1.5 text-xs font-bold text-ink shadow-sm">{badgeText}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <span className={numbered ? "inline-block pt-2 text-xs font-bold uppercase leading-relaxed tracking-[0.15em] text-white" : "inline-block w-fit rounded-md bg-[#009fdf] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-ink"}>{eyebrow}</span>
            <Link href={ctaHref} className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition bg-accent hover:bg-accent-hover`}>{ctaLabel}</Link>
          </div>
          <h1 className="relative mt-4 font-jakarta text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className={`relative mt-4 text-white/70 ${numbered ? "max-w-[75ch] leading-relaxed sm:text-lg" : ""}`}>{description}</p>
          <h2 className={numbered ? "relative mt-10 font-jakarta text-lg font-bold text-white" : "relative mt-7 inline-block w-fit rounded-md bg-[#009fdf] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-ink"}>{topicsTitle}</h2>
          <ol className={`relative mt-5 ${numbered ? "flex flex-col" : "flex flex-col gap-3"}`}>
            {topics.map((topic, index) => <li key={topic.title} className={numbered ? "relative flex items-start gap-4 pb-9 last:pb-0 sm:gap-6 sm:pb-10" : ""}>
              {numbered && <>
                {index < topics.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px bg-white/15" />}
                <span aria-hidden="true" className="relative flex h-10 w-10 shrink-0 items-center justify-center font-jakarta text-lg font-bold text-[#009fdf]">{String(index + 1).padStart(2, "0")}</span>
              </>}
              <div className="min-w-0 flex-1">
                <h3 className={`font-jakarta font-bold text-white ${numbered ? "pt-1 text-base leading-snug sm:text-lg" : "text-sm"}`}>{topic.title}</h3>
                <p className={numbered ? "mt-2 max-w-[75ch] text-sm leading-relaxed text-white sm:text-base" : "mt-0.5 text-sm leading-relaxed text-white/60"}>{topic.text}</p>
                {topic.banner && <span className="mt-3 inline-flex items-start gap-2 rounded-xl border border-[#009fdf]/30 bg-accent-2-soft px-3 py-2 text-xs font-bold leading-relaxed text-ink sm:text-sm"><span aria-hidden="true">⚠️</span>{topic.banner}</span>}
                {topic.href && <div><Link href={topic.href} className={numbered ? "mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-[#009fdf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#009fdf]" : "mt-2 inline-block rounded-md bg-[#009fdf] px-3 py-1.5 text-xs font-semibold text-ink transition hover:underline"}>{topic.linkLabel ?? "Mehr erfahren"} <span aria-hidden="true">→</span></Link></div>}
              </div>
            </li>)}
          </ol>
          <dl className="relative mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-6">
            {facts.map(fact => <div key={fact.label}><dt className="text-xs font-semibold uppercase tracking-wide text-white/40">{fact.label}</dt><dd className="mt-1 flex flex-wrap items-baseline gap-2">{fact.originalValue && <span className="text-sm font-medium text-white/40 line-through">{fact.originalValue}</span>}<span className="font-jakarta text-lg font-bold text-white">{fact.value}</span></dd></div>)}
          </dl>
        </motion.div>
      </div>
    </section>
  )}</TranslatedContent>;
}
