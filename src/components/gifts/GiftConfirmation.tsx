"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { giftText, money, methodLabel } from "@/lib/gift-shared";
import { GiftShell, OfflineNotice } from "./GiftCommon";

// Die gerade abgeschickte Bestellung wird nur im Browser (sessionStorage) gemerkt,
// damit die Bestätigungsseite sie anzeigen kann.
type LastOrder = {
  number: string;
  method: string;
  totalCents: number;
  items: { amountCents: number; recipient: string; message: string }[];
};
const KEY = "fahrschule-last-gift-order";

export function saveLastOrder(order: LastOrder) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Privater Modus o. ä.: die Bestätigung erscheint dann ohne Einzelheiten
  }
}

function readLastOrder(): LastOrder | null {
  try {
    const order = JSON.parse(sessionStorage.getItem(KEY) || "null");
    return order && typeof order.number === "string" && Array.isArray(order.items) ? order : null;
  } catch {
    return null;
  }
}

export default function GiftConfirmation() {
  const { lang } = useLanguage(),
    [order, setOrder] = useState<LastOrder | null | undefined>(undefined),
    t = (de: string, fr: string) => giftText(lang, de, fr);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage gibt es erst im Browser
    setOrder(readLastOrder());
  }, []);

  return (
    <GiftShell title={t("Danke für deine Bestellung", "Merci pour ta commande")}>
      {order === undefined ? (
        <p role="status">{t("Wird geladen …", "Chargement …")}</p>
      ) : (
        <>
          <div className="rounded-2xl border border-ink/10 p-6">
            {order && <h2 className="text-xl font-bold">{order.number}</h2>}
            <p className="mt-4">
              {t(
                "Deine Bestellung ist bei uns angekommen. Wir kontaktieren dich, um die Bezahlung und die Übergabe der Gutscheine abzumachen. Bei Fragen erreichst du Hüseyin unter",
                "Ta commande nous est bien parvenue. Nous te contacterons pour convenir du paiement et de la remise des bons. Pour toute question, tu peux joindre Hüseyin au",
              )}{" "}
              <a href="tel:+41787778161" className="font-bold text-accent-dark underline">
                078 777 81 61
              </a>
              .
            </p>
            {order && (
              <>
                <ul className="mt-5 space-y-3">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.recipient} · {money(item.amountCents)}
                      {item.message && <p className="text-sm text-ink/65">{item.message}</p>}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-bold">
                  {t("Gesamtbetrag", "Montant total")}: {money(order.totalCents)}
                </p>
                <p className="mt-2">
                  {t("Gewünschte Bezahlung", "Paiement souhaité")}: {methodLabel(order.method, lang)}
                </p>
              </>
            )}
            <p className="mt-4 text-sm">
              {t(
                "Eine Kopie deiner Bestellung haben wir an deine E-Mail-Adresse geschickt. Falls sie nicht ankommt, prüfe den Spam-Ordner oder kontaktiere die Fahrschule.",
                "Nous avons envoyé une copie de ta commande à ton adresse e-mail. Si tu ne la reçois pas, vérifie les courriers indésirables ou contacte l’auto-école.",
              )}
            </p>
          </div>
          <OfflineNotice />
          <Link href="/" className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-accent-dark hover:underline">
            {t("Zur Startseite", "Retour à l’accueil")}
          </Link>
        </>
      )}
    </GiftShell>
  );
}
