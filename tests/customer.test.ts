import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { PDFDocument, PDFName } from "pdf-lib";
import * as customer from "../src/lib/customer";
import { bookingDate, bookingRange, upcomingBookings, safeReturnPath, type CustomerAccount, type CustomerBooking } from "../src/lib/customer";
import { createBookingPdf } from "../src/lib/booking-pdf";
import * as billing from "../src/lib/billing";

const booking: CustomerBooking = { id: "own-booking", kind: "lesson", title: "Fahrstunde", status: "PENDING", startTime: "2026-10-08T08:00:00Z", endTime: "2026-10-08T08:45:00Z", location: null, notes: null, packageName: null, payment: { totalCents: 9200, paidCents: 4000, remainingCents: 5200, status: "Teilweise bezahlt" } };
const account: CustomerAccount = { user: { name: "Hüseyin Şahin", email: "test@example.invalid", phone: null }, bookings: [booking], packages: [] };
function isolate<T>(file: string, stubs: Record<string, unknown>): T {
  const require = createRequire(import.meta.url);
  const compiledModule = { exports: {} as T };
  const code = ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  runInNewContext(code, { module: compiledModule, exports: compiledModule.exports, require: (name: string) => Object.hasOwn(stubs, name) ? stubs[name] : require(name), Response, URL, Uint8Array, Date, Map, process });
  return compiledModule.exports;
}

