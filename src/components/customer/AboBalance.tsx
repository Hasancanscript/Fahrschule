"use client";
import { useLanguage } from "@/lib/i18n";
import type { CustomerAccount } from "@/lib/customer";
export default function AboBalance({ account, onBook }: { account: CustomerAccount; onBook: (id: string) => void }) {
  const { lang } = useLanguage();
  const t = (de: string, fr: string) => lang === "fr" ? fr : de;
  if (!account.packages.length) return null;
  return (
    <section aria-label={t("Dein Abo-Guthaben", "Ton crédit d’abonnement")} className="mb-6 grid gap-4 lg:grid-cols-2">
      {account.packages.map(abo => {
        const reserved = account.bookings.filter(b => b.userPackageId === abo.id && ["PENDING", "CONFIRMED"].includes(b.status)).length;
        const used = Math.max(0, abo.lessonsTotal - abo.lessonsRemaining - reserved);
        return (
          <article key={abo.id} className="rounded-2xl border border-ink/15 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h2 className="text-base font-bold">{abo.name}</h2><p className="mt-2"><strong className="text-3xl font-extrabold text-action-blue">{abo.lessonsRemaining}</strong><span className="ml-2 text-sm text-ink/65">{t("von", "sur")} {abo.lessonsTotal} {t("Fahrstunden noch buchbar", "leçons encore disponibles")}</span></p></div>
              {abo.lessonsRemaining > 0 && <button type="button" onClick={() => onBook(abo.id)} className="inline-flex min-h-11 items-center rounded-xl bg-action-blue px-4 py-3 text-sm font-bold text-white hover:bg-action-blue-hover">{t("Mit diesem Abo buchen", "Réserver avec cet abonnement")}</button>}
            </div>
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-3 text-sm"><div className="flex gap-2"><dt className="text-ink/65">{t("Für Termine reserviert", "Réservées pour des rendez-vous")}:</dt><dd className="font-semibold">{reserved}</dd></div><div className="flex gap-2"><dt className="text-ink/65">{t("Bereits verwendet", "Déjà utilisées")}:</dt><dd className="font-semibold">{used}</dd></div></dl>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">{t("Gebuchte Termine sind bereits vom freien Guthaben abgezogen. Bei einer fristgerechten Stornierung erhältst du die Fahrstunde zurück.", "Les rendez-vous réservés sont déjà déduits du crédit disponible. En cas d’annulation dans le délai prévu, la leçon est recréditée.")}</p>
          </article>
        );
      })}
    </section>
  );
}
