export type CustomerPayment = { totalCents: number | null; paidCents: number; remainingCents: number | null; status: string };
export type CustomerBooking = {
  id: string; kind: "lesson" | "course"; title: string; status: string;
  startTime: string; endTime: string; location: string | null; notes: string | null;
  packageName: string | null; userPackageId?: string | null; packageRemaining?: number | null; payment: CustomerPayment;
};
export type CustomerAccount = {
  user: { name: string; email: string; phone: string | null };
  bookings: CustomerBooking[];
  packages: { id: string; name: string; lessonsTotal: number; lessonsRemaining: number; purchasedAt: string; payment: CustomerPayment }[];
};
export const bookingStatus: Record<string, string> = { PENDING: "Bestätigung ausstehend", CONFIRMED: "Bestätigt", CANCELLED: "Storniert", COMPLETED: "Abgeschlossen" };
export function bookingDate(iso: string, lang: "de" | "fr" = "de") {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-CH" : "de-CH", { timeZone: "Europe/Zurich", weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(iso));
}
export function bookingTime(iso: string) {
  return new Intl.DateTimeFormat("de-CH", { timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));
}
export function bookingRange(booking: Pick<CustomerBooking, "startTime" | "endTime">, lang: "de" | "fr" = "de") {
  const separator = lang === "fr" ? " à " : " bis ";
  const suffix = lang === "fr" ? "" : " Uhr";
  const sameDay = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich" });
  return sameDay.format(new Date(booking.startTime)) === sameDay.format(new Date(booking.endTime))
    ? `${bookingTime(booking.startTime)}${separator}${bookingTime(booking.endTime)}${suffix}`
    : `${bookingTime(booking.startTime)}${suffix}${separator}${bookingDate(booking.endTime, lang)}, ${bookingTime(booking.endTime)}${suffix}`;
}
export function upcomingBookings(bookings: CustomerBooking[], now: number) {
  return bookings.filter(b => b.status !== "CANCELLED" && b.status !== "COMPLETED" && new Date(b.endTime).getTime() > now).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}
export function safeReturnPath(path: string | null) {
  return path && path.startsWith("/") && !path.startsWith("//") && !path.includes("\\") ? path : "/booking";
}

