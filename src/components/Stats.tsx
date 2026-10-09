"use client";
import TranslatedContent from "@/components/TranslatedContent";


import { motion } from "framer-motion";
import CountUp from "@/components/CountUp";
import { useT, dict } from "@/lib/i18n";

export default function Stats() {
  const t = useT();
  const items = dict.stats.items;

  return <TranslatedContent>{(
    <section className="relative overflow-hidden bg-surface py-10 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="site-container">
        <div className="grid grid-cols-2 gap-8 rounded-3xl border border-ink/8 bg-card p-10 shadow-sm lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.label.de}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center lg:text-left"
            >
              <p className="font-jakarta text-4xl font-extrabold text-ink sm:text-5xl">
                {"value" in item ? (
                  <CountUp value={item.value} suffix={item.suffix} />
                ) : (
                  <span className="text-accent-dark">{item.display}</span>
                )}
              </p>
              <p className="mt-2 text-sm text-ink/50">{t(item.label)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )}</TranslatedContent>;
}
