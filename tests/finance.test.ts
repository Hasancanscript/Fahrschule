import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as billing from "../src/lib/billing";
import test from "node:test";
import assert from "node:assert/strict";
import type { Prisma } from "../src/generated/prisma/client";
import { discountedPrice, checkQuotedPrice, PriceChangedError } from "../src/lib/pricing";
import { monthlyCsv, paymentDate, summarizeInvoices, invoiceBalance, type InvoiceRow } from "../src/lib/billing";
import { notifyCustomer } from "../src/lib/customer-notifications";
import { createInvoice } from "../src/lib/invoices";

const base: InvoiceRow = {
  id: "test", source: "BOOKING", sourceId: "booking", description: "Fahrstunde",
  customerName: "Testkunde", customerEmail: "test@example.invalid", baseCents: 9200,
  discountPercent: 10, amountCents: 8280, createdAt: "2026-08-01T12:00:00Z",
  paidAt: null, paymentMethod: "TWINT", refundedAt: null, cancelledAt: null,
};

test("Discounts use integer cents and round only once", () => {
  assert.equal(discountedPrice({ priceCents: 9200, discountPercent: 10 }), 8280);
  assert.equal(discountedPrice({ priceCents: 42500, discountPercent: 15 }), 36125);
  assert.equal(discountedPrice({ priceCents: 101, discountPercent: 50 }), 51);
  assert.equal(discountedPrice({ priceCents: 9200, discountPercent: 0 }), 9200);
  assert.equal(discountedPrice({ priceCents: 9200, discountPercent: 100 }), 0);
});

test("Monthly income uses Swiss payment dates, not booking dates", () => {
  const totals = summarizeInvoices([{ ...base, paidAt: "2026-09-30T22:30:00Z" }], "2026-10");
  assert.equal(totals.received, 8280);
  assert.equal(totals.open, 0);
  assert.equal(summarizeInvoices([{ ...base, paidAt: "2026-09-30T22:30:00Z" }], "2026-09").received, 0);
});

test("Refunds count in their actual month", () => {
  const rows = [{ ...base, paidAt: "2026-09-05T12:00:00Z", refundedAt: "2026-10-05T12:00:00Z" }];
  assert.equal(summarizeInvoices(rows, "2026-09").net, 8280);
  assert.equal(summarizeInvoices(rows, "2026-10").net, -8280);
});

test("Cancelled unpaid and unknown legacy amounts do not inflate income", () => {
  const rows = [base, { ...base, cancelledAt: "2026-10-01T12:00:00Z" }, { ...base, amountCents: null }];
  const totals = summarizeInvoices(rows, "2026-10");
  assert.equal(totals.received, 0); assert.equal(totals.open, 8280); assert.equal(totals.unknown, 1);
});

test("Cancelling a paid booking does not pretend that money was refunded", () => {
  const totals = summarizeInvoices([{ ...base, paidAt: "2026-10-01T12:00:00Z", cancelledAt: "2026-10-02T12:00:00Z" }], "2026-10");
  assert.equal(totals.received, 8280); assert.equal(totals.refunded, 0);
});

test("CSV blocks formula injection and keeps refunds numeric", () => {
  const csv = monthlyCsv([{ ...base, customerName: "=SUM(A1)", paidAt: "2026-10-01T12:00:00Z", refundedAt: "2026-10-02T12:00:00Z" }], "2026-10");
  assert.ok(csv.includes("'=SUM(A1)")); assert.ok(csv.includes('"-82.80"'));
  assert.ok(!csv.includes("'-82.80")); assert.equal(csv.split("\r\n").length, 3);
});

test("Payment dates reject impossible calendar dates and future dates", () => {
  assert.throws(() => paymentDate("2026-02-30"));
  assert.throws(() => paymentDate("2099-01-01"));
  assert.throws(() => paymentDate("2026-13-01"));
  assert.throws(() => paymentDate("07.10.2026"));
});

test("Invoice price is independent of later offer edits", async () => {
  let saved: Record<string, unknown> = {};
  const tx = { invoice: { create: async ({ data }: { data: Record<string, unknown> }) => { saved = data; return data; } } } as unknown as Prisma.TransactionClient;
  const offer = { priceCents: 9200, discountPercent: 10 };
  await createInvoice(tx, "BOOKING", "test-booking", "Fahrstunde", { name: "Test", email: "test@example.invalid" }, offer);
  offer.priceCents = 15000; offer.discountPercent = 0;
  assert.equal(saved.baseCents, 9200); assert.equal(saved.amountCents, 8280); assert.equal(saved.discountPercent, 10);
});