test("Booking dates and times use Switzerland including DST and multi-day courses", () => {
  assert.match(bookingDate("2026-10-07T23:30:00Z"), /08\. Oktober 2026/);
  assert.equal(bookingRange(booking), "10:00 bis 10:45 Uhr");
  assert.match(bookingRange({ startTime: "2026-10-08T08:00:00Z", endTime: "2026-10-09T15:00:00Z" }), /09\. Oktober 2026, 17:00 Uhr/);
  assert.equal(bookingRange({ startTime: "2026-12-08T08:00:00Z", endTime: "2026-12-08T08:45:00Z" }), "09:00 bis 09:45 Uhr");
});
test("Upcoming bookings exclude cancelled and completed entries and retain ongoing courses", () => {
  const now = new Date("2026-10-08T08:10:00Z").getTime();
  const rows = [booking, { ...booking, id: "cancelled", status: "CANCELLED" }, { ...booking, id: "completed", status: "COMPLETED" }, { ...booking, id: "past", endTime: "2026-10-08T07:00:00Z" }];
  assert.deepEqual(upcomingBookings(rows, now).map(b => b.id), ["own-booking"]);
});
test("Login return paths cannot redirect to another origin", () => {
  for (const path of [null, "https://example.invalid", "//example.invalid", "/\\example.invalid"]) assert.equal(safeReturnPath(path), "/booking");
  assert.equal(safeReturnPath("/vku?booking=1"), "/vku?booking=1");
});
test("PDF embeds local fonts for German and Turkish names and retains booking metadata", async () => {
  const bytes = await createBookingPdf(account.user, booking);
  assert.equal(Buffer.from(bytes).subarray(0, 5).toString(), "%PDF-");
  const doc = await PDFDocument.load(bytes);
  assert.equal(doc.getPageCount(), 1);
  assert.equal(doc.getTitle(), "Buchungsübersicht: Fahrstunde");
  assert.equal(doc.getAuthor(), "Fahrschule fürs Leben");
  assert.ok(doc.getPage(0).node.Resources()?.has(PDFName.of("XObject")), "Company logo is embedded");
});
test("Long notes create additional PDF pages instead of losing content", async () => {
  const bytes = await createBookingPdf(account.user, { ...booking, kind: "course", title: "Nothelferkurs", location: "Biel/Bienne", notes: "Meine Anmerkung mit Umlauten äöü und Ş.\n".repeat(70) });
  const doc = await PDFDocument.load(bytes);
  assert.ok(doc.getPageCount() > 1);
  for (const page of doc.getPages()) assert.ok(page.node.Resources()?.has(PDFName.of("XObject")), "Each page has the company logo");
});
test("Customer PDF route rejects signed-out users and other people's bookings", async () => {
  let userId: string | null = null, calls = 0;
  const route = isolate<{ GET: (request: Request, context: { params: Promise<{ kind: string; id: string }> }) => Promise<Response> }>("../src/app/api/account/bookings/[kind]/[id]/pdf/route.ts", {
    "@/auth": { auth: async () => userId ? { user: { id: userId } } : null },
    "@/lib/customer-data": { loadCustomerAccount: async (id: string) => { assert.equal(id, "current-user"); calls++; return account; } },
    "@/lib/booking-pdf": { createBookingPdf },
  });
  const get = (kind: string, id: string) => route.GET(new Request("http://localhost/pdf"), { params: Promise.resolve({ kind, id }) });
  assert.equal((await get("lesson", "own-booking")).status, 401); assert.equal(calls, 0);
  userId = "current-user";
  assert.equal((await get("lesson", "someone-elses-booking")).status, 404);
  assert.equal((await get("course", "own-booking")).status, 404);
  assert.equal((await get("invalid", "own-booking")).status, 404);
  const response = await get("lesson", "own-booking");
  assert.equal(response.status, 200); assert.equal(response.headers.get("Content-Type"), "application/pdf");
  assert.match(response.headers.get("Content-Disposition")!, /^attachment; filename="Buchung-/);
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  assert.equal((await PDFDocument.load(await response.arrayBuffer())).getPageCount(), 1);
});
test("Customer data scopes every source to the user and uses the stored price snapshot", async () => {
  const invoiceQueries: unknown[] = [];
  const currentPrice = { name: "Fahrstunde", priceCents: 12000 };
  const data = isolate<{ loadCustomerAccount: (id: string) => Promise<CustomerAccount> }>("../src/lib/customer-data.ts", {
    "@/lib/billing": billing,
    "@/lib/prisma": { prisma: {
      user: { findUnique: async (query: { where: { id: string }; select: object }) => { assert.equal(query.where.id, "current-user"); assert.equal("password" in query.select, false); return account.user; } },
      booking: { findMany: async (query: { where: { userId: string } }) => { assert.equal(query.where.userId, "current-user"); return [{ id: "own-booking", service: currentPrice, status: "PENDING", slot: { startTime: new Date(booking.startTime), endTime: new Date(booking.endTime) }, userPackage: null, userPackageId: null, notes: null }]; } },
      courseBooking: { findMany: async (query: { where: { userId: string } }) => { assert.equal(query.where.userId, "current-user"); return []; } },
      userPackage: { findMany: async (query: { where: { userId: string } }) => { assert.equal(query.where.userId, "current-user"); return []; } },
      invoice: { findMany: async (query: unknown) => { invoiceQueries.push(query); return [{ id: "invoice", source: "BOOKING", sourceId: "own-booking", description: "Fahrstunde", customerName: account.user.name, customerEmail: account.user.email, baseCents: 9200, discountPercent: 0, amountCents: 9200, createdAt: new Date(), paidAt: null, refundedAt: null, cancelledAt: null, paymentMethod: null, payments: [{ id: "receipt", kind: "PAYMENT", amountCents: 4000, occurredAt: new Date(), paymentMethod: "TWINT" }] }]; } },
    } },
  });
  const result = await data.loadCustomerAccount("current-user");
  assert.deepEqual(JSON.parse(JSON.stringify(invoiceQueries[0])), { where: { OR: [{ source: "BOOKING", sourceId: { in: ["own-booking"] } }, { source: "COURSE", sourceId: { in: [] } }, { source: "PACKAGE", sourceId: { in: [] } }] }, include: { payments: true } });
  assert.equal(result.bookings[0].payment.totalCents, 9200); assert.equal(result.bookings[0].payment.paidCents, 4000); assert.equal(result.bookings[0].payment.remainingCents, 5200);
});

test("PDF includes a remaining balance only for unpaid amounts and directs customers to their instructor", async () => {
  const drawn: string[] = [];
  const pdf = isolate<{ createBookingPdf: typeof createBookingPdf }>("../src/lib/booking-pdf.ts", {
    "@/lib/customer": customer,
    "@/lib/pricing": { formatPrice: (cents: number) => `CHF ${(cents / 100).toFixed(2)}` },
    "pdf-lib": { PDFDocument: { create: async () => {
      const doc = await PDFDocument.create();
      const addPage = doc.addPage.bind(doc);
      doc.addPage = (...args: Parameters<typeof addPage>) => {
        const page = addPage(Array.isArray(args[0]) ? Array.from(args[0]) as [number, number] : args[0]), drawText = page.drawText.bind(page);
        const drawLine = page.drawLine.bind(page);
        page.drawLine = options => drawLine({ ...options, start: { ...options.start }, end: { ...options.end } });
        page.drawText = (value, options) => { drawn.push(value); return drawText(value, options); };
        return page;
      };
      return doc;
    } }, rgb: (red: number, green: number, blue: number) => ({ type: "RGB", red, green, blue }) },
  });
  for (const remainingCents of [5200, 0, null]) {
    drawn.length = 0;
    await pdf.createBookingPdf(account.user, { ...booking, payment: { ...booking.payment, remainingCents } });
    const text = drawn.join(" ");
    assert.equal(text.includes("Noch offen:"), remainingCents === 5200);
    if (remainingCents === 5200) assert.match(text, /Noch offen: CHF 52.00/);
    assert.match(text, /direkt mit dem Fahrlehrer/);
  }
});
