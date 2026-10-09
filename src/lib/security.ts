// Per-process limits provide a baseline. Multiple production instances need a shared limiter.
type Bucket = { count: number; expires: number };
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;
export function takeRateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  for (const [id, entry] of buckets) if (entry.expires <= now) buckets.delete(id);
  const entry = buckets.get(key);
  if (!entry) {
    // Fail closed at capacity rather than evicting active limits.
    if (buckets.size >= MAX_BUCKETS) return false;
    buckets.set(key, { count: 1, expires: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
export function clearRateLimit(key: string) { buckets.delete(key); }
export function mutationRequestError(request: Request): { status: number; error: string } | null {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return null;
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin !== null && origin !== new URL(request.url).origin)) {
    return { status: 403, error: "Anfrage von einer fremden Website ist nicht erlaubt." };
  }
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") ?? "")) {
    return { status: 415, error: "Bitte sende die Anfrage im JSON-Format." };
  }
  const length = request.headers.get("content-length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > 32768)) {
    return { status: 413, error: "Die Anfrage ist zu gross." };
  }
  return null;
}
