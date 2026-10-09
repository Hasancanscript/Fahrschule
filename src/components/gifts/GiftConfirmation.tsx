"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  giftText,
  money,
  methodLabel,
  statusLabel,
  type GiftOrderRow,
} from "@/lib/gift-shared";
import { GiftShell, OfflineNotice } from "./GiftCommon";
export default function GiftConfirmation({ id }: { id: string }) {
  const { lang } = useLanguage(),
    [order, setOrder] = useState<(GiftOrderRow & { inAccount?: boolean }) | null>(null),
    [error, setError] = useState(false),
    t = (de: string, fr: string) => giftText(lang, de, fr);
  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      try {
        const response = await fetch("/api/gift-orders/" + id, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw Error();
        const data = await response.json();
        if (!controller.signal.aborted) { setOrder(data); setError(false); }
      } catch { if (!controller.signal.aborted) setError(true); }
    }
    const onFocus = () => { if (document.visibilityState === "visible") void refresh(); };
    void refresh();
    const timer = window.setInterval(onFocus, 30000);
    window.addEventListener("focus", onFocus);
    return () => { controller.abort(); window.clearInterval(timer); window.removeEventListener("focus", onFocus); };
  }, [id]);
  return (
    <GiftShell title={t("Danke für deine Bestellung", "Merci pour ta commande")}>
      {error ? (
        <p role="alert">
          {t(
            "Diese Bestellung ist in diesem Browser nicht verfügbar. Bitte kontaktiere die Fahrschule.",
            "Cette commande n’est pas accessible dans ce navigateur. Contacte l’auto-école.",
          )}
        </p>
      ) : !order ? (
        <p role="status">{t("Wird geladen …", "Chargement …")}</p>
      ) : (
        <>
          <div className="rounded-2xl border border-ink/10 p-6">
            <h2 className="text-xl font-bold">{order.number}</h2>
            <p className="mt-3 font-semibold text-accent-dark">
              {statusLabel(order.status, lang)}
            </p>
            {order.status === "PAID" ? <p className="mt-4">{t("Deine Bezahlung wurde bestätigt. Deine Gutscheine sind aktiviert und stehen als PDF zum Herunterladen bereit.", "Ton paiement a été confirmé. Tes bons sont activés et disponibles au téléchargement en PDF.")}</p> : order.status === "CANCELLED" ? <p className="mt-4">{t("Diese Bestellung wurde storniert.", "Cette commande a été annulée.")}</p> : <p className="mt-4">
              {t(
                "Deine Bestellung wurde erfolgreich gespeichert. Wir kontaktieren dich, um die Bezahlung vor Ort zu vereinbaren. Bei Fragen erreichst du Hüseyin unter",
                "Ta commande a bien été enregistrée. Nous te contacterons pour convenir du paiement sur place. Pour toute question, tu peux joindre Hüseyin au",
              )}{" "}
              <a
                href="tel:+41787778161"
                className="font-bold text-accent-dark underline"
              >
                078 777 81 61
              </a>
              .
            </p>}
            <ul className="mt-5 space-y-3">
              {order.vouchers.map((v) => (
                <li key={v.id}>
                  {v.recipient} · {money(v.amountCents)}
                  {v.message && (
                    <p className="text-sm text-ink/65">{v.message}</p>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-bold">
              {t("Gesamtbetrag", "Montant total")}: {money(order.totalCents)}
            </p>
            <p className="mt-2">
              {methodLabel(order.requestedMethod, lang)} ·{" "}
              {t("vor Ort", "sur place")}
            </p>
            <p className="mt-4 text-sm">
              {t(
                "Die Bestätigung wird an deine E-Mail-Adresse gesendet. Falls sie nicht ankommt, prüfe den Spam-Ordner oder kontaktiere die Fahrschule.",
                "La confirmation est envoyée à ton adresse e-mail. Si tu ne la reçois pas, vérifie les courriers indésirables ou contacte l’auto-école.",
              )}
            </p>
            {order.status === "PAID" && (
              <a
                href={`/api/gift-orders/${id}/pdf`}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-action-blue px-5 py-3 text-sm font-bold text-white hover:bg-action-blue-hover"
              >
                {t("Gutscheine als PDF herunterladen", "Télécharger les bons en PDF")}
              </a>
            )}
          </div>
          {order.status === "OPEN" && <OfflineNotice />}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {order.inAccount && <Link href="/booking?view=gifts" className="inline-flex min-h-11 items-center rounded-xl bg-action-blue px-5 py-3 text-sm font-bold text-white hover:bg-action-blue-hover">{t("Meine Gutscheine ansehen", "Voir mes bons cadeaux")}</Link>}
          <Link href="/" className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-accent-dark hover:underline">
            {t("Zur Startseite", "Retour à l’accueil")}
          </Link>
          </div>
        </>
      )}
    </GiftShell>
  );
}
