"use client";
import TranslatedContent from "@/components/TranslatedContent";


import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion, useInView } from "framer-motion";
import RevealText from "@/components/RevealText";
import { useT, dict } from "@/lib/i18n";
import { DRIVING_SOURCE_URL } from "@/lib/driving-steps";

type Translatable = { de: string; fr: string };

type Step = {
  title: Translatable;
  text: Translatable;
  banner?: Translatable;
  link?: { href: string; label: Translatable };
};

function GlowBox({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const reducedMotion = useReducedMotion();
  return <TranslatedContent>{(
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: [0.85, 1.06, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.3, times: [0, 0.7, 1], ease: "easeOut" }}
      className="relative inline-block rounded-xl p-[2px] align-middle"
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <motion.div
          className="absolute -inset-[150%]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, var(--line-accent) 18%, var(--line-accent-2) 36%, transparent 58%)",
            filter: "drop-shadow(0 0 4px var(--line-accent))",
          }}
          animate={{ rotate: visible && !reducedMotion ? 360 : 0 }}
          transition={{ duration: 6, repeat: visible && !reducedMotion ? Infinity : 0, ease: "linear" }}
        />
      </div>
      <div className="relative z-10 flex items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-accent-soft to-accent-2-soft px-3 py-1.5">
        {children}
      </div>
    </motion.div>
  )}</TranslatedContent>;
}

function FlagIcon() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M6 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M6 4h5l-.8 2h4.8l-1.5 3.5L15.8 13H6V4Z"
        fill="currentColor"
      />
    </svg>
  )}</TranslatedContent>;
}

export default function Process() {
  const t = useT();
  const steps = dict.process.steps as readonly Step[];
  const total = steps.length;

  const olRef = useRef<HTMLOListElement>(null);
  const firstBadgeRef = useRef<HTMLSpanElement>(null);
  const lastBadgeRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLLIElement>(null);
  const [rail, setRail] = useState({ top: 0, height: 0 });

  useLayoutEffect(() => {
    function measure() {
      if (!olRef.current || !firstBadgeRef.current || !lastBadgeRef.current) return;
      const olRect = olRef.current.getBoundingClientRect();
      const firstRect = firstBadgeRef.current.getBoundingClientRect();
      const lastRect = lastBadgeRef.current.getBoundingClientRect();
      const top = firstRect.top + firstRect.height / 2 - olRect.top;
      const bottom = lastRect.top + lastRect.height / 2 - olRect.top;
      setRail({ top, height: Math.max(bottom - top, 0) });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [total]);

  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start center", "end center"] });
  const dotTop = useTransform(scrollYProgress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);

  return <TranslatedContent>{(
    <section id="ablauf" className="relative bg-surface py-12 sm:py-16 lg:py-20">
      <div className="site-container">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">{t(dict.process.eyebrow)}</span>
          <RevealText
            as="h2"
            text={t(dict.process.title)}
            className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
          />
          <p className="mt-4 text-ink/55">{t(dict.process.sub)}</p>
        </div>

        <aside className="mt-8 rounded-2xl border border-accent/20 bg-accent-soft p-5 sm:p-6">
          <h3 className="font-jakarta text-base font-bold text-ink">{t(dict.process.rules.title)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">{t(dict.process.rules.text)}</p>
          <a href={DRIVING_SOURCE_URL} className="mt-3 inline-block text-xs font-semibold text-accent-dark underline">{t(dict.process.rules.sourceLabel)}</a>
        </aside>

        <ol ref={olRef} className="relative mt-16 flex flex-col gap-3">
          <li aria-hidden="true"
            ref={railRef}
            style={{ top: rail.top, height: rail.height }}
            className="absolute left-6 w-0.5 sm:left-7"
          >
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 rounded-full bg-ink/10" />
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute left-1/2 top-0 bottom-0 w-0.5 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-accent to-accent-2"
            />
            <motion.div
              style={{ top: dotTop }}
              className="absolute left-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_rgba(8,122,50,0.7)]"
            />
          </li>

          {steps.map((step, i) => {
            const isLast = i === total - 1;
            const isExternal = step.link?.href.startsWith("http");

            const cardInner = (
              <>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-jakarta text-base font-bold text-ink sm:text-lg">{t(step.title)}</h3>
                  {step.banner && (
                    <GlowBox>
                      <span className="text-xs leading-none">⚠️</span>
                      <p className="text-[11px] font-bold leading-none text-accent-dark sm:text-xs">{t(step.banner)}</p>
                    </GlowBox>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-ink/55">{t(step.text)}</p>
                {step.link && (
                  <a
                    href={step.link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-dark transition hover:underline"
                  >
                    {t(step.link.label)} →
                  </a>
                )}
              </>
            );

            return (
              <motion.li
                key={step.title.de}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
                className="group relative flex items-start gap-5 sm:gap-6"
              >
                <span
                  ref={i === 0 ? firstBadgeRef : isLast ? lastBadgeRef : undefined}
                  className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-surface font-jakarta text-sm font-bold shadow-sm sm:h-14 sm:w-14 ${
                    isLast ? "bg-accent text-white" : "bg-accent-2-soft text-brand-blue-dark"
                  }`}
                >
                  {isLast ? <FlagIcon /> : String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 rounded-2xl border border-ink/8 bg-card p-5 shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/25 group-hover:shadow-md sm:p-6">
                  {cardInner}
                </div>
              </motion.li>
            );
          })}
        </ol>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-14 flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-accent-soft to-accent-2-soft p-8 text-center sm:p-10"
        >
          <p className="font-jakarta text-xl font-bold text-ink sm:text-2xl">{t(dict.process.ctaTitle)}</p>
          <Link
            href="/booking"
            className="rounded-full bg-accent px-8 py-3.5 font-semibold text-white shadow-md shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-hover hover:text-white hover:shadow-lg"
          >
            {t(dict.process.ctaBook)} →
          </Link>
        </motion.div>
      </div>
    </section>
  )}</TranslatedContent>;
}


