"use client";
import TranslatedContent from "@/components/TranslatedContent";


import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { safeReturnPath } from "@/lib/customer";
import AuthPanel from "@/components/customer/AuthPanel";
import { signIn } from "next-auth/react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const returnPath = safeReturnPath(searchParams.get("next"));
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let accountCreated = false;
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: form.email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registrierung fehlgeschlagen.");
        return;
      }

      accountCreated = true;
      const signInRes = await signIn("credentials", {
        email: form.email.trim(),
        password: form.password,
        redirect: false,
      });


      if (!signInRes || signInRes.error) {
        router.push(`/login?next=${encodeURIComponent(returnPath)}`);
        return;
      }

      router.push(returnPath);
      router.refresh();
    } catch { setError(accountCreated ? "Dein Konto wurde erstellt. Bitte melde dich über „Jetzt anmelden“ an." : "Dein Konto konnte gerade nicht erstellt werden. Bitte versuche es erneut."); }
    finally { setLoading(false); }
  }

  return <TranslatedContent>{(
    <AuthPanel>
      <div>
        <h1 className="font-jakarta text-2xl font-extrabold text-ink">Konto erstellen</h1>
        <p className="mt-2 text-sm text-ink/60">
          Registriere dich, um Fahrstunden zu buchen und deine Termine zu verwalten.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="register-name" className="text-sm font-semibold text-ink">Name</label>
            <input
              required
              id="register-name" name="name" autoComplete="name" type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
              className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-base focus:border-accent-dark focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="text-sm font-semibold text-ink">E-Mail</label>
            <input
              required
              id="register-email" name="email" autoComplete="email" type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-base focus:border-accent-dark focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="register-phone" className="text-sm font-semibold text-ink">Telefon (optional)</label>
            <input
              id="register-phone" name="phone" autoComplete="tel" type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={loading}
              className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-base focus:border-accent-dark focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="text-sm font-semibold text-ink">Passwort</label>
            <input
              required
              minLength={8}
              id="register-password" name="password" autoComplete="new-password" type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
              className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-base focus:border-accent-dark focus:outline-none"
            />
          </div>

          <p className="text-xs text-ink/60">Verwende mindestens 8 Zeichen für dein Passwort.</p>
          <p className="text-xs leading-relaxed text-ink/60">
            Wie wir deine Angaben für dein Kundenkonto und deine Buchungen bearbeiten, erfährst du in unserer{" "}
            <Link href="/datenschutz" className="font-semibold text-accent-dark hover:underline">
              Datenschutzerklärung
            </Link>.
          </p>

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-action-green px-4 py-3 font-semibold text-white hover:bg-action-green/90 disabled:opacity-60"
          >
            {loading ? "Wird erstellt..." : "Registrieren"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          Bereits ein Konto?{" "}
          <Link href={`/login?next=${encodeURIComponent(returnPath)}`} className="font-semibold text-accent-dark">
            Jetzt anmelden
          </Link>
        </p>
      </div>
    </AuthPanel>
  )}</TranslatedContent>;
}


export default function RegisterPage() {
  return <TranslatedContent>{<Suspense fallback={<p className="p-8" role="status">Registrierung wird geladen …</p>}><RegisterForm /></Suspense>}</TranslatedContent>;
}
