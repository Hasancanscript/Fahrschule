"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { INQUIRY_OFFERS, OFFER_LABELS, type InquiryOffer } from "@/lib/inquiry";
import { GIFT_BUTTON, GIFT_INPUT } from "@/components/gifts/GiftCommon";

/**
 * Anfrage-Formular für Fahrstunde, 5er-Abo, VKU und Nothelferkurs.
 * Die Anfrage geht per E-Mail an die Fahrschule, die Kundin / der Kunde bekommt eine Kopie.
 * Texte stehen hier direkt auf Deutsch und Französisch (translate="no" verhindert doppeltes Übersetzen).
 */
export default function InquiryForm({ offer: initialOffer = "single", lockOffer = false }: { offer?: InquiryOffer; lockOffer?: boolean }) {
  const { lang } = useLanguage();
  const t = (de: string, fr: string) => (lang === "fr" ? fr : de);
  const [offer, setOffer] = useState<InquiryOffer>(initialOffer);
  const [form, setForm] = useState({ name: "", phone: "", email: "", preferredTimes: "", message: "", learnerPermit: "unknown", website: "" });
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const driving = offer === "single" || offer === "pack5";
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [key]: e.target.value });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const el = e.currentTarget;
    for (const field of Array.from(el.elements)) {
      if (!(field instanceof HTMLInputElement) && !(field instanceof HTMLTextAreaElement)) continue;
      field.setCustomValidity("");
      if (field.validity.valueMissing) field.setCustomValidity(field.type === "checkbox" ? t("Bitte bestätige den Datenschutz-Hinweis.", "Merci de confirmer la note sur la protection des données.") : t("Bitte fülle dieses Feld aus.", "Merci de remplir ce champ."));
      else if (field.validity.typeMismatch) field.setCustomValidity(t("Bitte gib eine gültige E-Mail-Adresse ein.", "Merci de saisir une adresse e-mail valide."));
      else if (field.name === "phone" && !/^[+()\d\s.-]{7,40}$/.test(field.value.trim())) field.setCustomValidity(t("Bitte gib eine gültige Telefonnummer ein.", "Merci de saisir un numéro de téléphone valide."));
    }
    if (!el.reportValidity()) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, learnerPermit: driving ? form.learnerPermit : undefined, offer, lang, accepted }),
      });
      if (!res.ok) {
        throw new Error(
          res.status === 429
            ? t("Zu viele Anfragen. Bitte ruf uns an: 078 777 81 61.", "Trop de demandes. Appelle-nous : 078 777 81 61.")
            : res.status === 400
              ? t("Bitte prüfe deine Angaben.", "Vérifie tes données.")
              : t("Das hat leider nicht geklappt. Bitte ruf uns an oder schreib per WhatsApp: 078 777 81 61.", "Cela n’a malheureusement pas fonctionné. Appelle-nous ou écris sur WhatsApp : 078 777 81 61."),
        );
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof TypeError ? t("Die Verbindung ist unterbrochen. Bitte versuche es erneut.", "La connexion est interrompue. Réessaie.") : err instanceof Error ? err.message : "");
    }
  }

  if (status === "sent") {
    return (
      <div translate="no" role="status" className="rounded-3xl border border-ink/10 bg-card p-8 text-center shadow-sm sm:p-10">
        <p className="font-jakarta text-2xl font-extrabold text-ink">{t("Danke für deine Anfrage!", "Merci pour ta demande !")}</p>
        <p className="mx-auto mt-3 max-w-md text-ink/70">
          {t(
            "Wir melden uns so schnell wie möglich, um mit dir einen Termin abzumachen. Du bekommst eine Kopie per E-Mail.",
            "Nous te contactons dès que possible pour convenir d’un rendez-vous. Tu reçois une copie par e-mail.",
          )}
        </p>
        <button type="button" onClick={() => { setStatus("idle"); setForm({ ...form, preferredTimes: "", message: "" }); }} className="mt-6 text-sm font-semibold text-accent-dark underline">
          {t("Weitere Anfrage senden", "Envoyer une autre demande")}
        </button>
      </div>
    );
  }

  return (
    <form translate="no" noValidate onSubmit={submit} onInput={(e) => { const f = e.target; if (f instanceof HTMLInputElement || f instanceof HTMLTextAreaElement) f.setCustomValidity(""); }} className="rounded-3xl border border-ink/10 bg-card p-6 shadow-sm sm:p-10">
      <fieldset disabled={status === "sending"} className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">{t("Anfrage", "Demande")}</legend>
        {!lockOffer && (
          <label className="text-sm font-semibold sm:col-span-2">
            {t("Was möchtest du anfragen?", "Que souhaites-tu demander ?")}
            <select name="offer" value={offer} onChange={(e) => setOffer(e.target.value as InquiryOffer)} className={GIFT_INPUT}>
              {INQUIRY_OFFERS.map((key) => (
                <option key={key} value={key}>{OFFER_LABELS[key][lang]}</option>
              ))}
            </select>
          </label>
        )}
        <label className="text-sm font-semibold sm:col-span-2">
          {t("Vor- und Nachname", "Prénom et nom")}
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={set("name")} className={GIFT_INPUT} />
        </label>
        <label className="text-sm font-semibold">
          {t("Telefon", "Téléphone")}
          <input name="phone" type="tel" required maxLength={40} autoComplete="tel" inputMode="tel" value={form.phone} onChange={set("phone")} className={GIFT_INPUT} />
        </label>
        <label className="text-sm font-semibold">
          {t("E-Mail", "E-mail")}
          <input name="email" type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={set("email")} className={GIFT_INPUT} />
        </label>
        {driving && (
          <label className="text-sm font-semibold sm:col-span-2">
            {t("Hast du schon einen Lernfahrausweis?", "As-tu déjà un permis d’élève conducteur ?")}
            <select name="learnerPermit" value={form.learnerPermit} onChange={set("learnerPermit")} className={GIFT_INPUT}>
              <option value="yes">{t("Ja", "Oui")}</option>
              <option value="no">{t("Nein, noch nicht", "Non, pas encore")}</option>
              <option value="unknown">{t("Weiss nicht", "Je ne sais pas")}</option>
            </select>
          </label>
        )}
        <label className="text-sm font-semibold sm:col-span-2">
          {t("Wunschtermine", "Dates souhaitées")}
          <span className="block font-normal text-ink/60">{t("Zum Beispiel: Dienstag oder Donnerstag ab 17 Uhr, Samstag vormittags", "Par exemple : mardi ou jeudi dès 17h, samedi matin")}</span>
          <textarea name="preferredTimes" rows={3} maxLength={1000} value={form.preferredTimes} onChange={set("preferredTimes")} className={GIFT_INPUT} />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          {t("Nachricht (optional)", "Message (facultatif)")}
          <textarea name="message" rows={3} maxLength={2000} value={form.message} onChange={set("message")} className={GIFT_INPUT} />
        </label>

        {/* Für Menschen unsichtbar: Spam-Schutz */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></label>
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed sm:col-span-2">
          <input required type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1" />
          <span>
            {t("Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage per E-Mail verwendet werden. Mehr dazu im", "J’accepte que mes données soient utilisées par e-mail pour traiter ma demande. Plus d’informations dans la")}{" "}
            <Link href="/datenschutz" target="_blank" className="text-accent-dark underline">{t("Datenschutz", "déclaration de confidentialité")}</Link>.
          </span>
        </label>

        {status === "error" && error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 sm:col-span-2">{error}</p>
        )}

        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink/60">{t("Die Anfrage ist unverbindlich. Wir bestätigen deinen Termin persönlich.", "La demande est sans engagement. Nous confirmons ton rendez-vous personnellement.")}</p>
          <button className={`${GIFT_BUTTON} px-8 text-base`}>{status === "sending" ? t("Wird gesendet …", "Envoi …") : t("Anfrage senden", "Envoyer la demande")}</button>
        </div>
      </fieldset>
    </form>
  );
}