test("Missing course prices remain unknown rather than becoming zero", async () => {
  let saved: Record<string, unknown> = {};
  const tx = { invoice: { create: async ({ data }: { data: Record<string, unknown> }) => { saved = data; return data; } } } as unknown as Prisma.TransactionClient;
  await createInvoice(tx, "COURSE", "test-course", "Nothelferkurs", { name: "Test", email: "test@example.invalid" }, null);
  assert.equal(saved.amountCents, null); assert.equal(saved.baseCents, null);
});

test("A stale customer quote cannot silently become a different price", () => {
  const offer = { priceCents: 9200, discountPercent: 10 };
  assert.doesNotThrow(() => checkQuotedPrice(8280, offer));
  assert.throws(() => checkQuotedPrice(9200, offer), PriceChangedError);
  assert.throws(() => checkQuotedPrice(null, offer), PriceChangedError);
  assert.doesNotThrow(() => checkQuotedPrice(null, null));
  assert.throws(() => checkQuotedPrice(0, offer), PriceChangedError);
});

test("Partial payments retain the outstanding balance", () => {
  const row = { ...base, amountCents: 9200, payments: [{ id: "p1", kind: "PAYMENT", amountCents: 4000, occurredAt: "2026-10-07T12:00:00Z", paymentMethod: "TWINT" }] };
  const balance = invoiceBalance(row);
  assert.equal(balance.paid, 4000); assert.equal(balance.remaining, 5200); assert.equal(balance.status, "Teilweise bezahlt");
  assert.equal(summarizeInvoices([row], "2026-10").received, 4000); assert.equal(summarizeInvoices([row], "2026-10").open, 5200);
});
test("Only the last installment completes payment; months keep their own receipts", () => {
  const row = { ...base, amountCents: 9200, payments: [{ id: "p1", kind: "PAYMENT", amountCents: 4000, occurredAt: "2026-09-07T12:00:00Z", paymentMethod: "TWINT" }, { id: "p2", kind: "PAYMENT", amountCents: 5200, occurredAt: "2026-10-07T12:00:00Z", paymentMethod: "Bar" }] };
  assert.equal(invoiceBalance(row).status, "Vollständig bezahlt"); assert.equal(invoiceBalance(row).remaining, 0);
  assert.equal(summarizeInvoices([row], "2026-09").received, 4000); assert.equal(summarizeInvoices([row], "2026-10").received, 5200);
  assert.equal(monthlyCsv([row], "2026-10").split("\r\n").length, 2);
});
test("Explicit empty ledgers never infer payment from an old paidAt flag", () => {
  assert.equal(invoiceBalance({ ...base, paidAt: "2026-10-07T12:00:00Z", payments: [] }).paid, 0);
  assert.equal(invoiceBalance({ ...base, amountCents: 0, payments: [] }).remaining, 0);
});
test("Partial refunds reduce the paid balance while cancelled bills stay closed", () => {
  const row = { ...base, amountCents: 9200, payments: [{ id: "p1", kind: "PAYMENT", amountCents: 9200, occurredAt: "2026-09-07T12:00:00Z", paymentMethod: "TWINT" }, { id: "p2", kind: "REFUND", amountCents: 4000, occurredAt: "2026-10-07T12:00:00Z", paymentMethod: "TWINT" }] };
  assert.equal(invoiceBalance(row).paid, 5200); assert.equal(invoiceBalance(row).remaining, 4000);
  assert.equal(invoiceBalance({ ...row, cancelledAt: "2026-10-07T12:00:00Z" }).remaining, 0);
  assert.equal(summarizeInvoices([row], "2026-10").refunded, 4000);
});

