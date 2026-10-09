"use client";
import TranslatedContent from "@/components/TranslatedContent";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import LogoutIcon from "@/components/LogoutIcon";
import AutoMenu from "@/components/AutoMenu";
import NavDropdown from "@/components/NavDropdown";
import { CartButton } from "@/components/gifts/GiftCartProvider";
import { useLanguage, useT, dict } from "@/lib/i18n";
type Session = {
  user?: { name?: string | null; role?: "CUSTOMER" | "ADMIN" } | null;
};
export default function NavbarClient({ session }: { session: Session | null }) {
  const t = useT(),
    { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false),
    menuButton = useRef<HTMLButtonElement>(null);
  const label = (de: string, fr: string) => (lang === "fr" ? fr : de);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 16);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  async function logout() {
    setOpen(false);
    await signOut({ redirectTo: "/" });
  }
  const about = [
    { href: "/#fahrlehrer", label: label("Dein Fahrlehrer", "Ton moniteur") },
    { href: "/#warum", label: t(dict.nav.why) },
    { href: "/ueber-mich", label: label("Über mich", "À propos de moi") },
    { href: "/#bewertungen", label: t(dict.nav.reviews) },
  ];
  const account = [
    {
      href: "/booking",
      label: label(
        "Meine Termine und Buchungen",
        "Mes rendez-vous et réservations",
      ),
    },
    { href: "/booking?view=gifts", label: label("Meine Gutscheine", "Mes bons cadeaux") },
    ...(session?.user?.role === "ADMIN"
      ? [{ href: "/admin", label: t(dict.nav.admin) }]
      : []),
  ];
  const logoutButton = (
    <button
      type="button"
      onClick={logout}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-action-blue px-4 py-2 text-sm font-semibold text-action-blue transition hover:bg-action-blue/5"
    >
      <LogoutIcon />
      {t(dict.nav.logout)}
    </button>
  );
  return (
    <TranslatedContent>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-ink/8 bg-surface/95 shadow-sm backdrop-blur-xl" : "border-b border-transparent bg-surface/80 backdrop-blur-md"}`}
      >
        <div className="flex h-20 w-full items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-10 2xl:px-12">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-jakarta text-sm font-extrabold text-ink sm:gap-2.5 sm:text-lg"
          >
            <span className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10">
              <Image
                src="/logo.png?v=20261007"
                alt=""
                fill
                sizes="40px"
                className="object-contain"
              />
            </span>
            <span className="max-w-[140px] leading-snug sm:max-w-none">
              Fahrschule{" "}
              <span className="font-bold text-accent-dark">fürs Leben</span>
            </span>
          </Link>
          <nav
            aria-label="Hauptnavigation"
            className="ml-auto hidden items-center gap-5 whitespace-nowrap text-sm font-medium text-ink/70 xl:flex 2xl:gap-7"
          >
            <AutoMenu />
            <Link
              href="/gutscheine"
              className="flex min-h-11 items-center transition hover:text-accent-dark"
            >
              {label("Gutscheine", "Bons cadeaux")}
            </Link>
            <NavDropdown label={label("Über uns", "À propos")} links={about} />
            <Link
              href="/#kontakt"
              className="flex min-h-11 items-center transition hover:text-accent-dark"
            >
              {label("Kontakt", "Contact")}
            </Link>
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-2 sm:gap-3">
            <div className="hidden items-center gap-4 whitespace-nowrap text-sm font-medium text-ink/70 xl:flex">
              <button
                type="button"
                onClick={() => setLang(lang === "de" ? "fr" : "de")}
                aria-label={label("Sprache wechseln", "Changer de langue")}
                className="rounded-full border border-ink/15 px-3 py-2 text-xs font-bold transition hover:text-accent-dark"
              >
                {lang === "de" ? "FR" : "DE"}
              </button>
              {session?.user ? (
                <NavDropdown
                  label={label("Mein Konto", "Mon compte")}
                  links={account}
                >
                  {logoutButton}
                </NavDropdown>
              ) : (
                <Link
                  href="/login"
                  className="flex min-h-11 items-center hover:text-accent-dark"
                >
                  {t(dict.nav.login)}
                </Link>
              )}
              <Link
                href="/booking"
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                {t(dict.nav.bookCta)}
              </Link>
            </div>
            <CartButton />
            <button
              ref={menuButton}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink xl:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={
                open
                  ? label("Menü schliessen", "Fermer le menu")
                  : label("Menü öffnen", "Ouvrir le menu")
              }
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <path
                  d={open ? "m6 6 12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div
            id="mobile-navigation"
            className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-ink/10 bg-surface px-6 py-5 xl:hidden"
          >
            <nav
              aria-label={label(
                "Mobile Hauptnavigation",
                "Navigation mobile principale",
              )}
              className="flex flex-col gap-2 text-sm font-medium text-ink/70"
            >
              <AutoMenu mobile onNavigate={() => setOpen(false)} />
              <Link
                href="/gutscheine"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center"
              >
                {label("Gutscheine", "Bons cadeaux")}
              </Link>
              <NavDropdown
                mobile
                label={label("Über uns", "À propos")}
                links={about}
                onNavigate={() => setOpen(false)}
              />
              <Link
                href="/#kontakt"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center"
              >
                {label("Kontakt", "Contact")}
              </Link>
              <div className="mt-3 flex flex-col gap-3 border-t border-ink/10 pt-4">
                {session?.user ? (
                  <NavDropdown
                    mobile
                    label={label("Mein Konto", "Mon compte")}
                    links={account}
                    onNavigate={() => setOpen(false)}
                  >
                    {logoutButton}
                  </NavDropdown>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center"
                  >
                    {t(dict.nav.login)}
                  </Link>
                )}
                <Link
                  href="/booking"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 py-3 font-bold text-white"
                >
                  {t(dict.nav.bookCta)}
                </Link>
                <button
                  type="button"
                  onClick={() => setLang(lang === "de" ? "fr" : "de")}
                  className="min-h-11 self-start text-sm font-semibold"
                >
                  {label("Sprache: Französisch", "Langue: allemand")}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </TranslatedContent>
  );
}
