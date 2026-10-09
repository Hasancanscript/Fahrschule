"use client";
import TranslatedContent from "@/components/TranslatedContent";


import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RevealText from "@/components/RevealText";
import { useT, dict } from "@/lib/i18n";

export default function FAQ() {
  const t = useT();
  const items = dict.faq.items;
  const [open, setOpen] = useState<number | null>(null);

  return <TranslatedContent>{(
    <section id="faq" className="relative bg-surface py-12 sm:py-16 lg:py-20">
      <div className="site-container">
        <div className="text-center">
          <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">{t(dict.faq.eyebrow)}</span>
          <RevealText
            as="h2"
            text={t(dict.faq.title)}
            className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
          />
          <p className="mt-4 text-ink/55">{t(dict.faq.sub)}</p>
        </div>

        <div className="mt-8 flex sm:mt-10 flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q.de}
                className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${
                  isOpen ? "border-accent/30 bg-accent-soft" : "border-ink/8 bg-card"
                }`}
              >
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-jakarta text-sm font-semibold text-ink sm:text-base">{t(item.q)}</span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg ${
                      isOpen ? "bg-accent text-white" : "bg-surface-2 text-ink/50"
                    }`}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink/60">{t(item.a)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )}</TranslatedContent>;
}
