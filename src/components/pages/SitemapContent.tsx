"use client";
import TranslatedContent from "@/components/TranslatedContent";

import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";

const GROUPS = [
  {
    title: "Startseite",
    links: [
      { href: "/", label: "Startseite" },
      { href: "/#angebote", label: "Angebote" },
      { href: "/#gutscheine", label: "Gutscheine" },
      { href: "/#ablauf", label: "Ablauf" },
      { href: "/#fahrlehrer", label: "Fahrlehrer" },
      { href: "/#warum", label: "Warum wir" },
      { href: "/ueber-mich", label: "Über mich" },
      { href: "/#bewertungen", label: "Bewertungen" },
      { href: "/#faq", label: "FAQ" },
      { href: "/#kontakt", label: "Kontakt" },
    ],
  },
  {
    title: "Kurse & Buchung",
    links: [
      { href: "/auto", label: "Auto · Schritt für Schritt" },
      { href: "/fahrstunde", label: "Fahrstunde" },
      { href: "/5er-abo", label: "5er-Abo" },
      { href: "/vku", label: "VKU-Kurstermine" },
      { href: "/nothelferkurs", label: "Nothelferkurs" },
      { href: "/booking", label: "Meine Termine buchen" },
      { href: "/gutscheine", label: "Gutscheine" },
      { href: "/warenkorb", label: "Warenkorb" },
    ],
  },
  {
    title: "Konto",
    links: [
      { href: "/login", label: "Anmelden" },
      { href: "/register", label: "Registrieren" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutzerklärung" },
      { href: "/agb", label: "AGB" },
      { href: "/gutscheinbedingungen", label: "Gutscheinbedingungen" },
      { href: "/cookies", label: "Cookie-Richtlinie" },
      { href: "/barrierefreiheit", label: "Barrierefreiheit" },
      { href: "/sitemap", label: "Sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <TranslatedContent>
      <LegalLayout title="Sitemap">
        <p>Alle Seiten und Bereiche der Website auf einen Blick.</p>
        <nav
          aria-label="Alle Seiten der Website"
          className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {GROUPS.map((group, index) => (
            <section
              key={group.title}
              aria-labelledby={`sitemap-group-${index}`}
            >
              <h2
                id={`sitemap-group-${index}`}
                className="font-jakarta text-lg font-bold text-ink"
              >
                {group.title}
              </h2>
              <ul className="mt-2 space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-9 items-center text-accent-dark transition hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </LegalLayout>
    </TranslatedContent>
  );
}
