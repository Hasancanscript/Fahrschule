import { translateUi, type UiLanguage } from "./ui-translations";
export type PaymentRow = { id: string; kind: string; amountCents: number; occurredAt: string; paymentMethod: string };
export type InvoiceRow = {
  id: string; source: string; sourceId: string; description: string; customerName: string; customerEmail: string;
  baseCents: number | null; discountPercent: number; amountCents: number | null; createdAt: string;
  payments?: PaymentRow[];
  paidAt: string | null; paymentMethod: string | null; refundedAt: string | null; cancelledAt: string | null;
};
export function swissDay(date: string | Date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(date));
}
export function paymentDate(day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error("Bitte ein gültiges Zahlungsdatum wählen.");
  const date = new Date(`${day}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== day || day > swissDay()) throw new Error("Bitte ein gültiges Zahlungsdatum bis heute wählen.");
  return date;
}

// Compatibility for old exports; live API responses always include the payment ledger.
export function invoicePayments(row: InvoiceRow): PaymentRow[] {
  if (row.payments) return row.payments;
  const amount = row.amountCents ?? 0;
  return [
    ...(row.paidAt && amount > 0 ? [{ id: "legacy-paid", kind: "PAYMENT", amountCents: amount, occurredAt: row.paidAt, paymentMethod: row.paymentMethod ?? "Andere" }] : []),
    ...(row.refundedAt && amount > 0 ? [{ id: "legacy-refund", kind: "REFUND", amountCents: amount, occurredAt: row.refundedAt, paymentMethod: row.paymentMethod ?? "Andere" }] : []),
  ];
}
export function invoiceBalance(row: InvoiceRow) {
  const payments = invoicePayments(row);
  const received = payments.filter((p) => p.kind === "PAYMENT").reduce((sum, p) => sum + p.amountCents, 0);
  const refunded = payments.filter((p) => p.kind === "REFUND").reduce((sum, p) => sum + p.amountCents, 0);
  const paid = received - refunded;
  const remaining = row.amountCents === null ? null : row.cancelledAt ? 0 : Math.max(row.amountCents - paid, 0);
  const status = row.cancelledAt ? "Storniert" : row.amountCents === null ? "Gesamtpreis fehlt" : row.amountCents === 0 ? "Keine Zahlung nötig" : remaining === 0 ? "Vollständig bezahlt" : paid > 0 ? "Teilweise bezahlt" : received > 0 && paid === 0 ? "Zurückbezahlt" : "Nicht bezahlt";
  return { received, refunded, paid, remaining, status };
}
export function summarizeInvoices(rows: InvoiceRow[], month: string) {
  let received = 0, refunded = 0, open = 0, unknown = 0, openCount = 0, paidCount = 0;
  for (const row of rows) {
    for (const payment of invoicePayments(row)) {
      if (!swissDay(payment.occurredAt).startsWith(month)) continue;
      if (payment.kind === "PAYMENT") received += payment.amountCents;
      else if (payment.kind === "REFUND") refunded += payment.amountCents;
    }
    if (row.cancelledAt) continue;
    const balance = invoiceBalance(row);
    if (balance.remaining === null) unknown++;
    else if (balance.remaining > 0) { open += balance.remaining; openCount++; }
    else paidCount++;
  }
  return { received, refunded, net: received - refunded, open, unknown, openCount, paidCount };
}
export function csvCell(value: string | number) {
  let text = String(value);
  if (/^[=+@\-\t\r\n]/.test(text) && !/^-?\d+(\.\d+)?$/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function monthlyCsv(rows: InvoiceRow[], month: string, lang: UiLanguage = "de") {
  const lines = [["Datum", "Kunde", "Angebot", "Vorgang", "Zahlungsart", "Betrag CHF"].map(label => translateUi(label, lang))];
  for (const row of rows) {
    for (const payment of invoicePayments(row)) {
      if (!swissDay(payment.occurredAt).startsWith(month)) continue;
      const cents = payment.kind === "REFUND" ? -payment.amountCents : payment.amountCents;
      lines.push([swissDay(payment.occurredAt), row.customerName, translateUi(row.description, lang), translateUi(payment.kind === "REFUND" ? "Rückerstattung" : "Zahlung", lang), translateUi(payment.paymentMethod, lang), (cents / 100).toFixed(2)]);
    }
  }
  return "\uFEFF" + lines.map((line) => line.map(csvCell).join(";")).join("\r\n");
}
