import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { canChangeLesson, CHANGE_NOTICE_MS } from "../src/lib/booking-policy";
import * as policy from "../src/lib/booking-policy";

const NOW = new Date("2026-10-07T12:00:00Z").getTime();
class FixedDate extends Date { constructor(value: string | number = NOW) { super(value); } static now() { return NOW; } }
function routeFixture() {
  const require = createRequire(import.meta.url);
  let userId: string | null = "owner";
  let store = { booking: { id: "booking", userId: "owner", slotId: "old", status: "CONFIRMED", userPackageId: "abo" as string | null },
    slots: { old: { id: "old", startTime: new Date(NOW + CHANGE_NOTICE_MS), isBooked: true }, next: { id: "next", startTime: new Date(NOW + 3 * CHANGE_NOTICE_MS), isBooked: false } },
    credit: 2, invoice: { amountCents: 9200, paidCents: 4000, cancelled: false } };
  const tx = {
    booking: {
      findFirst: async ({ where }: { where: { id: string; userId: string } }) => where.id === store.booking.id && where.userId === store.booking.userId ? { ...store.booking, slot: store.slots.old } : null,
      updateMany: async ({ where, data }: { where: { status: string; slotId: string }; data: { slotId?: string; status: string } }) => {
        if (store.booking.status !== where.status || store.booking.slotId !== where.slotId) return { count: 0 }; Object.assign(store.booking, data); return { count: 1 };
      },
    },
    slot: {
      updateMany: async ({ where }: { where: { id: string; startTime: { gt: Date } } }) => { if (where.id !== "next" || store.slots.next.isBooked || store.slots.next.startTime <= where.startTime.gt) return { count: 0 }; store.slots.next.isBooked = true; return { count: 1 }; },
      update: async () => { store.slots.old.isBooked = false; },
    },
    userPackage: { update: async () => { store.credit++; } },
  };
  const source = readFileSync(new URL("../src/app/api/account/bookings/lesson/[id]/route.ts", import.meta.url), "utf8");
  const compiledModule = { exports: {} as { PATCH: (request: Request, context: { params: Promise<{ id: string }> }) => Promise<Response> } };
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    module: compiledModule, exports: compiledModule.exports, Response, Date: FixedDate,
    require: (name: string) => {
      if (name === "@/auth") return { auth: async () => userId ? { user: { id: userId, role: "CUSTOMER" } } : null };
      if (name === "@/lib/booking-policy") return policy;
      if (name === "@/lib/invoices") return { cancelInvoice: async () => { store.invoice.cancelled = true; } };
      if (name === "@/lib/prisma") return { prisma: { $transaction: async (work: (client: typeof tx) => Promise<void>, options: { isolationLevel: string }) => { assert.equal(options.isolationLevel, "Serializable"); const snapshot = structuredClone(store); try { await work(tx); } catch (error) { store = snapshot; throw error; } } } };
      return require(name);
    },
  });
  return { get store() { return store; }, setUser: (next: string | null) => { userId = next; }, patch: (body: object) => compiledModule.exports.PATCH(new Request("http://localhost", { method: "PATCH", body: JSON.stringify(body) }), { params: Promise.resolve({ id: "booking" }) }) };
}
test("24-hour policy is exact and only active lessons can be changed", () => {
  assert.equal(canChangeLesson("CONFIRMED", new Date(NOW + CHANGE_NOTICE_MS), NOW), true);
  assert.equal(canChangeLesson("PENDING", new Date(NOW + CHANGE_NOTICE_MS - 1), NOW), false);
  for (const state of ["CANCELLED", "COMPLETED"]) assert.equal(canChangeLesson(state, new Date(NOW + 2 * CHANGE_NOTICE_MS), NOW), false);
});
test("Cancellation preserves history, releases the slot and credits the Abo only once", async () => {
  const route = routeFixture();
  assert.equal((await route.patch({ action: "cancel" })).status, 200);
  assert.equal(route.store.booking.status, "CANCELLED"); assert.equal(route.store.slots.old.isBooked, false); assert.equal(route.store.credit, 3);
  assert.equal(route.store.invoice.cancelled, true); assert.equal(route.store.invoice.paidCents, 4000);
  assert.equal((await route.patch({ action: "cancel" })).status, 200); assert.equal(route.store.credit, 3);
});
test("Rescheduling preserves price, receipts and credits and requests a new confirmation", async () => {
  const route = routeFixture();
  assert.equal((await route.patch({ action: "reschedule", slotId: "next" })).status, 200);
  assert.equal(route.store.booking.slotId, "next"); assert.equal(route.store.booking.status, "PENDING");
  assert.equal(route.store.slots.old.isBooked, false); assert.equal(route.store.slots.next.isBooked, true); assert.equal(route.store.credit, 2);
  assert.deepEqual(route.store.invoice, { amountCents: 9200, paidCents: 4000, cancelled: false });
});
test("Server rejects changes inside 24 hours and any access to another customer's booking", async () => {
  const route = routeFixture(); route.store.slots.old.startTime = new Date(NOW + CHANGE_NOTICE_MS - 1);
  assert.equal((await route.patch({ action: "cancel" })).status, 409); assert.equal(route.store.credit, 2); assert.equal(route.store.booking.status, "CONFIRMED");
  route.setUser("other"); assert.equal((await route.patch({ action: "cancel" })).status, 404);
  route.setUser(null); assert.equal((await route.patch({ action: "cancel" })).status, 401);
});
test("A taken new slot cannot release the old booking or change its invoice", async () => {
  const route = routeFixture(); route.store.slots.next.isBooked = true;
  assert.equal((await route.patch({ action: "reschedule", slotId: "next" })).status, 409);
  assert.equal(route.store.booking.slotId, "old"); assert.equal(route.store.slots.old.isBooked, true); assert.equal(route.store.credit, 2); assert.equal(route.store.invoice.cancelled, false);
});
