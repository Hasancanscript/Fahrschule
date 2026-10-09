
import TranslatedContent from "@/components/TranslatedContent";
import Link from "next/link";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return <TranslatedContent>{(
    <div className="bg-surface pb-24 pt-10">
      <div className="site-container">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 transition hover:text-ink">
          ← Zurück zur Startseite
        </Link>

        <h1 className="mt-6 font-jakarta text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
        {updated && <p className="mt-2 text-sm text-ink/40">Stand: {updated}</p>}

        <div className="mt-10 flex flex-col gap-6 text-sm leading-relaxed text-ink/70 sm:text-base">{children}</div>
      </div>
    </div>
  )}</TranslatedContent>;
}
