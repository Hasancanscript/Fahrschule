"use client";
import { useLanguage } from "@/lib/i18n";
import type { CustomerBooking } from "@/lib/customer";
import BookingCard from "./BookingCard";
type Group = { key: string; label: string; category: "abo" | "single" | "course"; bookings: CustomerBooking[] };
export default function BookingGroups({ bookings, downloading, now, onChanged, onDownload }: { bookings: CustomerBooking[]; downloading: string | null; now: number; onChanged: (message: string) => void; onDownload: (booking: CustomerBooking) => void }) {
  const { lang } = useLanguage();
  const groups = new Map<string, Group>();
  for (const booking of bookings) {
    const category = booking.kind === "course" ? "course" : booking.packageName ? "abo" : "single";
    const key = category === "abo" ? "abo:" + (booking.userPackageId ?? booking.packageName) : category === "course" ? "course:" + booking.title : "single";
    const label = category === "abo" ? (lang === "fr" ? "Leçons de ton " : "Fahrstunden aus deinem ") + booking.packageName : category === "single" ? (lang === "fr" ? "Leçons individuelles" : "Einzel-Fahrstunden") : booking.title === "VKU" ? (lang === "fr" ? "Cours ECR (VKU)" : "VKU-Kurs") : booking.title === "Nothelferkurs" ? (lang === "fr" ? "Cours de premiers secours" : "Nothelferkurs") : booking.title;
    if (!groups.has(key)) groups.set(key, { key, label, category, bookings: [] });
    groups.get(key)!.bookings.push(booking);
  }
  const priority = { abo: 0, single: 1, course: 2 };
  return <div className="space-y-9">{[...groups.values()].sort((a,b) => priority[a.category] - priority[b.category]).map(group => (
    <section key={group.key} aria-label={group.label}>
      <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-ink/10 pb-3">
        <h3 className="text-lg font-bold text-ink">{group.label}</h3>
        <span className="rounded-full border border-ink/15 bg-white px-3 py-1 text-xs font-semibold text-ink/65">{group.bookings.length} {lang === "fr" ? "rendez-vous" : group.bookings.length === 1 ? "Termin" : "Termine"}</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{group.bookings.map(booking => <BookingCard key={booking.kind + ":" + booking.id} grouped booking={booking} pending={downloading === booking.kind + ":" + booking.id} onDownload={onDownload} now={now} onChanged={onChanged} />)}</div>
    </section>
  ))}</div>;
}
