"use client";
import TranslatedContent from "@/components/TranslatedContent";


import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BrandText from "@/components/BrandText";
import RevealText from "@/components/RevealText";
import { useT, dict } from "@/lib/i18n";

export default function Instructor() {
  const t = useT();
  const d = dict.instructor;

  return <TranslatedContent>{(
    <section id="fahrlehrer" className="relative bg-surface-2 py-12 sm:py-16 lg:py-20">
      <div className="site-container">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
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

          <div>
            <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">{t(d.eyebrow)}</span>
            <RevealText
              as="h2"
              text={t(d.title)}
              className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="mt-5 text-ink/60"><BrandText text={t(d.p1)} /></p>
              <p className="mt-4 text-ink/60"><BrandText text={t(d.p2)} /></p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 rounded-2xl border border-accent/20 bg-accent-soft px-6 py-5"
            >
              <p className="font-jakarta italic text-ink"><BrandText text={t(d.quote)} /></p>
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
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Link
                href="/ueber-mich"
                className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-accent-dark transition hover:underline"
              >
                Mehr über mich →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )}</TranslatedContent>;
}
