"use client";
import TranslatedContent from "@/components/TranslatedContent";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText from "@/components/RevealText";
import CountUp from "@/components/CountUp";
import RouteGraphic from "@/components/RouteGraphic";
import { useT, dict } from "@/lib/i18n";

export default function Hero() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const graphicY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <TranslatedContent>
      {
        <section
          ref={ref}
          className="relative isolate -mt-20 overflow-hidden bg-surface pt-36 pb-20 sm:pt-44 sm:pb-28"
        >
          <motion.div
            style={{ y: bgY }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-accent-soft blur-3xl" />
            <div className="absolute -left-24 top-60 h-72 w-72 rounded-full bg-accent-2/15 blur-3xl" />
          </motion.div>

          <div className="site-container relative grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <motion.span
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink/60 shadow-sm"
              >
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
                {t(dict.hero.badge)}
              </motion.span>

              <h1 className="mt-7 font-jakarta text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-[1.12] tracking-tight text-ink">
                <RevealText
                  as="span"
                  text={t(dict.hero.title1)}
                  className="block"
                  immediate
                />
                <RevealText
                  as="span"
                  text={t(dict.hero.title2)}
                  delay={0.12}
                  className="block bg-gradient-to-r from-accent-dark to-accent-2-dark bg-clip-text text-transparent"
                  immediate
                />
                <RevealText
                  as="span"
                  text={t(dict.hero.title3)}
                  delay={0.24}
                  className="block"
                  immediate
                />
              </h1>

              <motion.p
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mx-auto mt-7 max-w-lg text-lg text-ink/60 lg:mx-0"
              >
                {t(dict.hero.sub)}
              </motion.p>

              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.62 }}
                className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              >
                <a
                  href="/booking"
                  className="rounded-full bg-accent px-8 py-3.5 font-semibold text-white shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-hover hover:text-white hover:shadow-xl hover:shadow-accent/30"
                >
                  {t(dict.hero.ctaBook)}
                </a>
                <a
                  href="#angebote"
                  className="rounded-full border border-ink/15 bg-card px-8 py-3.5 font-semibold text-ink transition hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-md"
                >
                  {t(dict.hero.ctaMore)}
                </a>
              </motion.div>
              <p className="mt-4 text-sm">
                <a
                  href="/gutscheine"
                  className="inline-flex min-h-9 items-center gap-2 font-semibold text-accent-dark hover:underline"
                >
                  {t({
                    de: "Gutscheine ab CHF 50 verschenken",
                    fr: "Offrir un bon dès CHF 50",
                  })}{" "}
                  <span aria-hidden="true">→</span>
                </a>
              </p>

              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="mx-auto mt-8 grid sm:mt-10 max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-7 lg:mx-0"
              >
                <div>
                  <p className="font-jakarta text-2xl font-extrabold text-ink sm:text-3xl">
                    <CountUp value={400} suffix="+" />
                  </p>
                  <p className="mt-1 text-xs text-ink/50">
                    {t(dict.hero.stat1.label)}
                  </p>
                </div>
                <div>
                  <p className="font-jakarta text-2xl font-extrabold text-ink sm:text-3xl">
                    <CountUp value={1000} suffix="+" />
                  </p>
                  <p className="mt-1 text-xs text-ink/50">
                    {t(dict.hero.stat2.label)}
                  </p>
                </div>
                <div>
                  <p className="font-jakarta text-2xl font-extrabold text-ink sm:text-3xl">
                    {dict.hero.stat3.value}
                  </p>
                  <p className="mt-1 text-xs text-ink/50">
                    {t(dict.hero.stat3.label)}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              style={{ y: graphicY }}
              className="relative mt-6 lg:mt-0"
            >
              <RouteGraphic />
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: 1, ease: "easeInOut" }}
            className="relative mx-auto mt-16 hidden max-w-7xl justify-center text-xs font-medium text-ink/40 lg:flex"
          >
            {t(dict.hero.scrollHint)} ↓
          </motion.div>
        </section>
      }
    </TranslatedContent>
  );
}
