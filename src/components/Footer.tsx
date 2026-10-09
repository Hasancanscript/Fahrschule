"use client";
import TranslatedContent from "@/components/TranslatedContent";

import { CookieSettingsButton } from "@/components/CookieConsent";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Image from "next/image";
import Link from "next/link";
import { useT, dict } from "@/lib/i18n";

function InstagramIcon() {
  return (
    <TranslatedContent>
      {
        <svg
          viewBox="0 0 24 24"
          className="h-4.5 w-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.2"
            cy="6.8"
            r="1.1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      }
    </TranslatedContent>
  );
}

function TiktokIcon() {
  return (
    <TranslatedContent>
      {
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
          <path d="M16.6 2h-3.2v13.4a2.9 2.9 0 1 1-2.2-2.8v-3.3a6.2 6.2 0 1 0 5.4 6.1V8.9a7.6 7.6 0 0 0 4.4 1.4V7.1a4.3 4.3 0 0 1-4.4-4.1z" />
        </svg>
      }
    </TranslatedContent>
  );
}

export default function Footer() {
  const t = useT();

  return (
    <TranslatedContent>
      {
        <footer className="border-t border-ink/8 bg-surface-2 text-ink">
          <div className="site-container grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <div className="flex items-center gap-2.5 font-jakarta text-lg font-extrabold">
                <span className="relative h-9 w-9 shrink-0">
                  <Image
                    src="/logo.png?v=20261007"
                    alt=""
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </span>
                <span>
                  Fahrschule{" "}
                  <span className="font-bold text-accent-dark">fürs Leben</span>
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-ink/50">
                {t(dict.footer.tagline)}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/40">
                {t(dict.footer.nav)}
              </h2>
              <nav className="mt-3 flex flex-col gap-2 text-sm text-ink/60">
                <Link
                  href="/#angebote"
                  className="transition hover:text-accent-dark"
                >
                  {t(dict.nav.offers)}
                </Link>
                <Link
                  href="/gutscheine"
                  className="transition hover:text-accent-dark"
                >
                  Gutscheine
                </Link>
                <Link
                  href="/#ablauf"
                  className="transition hover:text-accent-dark"
                >
                  {t(dict.nav.process)}
                </Link>
                <Link
                  href="/ueber-mich"
                  className="transition hover:text-accent-dark"
                >
                  Über mich
                </Link>
                <Link
                  href="/#bewertungen"
                  className="transition hover:text-accent-dark"
                >
                  {t(dict.nav.reviews)}
                </Link>
                <Link
                  href="/#faq"
                  className="transition hover:text-accent-dark"
                >
                  {t(dict.nav.faq)}
                </Link>
              </nav>
            </div>

            <div id="kontakt" className="scroll-mt-28">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/40">
                {t(dict.footer.contact)}
              </h2>
              <div className="mt-3 flex flex-col gap-2 text-sm text-ink/60">
                <a
                  href="tel:+41787778161"
                  className="transition hover:text-accent-dark"
                >
                  078 777 81 61
                </a>
                <a
                  href="https://wa.me/41787778161"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-accent-dark"
                >
                  WhatsApp
                </a>
                <a
                  href="mailto:info@fahrschulefuersleben.ch"
                  className="break-all transition hover:text-accent-dark"
                >
                  info@fahrschulefuersleben.ch
                </a>
                <span>Biel/Bienne &amp; Umgebung</span>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/40">
                Rechtliches
              </h2>
              <nav className="mt-3 flex flex-col gap-2 text-sm text-ink/60">
                <Link
                  href="/impressum"
                  className="transition hover:text-accent-dark"
                >
                  Impressum
                </Link>
                <Link
                  href="/datenschutz"
                  className="transition hover:text-accent-dark"
                >
                  Datenschutz
                </Link>
                <Link href="/agb" className="transition hover:text-accent-dark">
                  AGB
                </Link>
                <Link
                  href="/gutscheinbedingungen"
                  className="transition hover:text-accent-dark"
                >
                  Gutscheinbedingungen
                </Link>
                <Link
                  href="/cookies"
                  className="transition hover:text-accent-dark"
                >
                  Cookies
                </Link>
                <CookieSettingsButton />

                <Link
                  href="/barrierefreiheit"
                  className="transition hover:text-accent-dark"
                >
                  Barrierefreiheit
                </Link>
                <Link
                  href="/sitemap"
                  className="transition hover:text-accent-dark"
                >
                  Sitemap
                </Link>
              </nav>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/60">
                Social Media
              </h2>
              <div className="flex items-center gap-3 mt-3">
                <a
                  href="https://wa.me/41787778161"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink/50 transition hover:border-accent/40 hover:text-accent-dark"
                >
                  <WhatsAppIcon />
                </a>
                <a
                  href="https://instagram.com/fahrschule_furs_leben"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink/50 transition hover:border-accent/40 hover:text-accent-dark"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://tiktok.com/@fahrschule_furs_leben"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink/50 transition hover:border-accent/40 hover:text-accent-dark"
                >
                  <TiktokIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-ink/8 pt-6 pb-28">
            <div className="site-container flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-xs text-ink/60 sm:justify-between">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <p>© Fahrschule fürs Leben. {t(dict.footer.rights)}</p>
                <p>
                  Webdesign bei{" "}
                  <a
                    href="https://qalvora.ch/"
                    className="font-semibold underline underline-offset-4"
                  >
                    Qalvora.ch
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      }
    </TranslatedContent>
  );
}
