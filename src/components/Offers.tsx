"use client";
import "./line-animations.css";
import TranslatedContent from "@/components/TranslatedContent";


import { useOffers } from "@/lib/use-offers";
import { formatPrice } from "@/lib/pricing";
import Image from "next/image";
import { motion } from "framer-motion";
import RevealText from "@/components/RevealText";
import { useT, dict } from "@/lib/i18n";

function IconWheel() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3.5v6.3M12 20.5v-6.3M4.6 7.5l5.4 3.2M19.4 7.5l-5.4 3.2M4.6 16.5l5.4-3.2M19.4 16.5l-5.4-3.2" />
    </svg>
  )}</TranslatedContent>;
}

function IconLayers() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3.5l8.5 4.5L12 12.5 3.5 8z" />
      <path d="M3.5 12.5L12 17l8.5-4.5" />
      <path d="M3.5 16.5L12 21l8.5-4.5" />
    </svg>
  )}</TranslatedContent>;
}

function IconBook() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.2c2-1 5-1 8 .6 3-1.6 6-1.6 8-.6v13.6c-2-1-5-1-8 .6-3-1.6-6-1.6-8-.6z" />
      <path d="M12 5.8v13.6" />
    </svg>
  )}</TranslatedContent>;
}

function IconHeart() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.3S3.6 15 3.6 8.8C3.6 5.9 5.9 4 8.3 4c1.6 0 3 .8 3.7 2 .7-1.2 2.1-2 3.7-2 2.4 0 4.7 1.9 4.7 4.8 0 6.2-8.4 11.5-8.4 11.5z" />
      <path d="M6.5 9.5h2.3l1.3-2.2 1.8 4.2 1.2-2h3.4" />
    </svg>
  )}</TranslatedContent>;
}

function IconArrow() {
  return <TranslatedContent>{(
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  )}</TranslatedContent>;
}

export default function Offers() {
  const t = useT();
  const o = dict.offers;
  const { offers, loading: pricesLoading } = useOffers();

  const cards = [
    {
      key: "single",
      icon: <IconWheel />,
      title: t(o.single.title),
      text: t(o.single.text),
      price: o.single.price,
      originalPrice: o.single.originalPrice,
      priceNote: t(o.single.priceNote),
      meta: t(o.single.meta),
      badge: null,
      image: "/homepage-fahrstunde.png",
      href: "/fahrstunde",
      cta: t(o.ctaBook),
    },
    {
      key: "pack5",
      icon: <IconLayers />,
      title: t(o.pack5.title),
      text: t(o.pack5.text),
      price: o.pack5.price,
      meta: t(o.pack5.meta),
      badge: t(o.pack5.badge),
      image: "/homepage-5er-abo.png",
      href: "/5er-abo",
      cta: t(o.ctaBook),
    },
    {
      key: "vku",
      icon: <IconBook />,
      title: t(o.vku.title),
      text: t(o.vku.text),
      price: o.vku.price,
      meta: t(o.vku.meta),
      badge: null,
      image: "/offer-vku.png",
      href: "/vku",
      cta: t(o.ctaBook),
    },
    {
      key: "firstaid",
      icon: <IconHeart />,
      title: t(o.firstaid.title),
      text: t(o.firstaid.text),
      price: t(o.firstaid.price),
      meta: t(o.firstaid.meta),
      badge: null,
      image: "/offer-nothilfe.png",
      href: "/nothelferkurs",
      cta: t(o.ctaBook),
    },
  ].map((card) => {
    const offer = offers[card.key];
    return { ...card,
      title: offer?.name ?? card.title,
      price: offer ? formatPrice(offer.discountedPriceCents) : pricesLoading ? "…" : t({ de: "Auf Anfrage", fr: "Sur demande" }),
      originalPrice: offer && offer.discountPercent > 0 ? formatPrice(offer.priceCents) : undefined,
      priceNote: offer?.discountPercent ? `${offer.discountPercent} % ${t({ de: "Rabatt", fr: "de réduction" })}` : "",
      meta: offer?.lessonsTotal ? `${offer.lessonsTotal} ${t({ de: "Fahrstunden im Abo", fr: "leçons dans l’abonnement" })}` : offer?.durationMin ? `${offer.durationMin} Min.` : card.meta,
    };
  });

  return <TranslatedContent>{(
    <section id="angebote" className="relative bg-surface py-12 sm:py-16 lg:py-20">
      <div className="site-container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">{t(o.eyebrow)}</span>
          <RevealText
            as="h2"
            text={t(o.title)}
            className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
          />
          <p className="mt-4 text-ink/55">{t(o.sub)}</p>
        </div>

        <div className="mt-8 grid sm:mt-10 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, i) => (
            <motion.a
              key={card.key}
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-3xl p-[3px] shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className="absolute inset-0 rounded-3xl ring-1 ring-line-accent/25" />
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div
                  className="offer-border-flow absolute -inset-[150%]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0%, var(--line-accent) 18%, var(--line-accent-2) 36%, transparent 58%)",
                    filter: "drop-shadow(0 0 6px var(--line-accent))",
                    animationDuration: `${6 + i * 0.9}s`,
                  }}
                />
              </div>

              <div className="relative z-10 flex w-full min-w-0 min-h-[26rem] aspect-[4/5] flex-col xl:min-h-[32rem] overflow-hidden rounded-[21px] bg-ink">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(min-width: 1792px) 420px, (min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-[center_62%] transition duration-500 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink from-0% via-ink/72 via-36% to-transparent to-58%" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink from-0% via-ink/72 via-32% to-transparent to-62%" />

                <div className="relative z-10 flex items-start justify-between p-5 lg:p-7">
                  <span className="flex items-center gap-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20">
                      {card.icon}
                    </span>
                    {card.badge && (
                      <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                        {card.badge}
                      </span>
                    )}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20 transition duration-300 group-hover:bg-accent group-hover:text-white group-hover:rotate-45">
                    <IconArrow />
                  </span>
                </div>

                <div className="relative z-10 px-5 pb-4 lg:px-7 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
                  <h3 className="font-jakarta text-2xl font-extrabold leading-tight text-white 2xl:text-3xl">{card.title}</h3>
                  <p className="mt-1.5 min-h-[3.75rem] text-sm leading-relaxed text-white/85 2xl:text-base">{card.text}</p>
                </div>

                <div className="relative z-10 mt-auto flex min-h-[5.25rem] flex-col justify-end p-5 pt-10 lg:px-7 lg:pb-7 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
                  <div className="flex flex-wrap items-baseline gap-2">
                    {card.originalPrice && (
                      <span className="text-sm font-medium text-white/50 line-through">{card.originalPrice}</span>
                    )}
                    <span className="font-jakarta text-lg font-bold text-white">{card.price}</span>
                    {card.key === "single" && (
                      <span className="text-xs font-normal text-white/70">{t(o.perLesson)}</span>
                    )}
                  </div>
                  <p className="min-h-[1rem] text-xs font-medium text-white/60">{card.priceNote || " "}</p>
                  <p className="mt-0.5 inline-block self-start rounded-md bg-action-blue px-2 py-1 text-xs font-semibold text-white [text-shadow:none]">{card.meta}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )}</TranslatedContent>;
}
