"use client";
import TranslatedContent from "@/components/TranslatedContent";


import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RevealText from "@/components/RevealText";
import { useT, dict } from "@/lib/i18n";

export default function Testimonials() {
  const t = useT();
  const items = dict.reviews.items;
  const total = items.length;

  const [active, setActive] = useState(0);
  function goTo(index: number) {
    setActive(index);
  }

  return <TranslatedContent>{(
    <section id="bewertungen" className="relative bg-surface-2 py-12 sm:py-16 lg:py-20">
      <div className="site-container">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">{t(dict.reviews.eyebrow)}</span>
          <RevealText
            as="h2"
            text={t(dict.reviews.title)}
            className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
          />
        </div>

        <div className="relative mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-ink/8 bg-card p-9 text-center shadow-sm sm:p-12"
            >
              <div aria-label="5 von 5 Sternen" className="text-accent-dark">{"★".repeat(5)}</div>
              <p className="mx-auto mt-5 max-w-2xl text-lg italic leading-relaxed text-ink/75 sm:text-xl">
                &ldquo;{t(items[active].text)}&rdquo;
              </p>
              <p className="mt-6 font-jakarta text-sm font-bold text-ink">{items[active].name}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              aria-label="Vorherige Bewertung"
              onClick={() => goTo((active - 1 + total) % total)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-card text-ink transition hover:border-accent/40 hover:text-accent-dark"
            >
              ‹
            </button>
            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Bewertung ${i + 1}`}
                  aria-pressed={active === i}
                  onClick={() => goTo(i)}
                  className={`h-8 w-8 rounded-full border-2 transition-colors ${active === i ? "border-accent-dark bg-action-green" : "border-ink/50 bg-white"}`}
                />
              ))}
            </div>
            <button
              aria-label="Nächste Bewertung"
              onClick={() => goTo((active + 1) % total)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-card text-ink transition hover:border-accent/40 hover:text-accent-dark"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  )}</TranslatedContent>;
}
