"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function NotFound() {
  const { lang } = useLanguage();
  return <div className="site-container py-20 text-center">
    <p className="font-jakarta text-sm font-bold text-accent-dark">404</p>
    <h1 className="mt-4 font-jakarta text-3xl font-extrabold text-ink">{lang === "fr" ? "Page introuvable" : "Seite nicht gefunden"}</h1>
    <p className="mt-4 text-ink/70">{lang === "fr" ? "Cette page n’existe pas ou a été déplacée." : "Diese Seite existiert nicht oder wurde verschoben."}</p>
    <Link href="/" className="mt-7 inline-flex rounded-full bg-accent px-6 py-3 font-semibold text-white">{lang === "fr" ? "Retour à l’accueil" : "Zurück zur Startseite"}</Link>
  </div>;
}
