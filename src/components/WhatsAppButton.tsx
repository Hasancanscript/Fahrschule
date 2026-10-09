"use client";
import TranslatedContent from "@/components/TranslatedContent";

import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useT } from "@/lib/i18n";
export default function WhatsAppButton() {
  const t = useT();
  return <TranslatedContent>{<a
    href="https://wa.me/41787778161"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={t({ de: "Fahrschule über WhatsApp kontaktieren (öffnet ein neues Fenster)", fr: "Contacter l’auto-école sur WhatsApp (nouvelle fenêtre)" })}
    title={t({ de: "Schreib uns auf WhatsApp", fr: "Écris-nous sur WhatsApp" })}
    className="whatsapp-contact fixed z-40 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-[0_6px_24px_rgba(0,0,0,0.22)] transition hover:scale-105 hover:shadow-xl focus-visible:scale-105 sm:h-18 sm:w-18"
  >
    <WhatsAppIcon className="h-9 w-9" />
  </a>}</TranslatedContent>;
}