// Exercise the actual route with isolated authentication and transaction dependencies.
function paymentRoute() {
  const row: Omit<InvoiceRow, "payments"> & { payments: (billing.PaymentRow & { requestId: string; invoiceId: string })[] } = { ...base, id: "legacy-route-test", amountCents: 9200, payments: [] };
  let role = "ADMIN";
  const notices: { userId: string; kind: string }[] = [];
  const tx = {
    booking: { findUnique: async () => ({ userId: "owner" }) },
    customerNotification: { create: async ({ data }: { data: { userId: string; kind: string } }) => { notices.push(data); return data; } },
    invoice: { findUniqueOrThrow: async () => row, update: async ({ data }: { data: { amountCents: number } }) => Object.assign(row, data) },
    invoicePayment: {
      findUnique: async ({ where }: { where: { requestId: string } }) => row.payments.find(p => p.requestId === where.requestId) ?? null,
      create: async ({ data }: { data: (typeof row.payments)[number] }) => { const payment = { ...data, id: randomUUID() }; row.payments.push(payment); return payment; },
    },
  };
  const require = createRequire(import.meta.url);
  const compiledModule = { exports: {} as { PATCH: (request: Request) => Promise<Response> } };
  const source = readFileSync(new URL("../src/app/api/admin/invoices/route.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  runInNewContext(compiled, { module: compiledModule, exports: compiledModule.exports, require: (name: string) => {
    if (name === "@/auth") return { auth: async () => ({ user: { role } }) };
    if (name === "@/lib/prisma") return { prisma: { $transaction: async (work: (client: typeof tx) => Promise<void>) => work(tx) } };
    if (name === "@/lib/billing") return billing;
    if (name === "@/lib/customer-notifications") return { notifyCustomer };
    return require(name);
  }, Error });
  return { row, notices, setRole: (next: string) => { role = next; }, patch: (input: object) => compiledModule.exports.PATCH(new Request("http://localhost/api/admin/invoices", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, action: "paid", date: "2026-08-02", paymentMethod: "Bar", requestId: randomUUID(), ...input }) })) };
}

test("Payment API records installments, deduplicates retries and rejects overpayment", async () => {
  const route = paymentRoute();
  const requestId = randomUUID();
  assert.equal((await route.patch({ amountCents: 4000, requestId })).status, 200);
  assert.equal(invoiceBalance(route.row).remaining, 5200);
  assert.equal((await route.patch({ amountCents: 4000, requestId })).status, 200);
  assert.equal(route.row.payments.length, 1);
  assert.equal(route.notices.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(route.notices[0])), { userId: "owner", kind: "PAYMENT_CONFIRMED", title: "Fahrstunde", view: "bookings", detail: { amountCents: 4000 } });
  assert.equal((await route.patch({ amountCents: 4001, requestId })).status, 400);
  assert.equal((await route.patch({ amountCents: 5201 })).status, 400);
  assert.equal((await route.patch({ amountCents: 5200 })).status, 200);
  assert.equal(invoiceBalance(route.row).status, "Vollständig bezahlt");
});

test("Payment API requires admin rights and a known active booking price", async () => {
  const route = paymentRoute();
  route.setRole("USER");
  assert.equal((await route.patch({ amountCents: 4000 })).status, 403);
  route.setRole("ADMIN"); route.row.amountCents = null;
  assert.equal((await route.patch({ amountCents: 4000 })).status, 400);
  route.row.amountCents = 9200; route.row.cancelledAt = "2026-08-02T12:00:00Z";
  assert.equal((await route.patch({ amountCents: 4000 })).status, 400);
  assert.equal(route.row.payments.length, 0);
});

test("Legacy total corrections and refunds preserve actual received money", async () => {
  const route = paymentRoute();
  assert.equal((await route.patch({ amountCents: 4000 })).status, 200);
  assert.equal((await route.patch({ action: "amount", amountCents: 3900 })).status, 400);
  assert.equal((await route.patch({ action: "amount", amountCents: 10000 })).status, 200);
  assert.equal(invoiceBalance(route.row).paid, 4000);
  assert.equal(invoiceBalance(route.row).remaining, 6000);
  assert.equal((await route.patch({ action: "refund", amountCents: 1000, date: "2026-08-01" })).status, 400);
  assert.equal((await route.patch({ action: "refund", amountCents: 4001 })).status, 400);
  assert.equal((await route.patch({ action: "refund", amountCents: 1000 })).status, 200);
  assert.equal(invoiceBalance(route.row).paid, 3000);
  assert.equal(route.notices.at(-1)?.kind, "PAYMENT_REFUNDED");
  assert.equal(invoiceBalance(route.row).remaining, 7000);
});

