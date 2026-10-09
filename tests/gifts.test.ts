import test from "node:test";
import assert from "node:assert/strict";
import {
  giftTotal,
  validGiftAmount,
  restoreCart,
  orderSchema,
} from "../src/lib/gift-shared";
test("cart recovery rejects malformed prices and preserves separate recipients", () => {
  assert.deepEqual(restoreCart("bad"), []);
  const items = restoreCart(
    JSON.stringify([
      { id: "a", amountCents: 10000, recipient: "Max", message: "" },
      { id: "b", amountCents: 10000, recipient: "Anna", message: "" },
      { id: "c", amountCents: -1, recipient: "Bad", message: "" },
    ]),
  );
  assert.equal(items.length, 2);
  assert.equal(items[1].recipient, "Anna");
  assert.equal(giftTotal(items), 20000);
});
test("fixed amounts and configurable custom ranges are checked in integer cents", () => {
  const settings = { minCents: 7500, maxCents: 20000 };
  assert.equal(validGiftAmount(5000, settings), true);
  assert.equal(validGiftAmount(7499, settings), false);
  assert.equal(validGiftAmount(7500, settings), false);
  assert.equal(validGiftAmount(10000, settings), true);
  assert.equal(validGiftAmount(10002, settings), false);
  assert.equal(validGiftAmount(15000, settings), true);
  assert.equal(validGiftAmount(20001, settings), false);
  assert.equal(validGiftAmount(7500.5, settings), false);
});
test("checkout never accepts online payments, invalid recipients or unacknowledged terms", () => {
  const body = {
    requestId: crypto.randomUUID(),
    firstName: "Test",
    lastName: "Name",
    email: "EXAMPLE@example.invalid",
    phone: "+41 78 000 00 00",
    lang: "de",
    method: "CASH",
    accepted: true,
    totalCents: 10000,
    items: [{ amountCents: 10000, recipient: "Éléonore", message: "" }],
  };
  assert.equal(orderSchema.parse(body).email, "example@example.invalid");
  assert.equal(
    orderSchema.safeParse({ ...body, method: "STRIPE" }).success,
    false,
  );
  assert.equal(
    orderSchema.safeParse({ ...body, accepted: false }).success,
    false,
  );
  assert.equal(
    orderSchema.safeParse({
      ...body,
      items: [{ amountCents: 10000, recipient: "\n", message: "" }],
    }).success,
    false,
  );
});
