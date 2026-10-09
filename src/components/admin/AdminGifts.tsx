"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  giftText,
  money,
  methodLabel,
  statusLabel,
  type GiftOrderRow,
  type GiftSettings,
} from "@/lib/gift-shared";
import { GIFT_BUTTON, GIFT_INPUT } from "@/components/gifts/GiftCommon";
import { swissDay } from "@/lib/billing";
type Data = {
  orders: GiftOrderRow[];
  stats: {
    newOrders: number;
    open: number;
    paidCents: number;
    active: number;
    redeemed: number;
    paidVouchers: number;
    balanceCents: number;
  };
  settings: GiftSettings;
  mailConfigured: boolean;
};
export default function AdminGifts() {
  const { lang } = useLanguage(),
    t = (de: string, fr: string) => giftText(lang, de, fr);
  const [data, setData] = useState<Data | null>(null),
    [selected, setSelected] = useState<string | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [query, setQuery] = useState("");
  const [date, setDate] = useState(swissDay()),
    [method, setMethod] = useState("CASH"),
    [confirmed, setConfirmed] = useState(false),
    [reason, setReason] = useState(""),
    [refund, setRefund] = useState(false),
    [min, setMin] = useState("50"),
    [max, setMax] = useState("1000");
  const [redeem, setRedeem] = useState({
    voucherId: "",
    amount: "",
    reference: "",
    requestId: "",
  });
  async function load(q = "") {
    try {
      const r = await fetch(`/api/admin/gifts?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setData(d);
      setError("");
      setMin(String(d.settings.minCents / 100));
      setMax(String(d.settings.maxCents / 100));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
    }
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial asynchronous admin data load
    void load();
  }, []);
  const order = data?.orders.find((o) => o.id === selected);
  async function act(body: object, url = "/api/admin/gifts") {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setNotice(t("Gespeichert.", "Enregistré."));
      setConfirmed(false);
      setRedeem({ voucherId: "", amount: "", reference: "", requestId: "" });
      await load(query);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setBusy(false);
    }
  }
  const stamp = (s: string) =>
    new Date(s).toLocaleString(lang === "fr" ? "fr-CH" : "de-CH", {
      timeZone: "Europe/Zurich",
      dateStyle: "short",
      timeStyle: "short",
    });
  const events: Record<string, [string, string]> = {
    PDF_DOWNLOADED: ["PDF heruntergeladen", "PDF téléchargé"],
    CREATED: ["Anfrage eingegangen", "Demande reçue"],
    PAID: [
      "Zahlung bestätigt und Gutscheine aktiviert",
      "Paiement confirmé et bons activés",
    ],
    CANCELLED: ["Bestellung storniert", "Commande annulée"],
    REDEEMED: ["Guthaben eingelöst", "Solde utilisé"],
    MAIL_REQUESTED: ["E-Mail-Versand angefordert", "Envoi demandé"],
    MAIL_SENT: ["E-Mail versendet", "E-mail envoyé"],
  };
  return (
    <div className="space-y-6">
      <div aria-live="polite">
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">
            {lang === "de"
              ? error
              : t(
                  "Bitte Angaben oder SMTP-Konfiguration prüfen und erneut versuchen.",
                  "Vérifie les données ou la configuration SMTP et réessaie.",
                )}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-2 text-accent-dark">
            {notice}
          </p>
        )}
      </div>
      {!data ? (
        <button className={GIFT_BUTTON} onClick={() => void load()}>
          {t("Übersicht laden", "Charger l’aperçu")}
        </button>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [
                t(
                  "Neue Bestellungen (7 Tage)",
                  "Nouvelles commandes (7 jours)",
                ),
                data.stats.newOrders,
              ],
              [t("Offene Zahlungen", "Paiements en attente"), data.stats.open],
              [t("Bezahlte Gutscheine", "Bons payés"), data.stats.paidVouchers],
              [t("Aktive Gutscheine", "Bons actifs"), data.stats.active],
              [
                t("Vollständig eingelöst", "Entièrement utilisés"),
                data.stats.redeemed,
              ],
              [
                t("Bestätigte Gutscheinverkäufe", "Ventes de bons confirmées"),
                money(data.stats.paidCents),
              ],
              [
                t("Offenes Gutscheinguthaben", "Solde des bons disponible"),
                money(data.stats.balanceCents),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-ink/10 bg-white p-5"
              >
                <p className="text-sm text-ink/65">{label}</p>
                <p className="mt-2 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
          {!data.mailConfigured && (
            <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm">
              <strong>
                {t(
                  "E-Mail-Versand noch einrichten",
                  "Configurer l’envoi d’e-mails",
                )}
              </strong>
              <p className="mt-2">
                {t(
                  "Bestellungen werden gespeichert. E-Mails bleiben in der Versandwarteschlange, bis SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM und GIFT_ADMIN_EMAIL auf dem Server eingerichtet sind.",
                  "Les commandes sont enregistrées. Les e-mails restent en attente jusqu’à la configuration de SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM et GIFT_ADMIN_EMAIL sur le serveur.",
                )}
              </p>
            </aside>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void load(query);
            }}
            className="flex flex-wrap items-end gap-3"
          >
            <label className="flex-1 text-sm font-semibold">
              {t(
                "Bestellung oder Gutscheincode suchen",
                "Rechercher une commande ou un code de bon",
              )}
              <input
                value={query}
                className={GIFT_INPUT}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(
                  "Bestellnummer, Kunde, E-Mail oder Code",
                  "Numéro, client, e-mail ou code",
                )}
              />
            </label>
            <button className={GIFT_BUTTON}>{t("Suchen", "Rechercher")}</button>
            <button
              type="button"
              onClick={() => void load(query)}
              className="min-h-11 rounded-xl border border-ink/20 px-4 text-sm font-bold"
            >
              {t("Aktualisieren", "Actualiser")}
            </button>
          </form>
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2">
                <tr>
                  {[
                    t("Bestellung", "Commande"),
                    t("Kunde", "Client"),
                    "E-Mail",
                    t("Telefon", "Téléphone"),
                    t("Anzahl", "Quantité"),
                    t("Gesamt", "Total"),
                    t("Zahlungsart", "Paiement"),
                    t("Status", "Statut"),
                    t("Datum", "Date"),
                    t("Aktionen", "Actions"),
                  ].map((h) => (
                    <th key={h} className="whitespace-nowrap p-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o.id} className="border-t border-ink/10">
                    <td className="p-3">{o.number}</td>
                    <td className="p-3">
                      {o.firstName} {o.lastName}
                    </td>
                    <td className="p-3">{o.email}</td>
                    <td className="whitespace-nowrap p-3">{o.phone}</td>
                    <td className="p-3">{o.vouchers.length}</td>
                    <td className="whitespace-nowrap p-3">
                      {money(o.totalCents)}
                    </td>
                    <td className="p-3">
                      {methodLabel(o.paidMethod || o.requestedMethod, lang)}
                    </td>
                    <td className="whitespace-nowrap p-3">
                      {statusLabel(o.status, lang)}
                    </td>
                    <td className="whitespace-nowrap p-3">
                      {stamp(o.createdAt)}
                    </td>
                    <td className="p-3">
                      <button
                        className="min-h-11 font-bold text-accent-dark hover:underline"
                        onClick={() => {
                          setSelected(o.id);
                          setMethod(o.requestedMethod);
                          setConfirmed(false);
                          setRefund(false);
                          setReason("");
                        }}
                      >
                        {t("Öffnen", "Ouvrir")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.orders.length && (
              <p className="p-5">
                {t("Keine Bestellungen gefunden.", "Aucune commande trouvée.")}
              </p>
            )}
          </div>
          <p className="text-xs text-ink/65">
            {t(
              "Die letzten 200 passenden Bestellungen werden angezeigt. Ältere Bestellungen findest du über die Suche.",
              "Les 200 dernières commandes correspondantes sont affichées. Utilise la recherche pour les commandes plus anciennes.",
            )}
          </p>
          {order && (
            <section className="space-y-6 rounded-2xl border border-ink/15 bg-white p-5 sm:p-7">
              <div className="flex flex-wrap justify-between gap-3">
                <h2 className="text-xl font-bold">{order.number}</h2>
                <button
                  className="text-sm font-bold text-accent-dark"
                  onClick={() => setSelected(null)}
                >
                  {t("Details schliessen", "Fermer les détails")}
                </button>
              </div>
              <p>
                {order.firstName} {order.lastName}
                <br />
                {order.email}
                <br />
                {order.phone}
              </p>
              <p className="font-bold">
                {money(order.totalCents)} · {statusLabel(order.status, lang)} ·{" "}
                {methodLabel(order.paidMethod || order.requestedMethod, lang)}
              </p>
              {order.paidAt && (
                <p>
                  {t("Zahlungsdatum", "Date du paiement")}:{" "}
                  {stamp(order.paidAt)}
                </p>
              )}
              {order.status === "OPEN" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void act({
                      action: "pay",
                      id: order.id,
                      method,
                      date,
                      confirmed,
                    });
                  }}
                  className="rounded-xl bg-surface-2 p-5"
                >
                  <h3 className="font-bold">
                    {t("Zahlung bestätigen", "Confirmer le paiement")}
                  </h3>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm">
                      {t(
                        "Tatsächliche Zahlungsart",
                        "Mode de paiement effectif",
                      )}
                      <select
                        className={GIFT_INPUT}
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                      >
                        <option value="CASH">
                          {t("Barzahlung", "Espèces")}
                        </option>
                        <option value="TWINT">TWINT</option>
                      </select>
                    </label>
                    <label className="text-sm">
                      {t("Zahlungsdatum", "Date du paiement")}
                      <input
                        required
                        type="date"
                        max={swissDay()}
                        className={GIFT_INPUT}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </label>
                  </div>
                  <label className="my-4 flex items-start gap-3 text-sm">
                    <input
                      required
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                    />
                    {t(
                      `Ich habe ${money(order.totalCents)} tatsächlich erhalten. Alle Gutscheine dieser Bestellung sollen aktiviert werden.`,
                      `J’ai effectivement reçu ${money(order.totalCents)}. Tous les bons de cette commande doivent être activés.`,
                    )}
                  </label>
                  <button disabled={busy || !confirmed} className={GIFT_BUTTON}>
                    {t(
                      "Zahlung bestätigen und aktivieren",
                      "Confirmer le paiement et activer",
                    )}
                  </button>
                </form>
              )}
              <div className="space-y-4">
                {order.vouchers.map((v) => (
                  <article
                    key={v.id}
                    className="rounded-xl border border-ink/10 p-5"
                  >
                    <h3 className="font-bold">
                      {v.recipient} · {money(v.amountCents)}
                    </h3>
                    {v.message && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-ink/65">
                        {v.message}
                      </p>
                    )}
                    <p className="mt-3 text-sm">
                      {statusLabel(v.status, lang)} ·{" "}
                      {t("Restguthaben", "Solde")}: {money(v.remainingCents)}
                    </p>
                    {order.status === "PAID" && (
                      <>
                        <p className="my-3 break-all font-mono text-sm">
                          {v.code}
                        </p>
                        <a
                          href={`/api/gift-orders/${order.id}/pdf?voucher=${v.id}`}
                          className="inline-flex min-h-11 items-center text-sm font-bold text-accent-dark hover:underline"
                        >
                          {t("PDF herunterladen", "Télécharger le PDF")}
                        </a>
                        {v.status === "ACTIVE" && (
                          <button
                            className="ml-5 min-h-11 text-sm font-bold text-accent-dark"
                            onClick={() =>
                              setRedeem({
                                voucherId: v.id,
                                amount: "",
                                reference: "",
                                requestId: crypto.randomUUID(),
                              })
                            }
                          >
                            {t("Guthaben einlösen", "Utiliser le solde")}
                          </button>
                        )}
                      </>
                    )}
                    {v.redemptions.map((r) => (
                      <p key={r.id} className="mt-2 text-xs text-ink/65">
                        {stamp(r.createdAt)} · {money(r.amountCents)} ·{" "}
                        {r.reference}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
              {redeem.voucherId && order.status === "PAID" && (
                <form
                  className="space-y-4 rounded-xl bg-surface-2 p-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void act({
                      action: "redeem",
                      id: order.id,
                      voucherId: redeem.voucherId,
                      amountCents: Math.round(Number(redeem.amount) * 100),
                      reference: redeem.reference,
                      requestId: redeem.requestId,
                    });
                  }}
                >
                  <h3 className="font-bold">
                    {t(
                      "Teilbetrag oder gesamtes Guthaben einlösen",
                      "Utiliser un montant partiel ou le solde entier",
                    )}
                  </h3>
                  <label className="block text-sm">
                    {t("Betrag in CHF", "Montant en CHF")}
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={
                        (order.vouchers.find((v) => v.id === redeem.voucherId)
                          ?.remainingCents ?? 0) / 100
                      }
                      className={GIFT_INPUT}
                      value={redeem.amount}
                      onChange={(e) =>
                        setRedeem({ ...redeem, amount: e.target.value })
                      }
                    />
                  </label>
                  <label className="block text-sm">
                    {t(
                      "Leistung / Buchungsreferenz",
                      "Prestation / référence de réservation",
                    )}
                    <input
                      required
                      maxLength={200}
                      className={GIFT_INPUT}
                      value={redeem.reference}
                      onChange={(e) =>
                        setRedeem({ ...redeem, reference: e.target.value })
                      }
                    />
                  </label>
                  <button disabled={busy} className={GIFT_BUTTON}>
                    {t("Einlösung speichern", "Enregistrer l’utilisation")}
                  </button>
                  <button
                    type="button"
                    className="ml-4 text-sm"
                    onClick={() => setRedeem({ ...redeem, voucherId: "" })}
                  >
                    {t("Abbrechen", "Annuler")}
                  </button>
                </form>
              )}
              {order.status === "PAID" && (
                <div className="flex flex-wrap gap-4">
                  <a
                    className={GIFT_BUTTON}
                    href={`/api/gift-orders/${order.id}/pdf`}
                  >
                    {t("Alle Gutscheine als PDF", "Tous les bons en PDF")}
                  </a>
                  <button
                    disabled={busy || !data.mailConfigured}
                    className="min-h-11 rounded-xl border border-accent-dark px-5 text-sm font-bold text-accent-dark disabled:opacity-50"
                    onClick={() =>
                      void act({
                        action: "email",
                        id: order.id,
                        requestId: crypto.randomUUID(),
                      })
                    }
                  >
                    {t(
                      "PDFs per E-Mail versenden",
                      "Envoyer les PDF par e-mail",
                    )}
                  </button>
                </div>
              )}
              <div>
                <h3 className="font-bold">
                  {t("E-Mail-Versand", "Envoi d’e-mails")}
                </h3>
                {order.mails.map((m) => (
                  <p key={m.id} className="mt-2 text-sm">
                    {m.kind === "ADMIN"
                      ? t(
                          "Admin-Benachrichtigung",
                          "Notification administrateur",
                        )
                      : m.kind === "VOUCHERS"
                        ? t("PDF-Gutscheine", "Bons PDF")
                        : t(
                            "Bestellbestätigung",
                            "Confirmation de commande",
                          )}{" "}
                    · {statusLabel(m.status, lang)}
                  </p>
                ))}
                <button
                  disabled={busy || !data.mailConfigured}
                  onClick={() =>
                    void act({ action: "retryMail", id: order.id })
                  }
                  className="mt-3 min-h-11 text-sm font-bold text-accent-dark disabled:opacity-50"
                >
                  {t(
                    "Ausstehende E-Mails erneut senden",
                    "Renvoyer les e-mails en attente",
                  )}
                </button>
              </div>
              <details>
                <summary className="cursor-pointer font-bold">
                  {t("Bestellhistorie", "Historique de la commande")}
                </summary>
                <ol className="mt-4 space-y-3">
                  {order.events.map((e) => (
                    <li key={e.id} className="text-sm">
                      <strong>
                        {stamp(e.createdAt)} ·{" "}
                        {events[e.kind]?.[lang === "fr" ? 1 : 0] || e.kind}
                      </strong>
                      {e.detail.amountCents !== undefined && (
                        <span> · {money(Number(e.detail.amountCents))}</span>
                      )}
                      {e.detail.reference !== undefined && (
                        <p>{String(e.detail.reference)}</p>
                      )}
                      {e.detail.reason !== undefined && (
                        <p>{String(e.detail.reason)}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </details>
              {order.status !== "CANCELLED" && (
                <details>
                  <summary className="cursor-pointer font-bold text-red-800">
                    {t("Bestellung stornieren", "Annuler la commande")}
                  </summary>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void act({
                        action: "cancel",
                        id: order.id,
                        reason,
                        refundConfirmed: refund,
                      });
                    }}
                    className="mt-4 space-y-4"
                  >
                    <label className="block text-sm">
                      {t("Grund", "Motif")}
                      <input
                        required
                        maxLength={500}
                        className={GIFT_INPUT}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </label>
                    {order.status === "PAID" && (
                      <label className="flex items-start gap-3 text-sm">
                        <input
                          required
                          type="checkbox"
                          checked={refund}
                          onChange={(e) => setRefund(e.target.checked)}
                        />
                        {t(
                          "Der vollständige Betrag wurde tatsächlich zurückbezahlt. Bereits eingelöste Gutscheine können nicht storniert werden.",
                          "Le montant intégral a effectivement été remboursé. Les bons déjà utilisés ne peuvent pas être annulés.",
                        )}
                      </label>
                    )}
                    <button
                      disabled={busy}
                      className="min-h-11 rounded-xl bg-red-800 px-5 text-sm font-bold text-white"
                    >
                      {t("Stornierung bestätigen", "Confirmer l’annulation")}
                    </button>
                  </form>
                </details>
              )}
            </section>
          )}
          <details className="rounded-2xl border border-ink/10 bg-white p-5">
            <summary className="cursor-pointer font-bold">
              {t(
                "Wunschbeträge konfigurieren",
                "Configurer les montants personnalisés",
              )}
            </summary>
            <form
              className="mt-5 flex flex-wrap items-end gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                void act(
                  {
                    minCents: Math.round(Number(min) * 100),
                    maxCents: Math.round(Number(max) * 100),
                  },
                  "/api/gifts/settings",
                );
              }}
            >
              <label className="text-sm">
                {t("Mindestbetrag in CHF", "Montant minimum en CHF")}
                <input
                  required
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  className={GIFT_INPUT}
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                />
              </label>
              <label className="text-sm">
                {t("Höchstbetrag in CHF", "Montant maximum en CHF")}
                <input
                  required
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  className={GIFT_INPUT}
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </label>
              <button disabled={busy} className={GIFT_BUTTON}>
                {t("Speichern", "Enregistrer")}
              </button>
            </form>
          </details>
        </>
      )}
    </div>
  );
}
