import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as validation from "../src/lib/validation";
import * as pricing from "../src/lib/pricing";

type Slot = { id: string; startTime: Date; endTime: Date; isBooked: boolean };
type Booking = { id: string; userId: string; slotId: string; status: string; userPackageId: string | null };
function fixture() {
  const require = createRequire(import.meta.url);
  let userId: string | null = "owner";
  let failCreateAt = 0;
  let reserveRace = false;
  let store = {
    credit: 4, packageOwner: "owner", invoiceCount: 0, bookings: [] as Booking[],
    slots: Array.from({ length: 5 }, (_, i): Slot => ({ id: "slot-" + i, startTime: new Date(Date.UTC(2099, 0, 1 + i, 10)), endTime: new Date(Date.UTC(2099, 0, 1 + i, 10, 45)), isBooked: false })),
  };
  const tx = {
    user: { findUniqueOrThrow: async () => ({ id: userId, name: "Test Kunde" }) },
    service: { findUniqueOrThrow: async () => ({ id: "lesson", name: "Fahrstunde", priceCents: 9000, discountPercent: 0 }) },
    slot: {
      findMany: async ({ where }: { where: { id: { in: string[] } } }) => store.slots.filter(s => where.id.in.includes(s.id)).sort((a, b) => +a.startTime - +b.startTime),
      updateMany: async ({ where }: { where: { id: { in: string[] }; startTime: { gt: Date } } }) => {
        let count = 0;
        for (const slot of store.slots) if (where.id.in.includes(slot.id) && !slot.isBooked && slot.startTime > where.startTime.gt) {
          if (reserveRace && slot.id === where.id.in[where.id.in.length - 1]) continue;
          slot.isBooked = true; count++;
        }
        return { count };
      },
    },
    userPackage: { updateMany: async ({ where, data }: { where: { id: string; userId: string; lessonsRemaining: { gte: number } }; data: { lessonsRemaining: { decrement: number } } }) => {
      if (where.id !== "abo" || where.userId !== store.packageOwner || store.credit < where.lessonsRemaining.gte) return { count: 0 };
      store.credit -= data.lessonsRemaining.decrement; return { count: 1 };
    } },
    booking: {
      findFirst: async ({ where }: { where: { userId: string; status: { in: string[] }; OR: { slot: { startTime: { lt: Date }; endTime: { gt: Date } } }[] } }) => store.bookings.find(b => {
        const slot = store.slots.find(s => s.id === b.slotId)!;
        return b.userId === where.userId && where.status.in.includes(b.status) && where.OR.some(range => slot.startTime < range.slot.startTime.lt && slot.endTime > range.slot.endTime.gt);
      }) ?? null,
      create: async ({ data }: { data: Omit<Booking, "id"> }) => {
        if (failCreateAt && store.bookings.length + 1 === failCreateAt) throw Error("Simulierter Speicherfehler");
        const created = { id: "booking-" + store.bookings.length, ...data };
        store.bookings.push(created); return created;
      },
    },
  };
  const source = readFileSync(new URL("../src/app/api/bookings/route.ts", import.meta.url), "utf8");
  const compiledModule = { exports: {} as { POST: (request: Request) => Promise<Response> } };
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    module: compiledModule, exports: compiledModule.exports, Date, Response,
    require: (name: string) => {
      if (name === "@/auth") return { auth: async () => userId ? { user: { id: userId, role: "CUSTOMER" } } : null };
      if (name === "@/lib/validation") return validation;
      if (name === "@/lib/pricing") return pricing;
      if (name === "@/lib/invoices") return { createInvoice: async () => { store.invoiceCount++; } };
      if (name === "@/lib/prisma") return { prisma: { $transaction: async (work: (client: typeof tx) => Promise<unknown>, options: { isolationLevel: string }) => {
        assert.equal(options.isolationLevel, "Serializable"); const snapshot = structuredClone(store);
        try { return await work(tx); } catch (error) { store = snapshot; throw error; }
      } } };
      return require(name);
    },
  });
  return { get store() { return store; }, setUser: (id: string | null) => { userId = id; }, failCreate: (at: number) => { failCreateAt = at; }, race: () => { reserveRace = true; },
    post: (body: object) => compiledModule.exports.POST(new Request("http://localhost/api/bookings", { method: "POST", body: JSON.stringify(body) })) };
}
const batch = { serviceId: "lesson", slotIds: ["slot-0", "slot-1", "slot-2"], userPackageId: "abo", expectedPriceCents: 1 };
test("Three Abo dates reserve all slots, debit exactly three credits and create no extra invoices", async () => {
  const route = fixture(); const response = await route.post(batch);
  assert.equal(response.status, 200); assert.equal((await response.json()).length, 3);
  assert.equal(route.store.credit, 1); assert.equal(route.store.bookings.length, 3); assert.equal(route.store.invoiceCount, 0);
  assert.equal(route.store.slots.filter(s => s.isBooked).length, 3);
  assert.equal((await route.post(batch)).status, 409); assert.equal(route.store.credit, 1);
});
test("Insufficient credit and another customer's Abo leave every selected slot and credit unchanged", async () => {
  for (const mode of ["credit", "owner"]) {
    const route = fixture(); if (mode === "credit") route.store.credit = 2; else route.setUser("other");
    const before = structuredClone(route.store);
    assert.equal((await route.post(batch)).status, 409); assert.deepEqual(route.store, before);
  }
});
test("An unavailable slot, reservation race or later creation failure rolls back the entire selection", async () => {
  for (const mode of ["unavailable", "race", "create"]) {
    const route = fixture(); if (mode === "unavailable") route.store.slots[1].isBooked = true; else if (mode === "race") route.race(); else route.failCreate(2);
    const before = structuredClone(route.store);
    assert.equal((await route.post(batch)).status, 409); assert.deepEqual(route.store, before);
  }
});
test("Overlapping dates and existing personal bookings cannot consume Abo credit", async () => {
  const route = fixture(); route.store.slots[1].startTime = new Date(+route.store.slots[0].startTime + 1000);
  const before = structuredClone(route.store); assert.equal((await route.post(batch)).status, 409); assert.deepEqual(route.store, before);
  const existing = fixture(); existing.store.bookings.push({ id: "existing", userId: "owner", slotId: "slot-0", status: "CONFIRMED", userPackageId: null });
  assert.equal((await existing.post(batch)).status, 409); assert.equal(existing.store.credit, 4);
});
test("Guests, duplicate dates, empty batches, more than twenty dates and ambiguous requests are rejected", async () => {
  const route = fixture(); route.setUser(null); assert.equal((await route.post(batch)).status, 401); route.setUser("owner");
  for (const body of [{ ...batch, slotIds: [] }, { ...batch, slotIds: ["slot-0", "slot-0"] }, { ...batch, slotIds: Array.from({ length: 21 }, (_, i) => "s" + i) }, { ...batch, slotId: "slot-0" }]) assert.equal((await route.post(body)).status, 400);
  assert.equal(route.store.credit, 4); assert.equal(route.store.bookings.length, 0);
});
test("Single-date callers remain compatible and direct multi-bookings invoice each date at the checked price", async () => {
  const single = fixture(); const response = await single.post({ serviceId: "lesson", slotId: "slot-0", expectedPriceCents: 9000 });
  assert.equal(response.status, 200); assert.equal((await response.json()).slotId, "slot-0"); assert.equal(single.store.invoiceCount, 1);
  const direct = fixture(); assert.equal((await direct.post({ serviceId: "lesson", slotIds: ["slot-0", "slot-1"], expectedPriceCents: 9000 })).status, 200); assert.equal(direct.store.invoiceCount, 2); assert.equal(direct.store.credit, 4);
  const changed = fixture(); assert.equal((await changed.post({ serviceId: "lesson", slotIds: ["slot-0", "slot-1"], expectedPriceCents: 1 })).status, 409); assert.equal(changed.store.bookings.length, 0);
});
