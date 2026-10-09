"use client";
import TranslatedContent from "@/components/TranslatedContent";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { invoiceBalance, invoicePayments, monthlyCsv, summarizeInvoices, swissDay, type InvoiceRow } from "@/lib/billing";
import { formatPrice } from "@/lib/pricing";
const INPUT = "mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm";
type Action = "amount" | "paid" | "refund";
type View = "month" | "open" | "paid" | "all";
export default function AdminBilling({ invoices, pending, onSave }: { invoices: InvoiceRow[]; pending: boolean; onSave: (url: string, body: object, message: string, reset?: () => void, method?: string) => Promise<boolean> }) {
  const { lang } = useLanguage();
  const [month, setMonth] = useState(swissDay().slice(0, 7));
  const [view, setView] = useState<View>("month");
  const [editing, setEditing] = useState<{ id: string; action: Action; requestId: string } | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentDay, setPaymentDay] = useState(swissDay());
  const [method, setMethod] = useState("TWINT");
  const totals = summarizeInvoices(invoices, month);
  const visible = invoices.filter((row) => {
    const balance = invoiceBalance(row);
    if (view === "open") return !row.cancelledAt && (balance.remaining === null || balance.remaining > 0);
    if (view === "paid") return !row.cancelledAt && balance.remaining === 0;
    if (view === "all") return true;
    return [row.createdAt, ...invoicePayments(row).map((p) => p.occurredAt)].some((date) => swissDay(date).startsWith(month));
  });
  function openForm(row: InvoiceRow, action: Action) {
    const balance = invoiceBalance(row);
    setEditing({ id: row.id, action, requestId: crypto.randomUUID() });
    setAmount(action === "amount" ? row.amountCents === null ? "" : (row.amountCents / 100).toFixed(2) : ((action === "paid" ? balance.remaining ?? 0 : balance.paid) / 100).toFixed(2));
    setPaymentDay(swissDay());
  }
  async function update(row: InvoiceRow) {
    if (!editing) return;
    const cents = Math.round(Number(amount) * 100);
    if (editing.action === "refund" && !window.confirm(lang === "fr" ? `Les ${formatPrice(cents)} ont-ils réellement été remboursés à ${row.customerName} ?` : `Wurden ${formatPrice(cents)} an ${row.customerName} tatsächlich zurückbezahlt?`)) return;
    const ok = await onSave("/api/admin/invoices", { id: row.id, action: editing.action, amountCents: cents, date: paymentDay, paymentMethod: method, requestId: editing.requestId }, editing.action === "amount" ? "Gesamtpreis gespeichert. Erfasse jetzt separat den tatsächlich erhaltenen Zahlungsbetrag." : editing.action === "refund" ? "Rückerstattung gespeichert. Zahlungsstatus und Monatsübersicht sind aktualisiert." : "Zahlung gespeichert. Der Restbetrag und Zahlungsstatus sind aktualisiert.", undefined, "PATCH");
    if (ok) setEditing(null);
  }
  function download() {
    const url = URL.createObjectURL(new Blob([monthlyCsv(invoices, month, lang)], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a"); link.href = url; link.download = `${lang === "fr" ? "Releve-paiements" : "Zahlungsuebersicht"}-${month}.csv`; link.click(); URL.revokeObjectURL(url);
  }
  return <TranslatedContent>{<div>
    <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-5"><label className="text-sm font-semibold">Monat auswählen<input className={INPUT} type="month" required value={month} onChange={(event) => { if (event.target.value) setMonth(event.target.value); }} /></label><button type="button" onClick={download} className="rounded-xl border border-accent-dark px-4 py-3 text-sm font-bold text-accent-dark">Monat als CSV herunterladen</button></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "Zahlungseingänge im Monat", cents: totals.received }, { label: "Rückerstattungen im Monat", cents: totals.refunded }, { label: "Eingenommen nach Rückerstattungen", cents: totals.net }, { label: "Noch offen · alle Monate", cents: totals.open }].map((item) => <div key={item.label} className="rounded-2xl border border-ink/10 bg-white p-5"><p className="text-xs font-semibold text-ink/60">{item.label}</p><p className="mt-3 text-2xl font-extrabold">{formatPrice(item.cents)}</p></div>)}</div>
    <div role="status" className={`mt-5 rounded-xl border p-4 text-sm ${totals.openCount || totals.unknown ? "border-amber-200 bg-amber-50 text-amber-900" : "border-green-200 bg-green-50 text-accent-dark"}`}><p className="font-bold">{totals.openCount ? `${totals.openCount} Buchung${totals.openCount === 1 ? " ist" : "en sind"} noch nicht vollständig bezahlt.` : totals.unknown ? "Es fehlen noch Gesamtpreise. Der Zahlungsstatus ist deshalb noch unvollständig." : totals.paidCount ? "Alle erfassten, nicht stornierten Buchungen sind vollständig bezahlt." : "Noch keine offenen Buchungsbeträge vorhanden."}</p><p className="mt-1">{totals.paidCount} vollständig bezahlt · {totals.openCount} offen oder teilweise bezahlt{totals.unknown ? ` · bei ${totals.unknown} Einträgen fehlt der Gesamtpreis` : ""}</p></div>
    <p className="mt-4 text-sm leading-relaxed text-ink/60">Der Gesamtpreis ist der vereinbarte Preis der Buchung. Unter „Zahlung erfassen“ trägst du ein, wie viel du tatsächlich erhalten hast. Teilzahlungen sind möglich: der Rest bleibt offen. Abo-Fahrstunden werden nicht doppelt gezählt.</p>
    {totals.unknown > 0 && <p className="mt-3 text-sm text-ink/60">Bei älteren Buchungen bitte zuerst den vollständigen Gesamtpreis anhand deiner Unterlagen nachtragen. Ein kleinerer Zahlungsbetrag gehört danach in „Zahlung erfassen“.</p>}
    <div className="my-5 flex flex-wrap gap-3">{[{ id: "month" as View, label: "Einträge im Monat" }, { id: "open" as View, label: "Offen & teilweise bezahlt" }, { id: "paid" as View, label: "Vollständig bezahlt" }, { id: "all" as View, label: "Alle Buchungen" }].map((tab) => <button key={tab.id} type="button" aria-pressed={view === tab.id} onClick={() => setView(tab.id)} className={`rounded-xl border px-4 py-2 text-sm font-semibold ${view === tab.id ? "border-accent-dark bg-accent-soft" : "border-ink/15 bg-white"}`}>{tab.label}</button>)}</div>
    {visible.length === 0 && <p className="rounded-xl bg-white p-5 text-sm text-ink/60">Für diese Auswahl gibt es noch keine Einträge.</p>}
    <ul className="space-y-4">{visible.map((row) => {
      const balance = invoiceBalance(row);
      const history = invoicePayments(row);
      const isEditing = editing?.id === row.id;
      const paidInFull = !row.cancelledAt && balance.remaining === 0;
      return <li key={row.id} className="rounded-2xl border border-ink/10 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 translate="no" className="font-bold">{row.customerName}</h3><p className="mt-1 text-sm text-ink/60">{row.description} · erfasst am {swissDay(row.createdAt)}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${row.cancelledAt ? "bg-ink/5 text-ink/60" : paidInFull ? "bg-green-100 text-accent-dark" : "bg-amber-100 text-amber-900"}`}>{balance.status}</span></div>
        <dl className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-surface-2 p-4 sm:grid-cols-3"><div><dt className="text-xs text-ink/60">Gesamtpreis der Buchung</dt><dd className="mt-1 text-lg font-bold">{row.amountCents === null ? "Noch nicht erfasst" : formatPrice(row.amountCents)}</dd></div><div><dt className="text-xs text-ink/60">Bereits bezahlt{balance.refunded > 0 ? " · nach Rückerstattungen" : ""}</dt><dd className="mt-1 text-lg font-bold text-accent-dark">{formatPrice(balance.paid)}</dd></div><div><dt className="text-xs text-ink/60">Noch offen</dt><dd className={`mt-1 text-lg font-bold ${balance.remaining ? "text-amber-800" : "text-ink"}`}>{balance.remaining === null ? "Gesamtpreis fehlt" : formatPrice(balance.remaining)}</dd></div></dl>
        {row.cancelledAt && balance.paid > 0 && <p className="mt-3 text-xs font-semibold text-amber-800">Storniert, aber es ist noch Geld eingegangen. Erfasse eine Rückerstattung erst, wenn du das Geld wirklich zurückbezahlt hast.</p>}
        <div className="mt-4 flex flex-wrap gap-3">{!row.cancelledAt && row.amountCents !== null && (balance.remaining ?? 0) > 0 && <button disabled={pending} type="button" className="rounded-lg bg-action-green px-4 py-2 text-sm font-bold text-white" onClick={() => openForm(row, "paid")}>Zahlung erfassen</button>}{(row.amountCents === null || row.id.startsWith("legacy-")) && <button disabled={pending} type="button" className="rounded-lg border border-ink/15 px-3 py-2 text-sm font-semibold" onClick={() => openForm(row, "amount")}>{row.amountCents === null ? "Gesamtpreis nachtragen" : "Gesamtpreis korrigieren"}</button>}{balance.paid > 0 && <button disabled={pending} type="button" className="px-3 py-2 text-sm font-semibold text-ink/60 underline" onClick={() => openForm(row, "refund")}>Rückerstattung erfassen</button>}</div>
        {isEditing && <form className="mt-5 rounded-xl border border-ink/10 p-4" onSubmit={(event) => { event.preventDefault(); void update(row); }}><h4 className="mb-3 text-sm font-bold">{editing.action === "amount" ? "Gesamtpreis festlegen" : editing.action === "paid" ? "Zahlung oder Teilzahlung erfassen" : "Rückerstattung erfassen"}</h4><fieldset disabled={pending} className="grid gap-4 sm:grid-cols-3"><label className="text-sm font-semibold">{editing.action === "amount" ? "Vollständiger Gesamtpreis in CHF" : editing.action === "paid" ? "Jetzt erhaltener Betrag in CHF" : "Zurückbezahlter Betrag in CHF"}<input className={INPUT} required type="number" min={editing.action === "amount" ? 0 : 0.01} max={editing.action === "amount" ? undefined : (editing.action === "paid" ? balance.remaining ?? 0 : balance.paid) / 100} step={0.01} value={amount} onChange={(event) => setAmount(event.target.value)} /></label>{editing.action !== "amount" && <><label className="text-sm font-semibold">Datum<input className={INPUT} required type="date" max={swissDay()} value={paymentDay} onChange={(event) => setPaymentDay(event.target.value)} /></label><label className="text-sm font-semibold">Zahlungsart<select className={INPUT} value={method} onChange={(event) => setMethod(event.target.value)}>{["Bar", "TWINT", "Überweisung", "Andere"].map((name) => <option key={name} value={name}>{name}</option>)}</select></label></>}<p className="text-xs leading-relaxed text-ink/60 sm:col-span-3">{editing.action === "amount" ? "Hier gehört der gesamte vereinbarte Preis hinein. Dies erfasst noch keinen Zahlungseingang." : editing.action === "paid" ? "Auch ein kleinerer Betrag ist möglich. Die Buchung bleibt dann teilweise bezahlt, bis der Rest eingegangen ist." : "Nur den tatsächlich zurückbezahlten Betrag erfassen."}</p><div className="flex flex-wrap gap-3 sm:col-span-3"><button disabled={pending} className="rounded-lg bg-action-green px-4 py-2.5 text-sm font-bold text-white" type="submit">{pending ? "Wird gespeichert …" : editing.action === "amount" ? "Gesamtpreis speichern" : editing.action === "paid" ? "Zahlung speichern" : "Rückerstattung speichern"}</button><button disabled={pending} type="button" onClick={() => setEditing(null)} className="px-3 py-2 text-sm text-ink/60">Abbrechen</button></div></fieldset></form>}
        {history.length > 0 && <details className="mt-4 border-t border-ink/10 pt-3"><summary className="cursor-pointer text-xs font-semibold text-ink/60">Zahlungsverlauf anzeigen ({history.length})</summary><ul className="mt-3 space-y-2">{history.map((payment) => <li key={payment.id} className="flex flex-wrap justify-between gap-2 text-xs text-ink/60"><span>{swissDay(payment.occurredAt)} · {payment.paymentMethod} · {payment.kind === "REFUND" ? "Rückerstattung" : "Zahlung"}</span><span className="font-semibold">{payment.kind === "REFUND" ? "− " : "+ "}{formatPrice(payment.amountCents)}</span></li>)}</ul></details>}
      </li>;
    })}</ul>
  </div>}</TranslatedContent>;
}
