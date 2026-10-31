import { NextResponse } from "next/server";
import { mutationRequestError, takeRateLimit } from "./security";

/**
 * Gemeinsame Prüfung für die Anfrage-Formulare:
 * nur JSON von der eigenen Website, nicht zu gross, höchstens 5 Anfragen pro 10 Minuten und Adresse.
 * Gibt eine Fehlerantwort zurück oder null, wenn alles in Ordnung ist.
 */
export function guardRequest(request: Request, bucket: string) {
  const failure = mutationRequestError(request);
  if (failure) return NextResponse.json({ error: failure.error }, { status: failure.status });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unbekannt";
  if (!takeRateLimit(`${bucket}:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }
  return null;
}
