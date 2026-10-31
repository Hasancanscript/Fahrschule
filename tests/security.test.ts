import test from "node:test";
import assert from "node:assert/strict";
import { takeRateLimit, clearRateLimit, mutationRequestError } from "../src/lib/security";
import { inquirySchema, inquiryText } from "../src/lib/inquiry";

test("Rate limits stop repeated attempts, reset after expiry and stay independent", () => {
  const key = "test:anfrage";
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

test("Inquiry form normalizes email, requires consent and blocks header injection", () => {
  const valid = { offer: "vku", name: "Test Kunde", email: "  TEST@EXAMPLE.TEST ", phone: "+41 78 000 00 00", preferredTimes: "Samstag", message: "", lang: "de", accepted: true };
  assert.equal(inquirySchema.parse(valid).email, "test@example.test");
  assert.equal(inquirySchema.safeParse({ ...valid, accepted: false }).success, false);
  assert.equal(inquirySchema.safeParse({ ...valid, offer: "admin" }).success, false);
  assert.equal(inquirySchema.safeParse({ ...valid, name: "Test\nBcc: x@example.test" }).success, false);
  assert.equal(inquirySchema.safeParse({ ...valid, phone: "abc" }).success, false);
  assert.equal(inquirySchema.safeParse({ ...valid, message: "a".repeat(2001) }).success, false);
  assert.match(inquiryText(inquirySchema.parse(valid)), /VKU/);
});
