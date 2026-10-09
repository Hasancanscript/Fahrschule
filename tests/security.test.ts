import test from "node:test";
import assert from "node:assert/strict";
import { takeRateLimit, clearRateLimit, mutationRequestError } from "../src/lib/security";
import { registerSchema, loginSchema, bookingSchema } from "../src/lib/validation";

test("Login limits stop repeated attempts, reset after expiry and stay independent", () => {
  const key = "test:login";
  assert.equal(takeRateLimit(key, 2, 1000, 100), true);
  assert.equal(takeRateLimit(key, 2, 1000, 200), true);
  assert.equal(takeRateLimit(key, 2, 1000, 300), false);
  assert.equal(takeRateLimit("test:other", 2, 1000, 300), true);
  assert.equal(takeRateLimit(key, 2, 1000, 1100), true);
  clearRateLimit(key);
  assert.equal(takeRateLimit(key, 2, 1000, 1101), true);
});

test("API mutations reject cross-origin, form and oversized requests", () => {
  const request = (headers: Record<string, string>) => new Request("https://example.test/api/bookings", { method: "POST", headers });
  const json = { "content-type": "application/json" };
  assert.equal(mutationRequestError(request({ ...json, origin: "https://example.test" })), null);
  assert.equal(mutationRequestError(request({ ...json, origin: "https://evil.test" }))?.status, 403);
  assert.equal(mutationRequestError(request({ ...json, "sec-fetch-site": "cross-site" }))?.status, 403);
  assert.equal(mutationRequestError(request({ ...json, origin: "null" }))?.status, 403);
  assert.equal(mutationRequestError(request({ "content-type": "application/x-www-form-urlencoded" }))?.status, 415);
  assert.equal(mutationRequestError(request({ ...json, "content-length": "32769" }))?.status, 413);
  assert.equal(mutationRequestError(new Request("https://example.test/api/bookings")), null);
});

test("Account validation normalizes email and limits bcrypt inputs by UTF-8 bytes", () => {
  const valid = { name: "Test Kunde", email: "  TEST@EXAMPLE.TEST ", password: "a-secure-password" };
  assert.equal(registerSchema.parse(valid).email, "test@example.test");
  assert.equal(loginSchema.parse(valid).email, "test@example.test");
  assert.equal(registerSchema.safeParse({ ...valid, password: "ä".repeat(37) }).success, false);
  assert.equal(loginSchema.safeParse({ ...valid, password: "a".repeat(73) }).success, false);
  assert.equal(registerSchema.safeParse({ ...valid, name: "a".repeat(101) }).success, false);
  assert.equal(bookingSchema.safeParse({ serviceId: "service", slotId: "slot", notes: "a".repeat(4001) }).success, false);
});
