"use client";
import TranslatedContent from "@/components/TranslatedContent";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import AuthPanel from "@/components/customer/AuthPanel";
import { safeReturnPath } from "@/lib/customer";
const INPUT = "mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base outline-none focus:border-accent-dark focus:ring-2 focus:ring-accent-dark/15";
function LoginForm() {
  const router = useRouter(), searchParams = useSearchParams();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(null); setLoading(true);
    try {
      const result = await signIn("credentials", { email: email.trim(), password, redirect: false });
      if (!result || result.error) { setError("Die E-Mail-Adresse oder das Passwort stimmt nicht. Bitte prüfe deine Angaben."); return; }
      router.push(safeReturnPath(searchParams.get("next"))); router.refresh();
    } catch { setError("Die Anmeldung ist gerade nicht möglich. Bitte versuche es erneut."); }
    finally { setLoading(false); }
  }
  return <TranslatedContent>{<><h1 className="text-2xl font-extrabold text-ink">Willkommen zurück</h1><p className="mt-3 text-sm leading-relaxed text-ink/60">Melde dich an. Deine Buchungen und Termine warten auf dich.</p>
    <form onSubmit={submit} className="mt-8 space-y-5"><fieldset disabled={loading} className="space-y-5">
      <div><label htmlFor="login-email" className="text-sm font-semibold">E-Mail-Adresse</label><input id="login-email" name="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className={INPUT} placeholder="name@beispiel.ch" /></div>
      <div><label htmlFor="login-password" className="text-sm font-semibold">Passwort</label><div className="relative"><input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className={`${INPUT} pr-24`} /><button type="button" aria-controls="login-password" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-1.5 min-h-9 px-2 text-xs font-semibold text-accent-dark">{showPassword ? "Verbergen" : "Anzeigen"}</button></div></div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={loading} type="submit" className="w-full rounded-xl bg-action-blue px-4 py-3.5 text-sm font-bold text-white transition hover:bg-action-blue-hover disabled:opacity-60">{loading ? "Du wirst angemeldet …" : "Anmelden"}</button>
    </fieldset></form>
    <p className="mt-5 text-xs leading-relaxed text-ink/60">Passwort vergessen? <a href="tel:+41787778161" className="font-semibold text-accent-dark underline">Kontaktiere die Fahrschule</a>, damit wir dir helfen können.</p>
    <div className="mt-8 border-t border-ink/10 pt-6"><p className="text-sm text-ink/60">Du bist zum ersten Mal hier?</p><Link href={`/register?next=${encodeURIComponent(safeReturnPath(searchParams.get("next")))}`} className="mt-3 inline-flex w-full justify-center rounded-xl border border-ink/15 px-4 py-3 text-sm font-bold transition hover:bg-surface-2">Kundenkonto erstellen</Link></div>
  </>}</TranslatedContent>;
}
export default function LoginPage() { return <TranslatedContent>{<AuthPanel><Suspense fallback={<p role="status" className="text-sm text-ink/60">Anmeldung wird geladen …</p>}><LoginForm /></Suspense></AuthPanel>}</TranslatedContent>; }
