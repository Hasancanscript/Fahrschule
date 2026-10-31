"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { isInquiryOffer } from "@/lib/inquiry";
import InquiryForm from "@/components/InquiryForm";

// Termin anfragen. Das Angebot kommt aus ?offer=single|pack5|vku|firstaid.
function Inquiry() {
  const params = useSearchParams();
  const offer = params.get("offer");
  return <InquiryForm offer={isInquiryOffer(offer) ? offer : "single"} />;
}

export default function BookingPage() {
  const { lang } = useLanguage();
  const t = (de: string, fr: string) => (lang === "fr" ? fr : de);
  return (
    <div translate="no" className="bg-surface pb-24 pt-12 sm:pt-16">
      <div className="site-container">
        <div className="mx-auto max-w-3xl">
        <span className="inline-block w-fit rounded-md bg-[#009fdf] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-ink">{t("Anfrage", "Demande")}</span>
        <h1 className="mt-3 font-jakarta text-3xl font-extrabold text-ink sm:text-4xl">{t("Termin anfragen", "Demander un rendez-vous")}</h1>
        <p className="mt-4 text-lg text-ink/70">
          {t(
            "Schreib uns, was du möchtest und wann du Zeit hast. Hüseyin meldet sich persönlich bei dir und macht den Termin mit dir ab.",
            "Dis-nous ce que tu souhaites et quand tu es disponible. Hüseyin te contacte personnellement pour fixer le rendez-vous avec toi.",
          )}
        </p>
        <p className="mt-2 text-ink/70">
          {t("Lieber direkt? Ruf an oder schreib per WhatsApp:", "Tu préfères directement ? Appelle ou écris sur WhatsApp :")}{" "}
          <a href="tel:+41787778161" className="font-semibold text-accent-dark underline">078 777 81 61</a>
        </p>
        <div className="mt-10">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-surface-2" />}>
            <Inquiry />
          </Suspense>
        </div>
        </div>
      </div>
    </div>
  );
}
