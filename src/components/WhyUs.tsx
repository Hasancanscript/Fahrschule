"use client";
import TranslatedContent from "@/components/TranslatedContent";


import { motion } from "framer-motion";
import RevealText from "@/components/RevealText";
import { useT, dict } from "@/lib/i18n";

export default function WhyUs() {
  const t = useT();
  const items = dict.why.items;

  return <TranslatedContent>{(
    <section id="warum" className="relative bg-surface py-12 sm:py-16 lg:py-20">
      <div className="site-container">
        <div className="max-w-xl">
          <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">{t(dict.why.eyebrow)}</span>
          <RevealText
            as="h2"
            text={t(dict.why.title)}
            className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
          />
          <p className="mt-4 text-ink/55">{t(dict.why.sub)}</p>
        </div>

        <div className="mt-8 grid sm:mt-10 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title.de}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-3xl border border-ink/8 bg-card p-7 lg:p-9 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-accent/25 hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft font-jakarta text-sm font-bold text-accent-dark transition group-hover:bg-accent group-hover:text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-jakarta text-lg font-bold text-ink">{t(item.title)}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink/55">{t(item.text)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )}</TranslatedContent>;
}
