// Schriftzug neben dem Logo: "Fahrschule fürs" und "LEBEN" weiss auf blauem Feld.
// translate="no": der Name wird nicht übersetzt.
export default function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span translate="no" className={`inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 leading-none ${className}`}>
      <span>Fahrschule fürs</span>
      <span className="rounded-md bg-action-blue px-2 py-1 text-[0.8em] font-bold uppercase tracking-[0.22em] text-white">
        Leben
      </span>
    </span>
  );
}
