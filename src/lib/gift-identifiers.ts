import { randomBytes } from "node:crypto";
// Sixteen independent base-32 characters keep 80 bits of unpredictable entropy.
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export function giftCode() {
 const value = [...randomBytes(16)].map(byte => alphabet[byte & 31]).join("");
 return "GS-" + value.match(/.{4}/g)!.join("-");
}
export function giftNumber() {
 const value = [...randomBytes(10)].map(byte => alphabet[byte & 31]).join("");
 return "GB-" + value.slice(0,5) + "-" + value.slice(5);
}
